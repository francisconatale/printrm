package com.printrm.studio.domain.stock;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;
import com.printrm.studio.domain.biblioteca.PiezaSTLResponseDTO;
import com.printrm.studio.domain.calculo.CostCalculationResult;
import com.printrm.studio.domain.calculo.CostCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;
    private final PiezaSTLRepository piezaRepository;
    private final LoteRepository loteRepository;
    private final com.printrm.studio.domain.finanzas.TransaccionService transaccionService;
    private final CostCalculationService costCalculationService;
    private final AjustesService ajustesService;

    public List<ProductoResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoResponseDTO save(ProductoRequestDTO dto) {
        boolean isNew = dto.getId() == null;
        Producto producto = !isNew ? 
            repository.findById(UUID.fromString(dto.getId())).orElse(new Producto()) : 
            new Producto();

        producto.setNombre(dto.getNombre());
        producto.setPrecioSugerido(dto.getPrecioSugerido());
        
        Integer initialStock = dto.getCantidadStock() != null ? dto.getCantidadStock() : 0;
        if (isNew) {
            producto.setCantidadStock(initialStock);
        }

        if (dto.getParteIds() != null) {
            List<PiezaSTL> partes = dto.getParteIds().stream()
                .map(id -> {
                    com.printrm.studio.utils.UUIDUtils.parseUUID(id);
                    return piezaRepository.findById(id).orElseThrow(() -> new com.printrm.studio.exception.ResourceNotFoundException("Pieza no encontrada: " + id));
                })
                .collect(Collectors.toList());
            producto.setPartes(partes);
        }

        Producto saved = repository.save(producto);

        if (isNew && initialStock > 0) {
            updateStock(saved.getId().toString(), initialStock); 
        }

        saved = repository.findById(saved.getId()).orElse(saved);

        return mapToResponseDTO(saved);
    }

    private ProductoResponseDTO mapToResponseDTO(Producto p) {
        return ProductoResponseDTO.builder()
                .id(p.getId().toString())
                .nombre(p.getNombre())
                .cantidadStock(p.getCantidadStock())
                .precioSugerido(p.getPrecioSugerido())
                .creadoEn(p.getCreadoEn())
                .actualizadoEn(p.getActualizadoEn())
                .partes(p.getPartes().stream().map(this::mapPiezaToDTO).collect(Collectors.toList()))
                .lotes(p.getLotes().stream()
                        .filter(l -> l.getCantidadActual() > 0)
                        .sorted(Comparator.comparing(Lote::getFechaCreacion))
                        .map(l -> ProductoResponseDTO.LoteDTO.builder()
                                .id(l.getId().toString())
                                .cantidadActual(l.getCantidadActual())
                                .costoUnitario(l.getCostoUnitario())
                                .fechaCreacion(l.getFechaCreacion())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private PiezaSTLResponseDTO mapPiezaToDTO(PiezaSTL pieza) {
        PiezaSTLResponseDTO dto = new PiezaSTLResponseDTO();
        dto.setId(pieza.getId());
        dto.setNombre(pieza.getNombre());
        dto.setFilePath(pieza.getFilePath());
        dto.setVolumenCm3(pieza.getVolumenCm3());
        dto.setPesoGramos(pieza.getPesoGramos());
        dto.setTiempoEstimado(pieza.getTiempoEstimado());
        dto.setImagenBase64(pieza.getImagenBase64());
        dto.setCreadoEn(pieza.getCreadoEn());
        if (pieza.getPerfilPreferido() != null) dto.setPerfilImpresoraNombre(pieza.getPerfilPreferido().getNombre());
        if (pieza.getFilamentoPreferido() != null) dto.setPerfilFilamentoNombre(pieza.getFilamentoPreferido().getNombre());
        if (pieza.getImpresionPreferida() != null) dto.setPerfilImpresionNombre(pieza.getImpresionPreferida().getNombre());
        
        // Dynamic cost calculation
        AjustesDTO ajustes = ajustesService.getAjustes();
        CostCalculationResult calc = costCalculationService.calculate(
            pieza.getPesoGramos(), 
            costCalculationService.parseHours(pieza.getTiempoEstimado()), 
            costCalculationService.parseMinutes(pieza.getTiempoEstimado()), 
            0.0, 
            pieza.getPerfilPreferido(), 
            pieza.getFilamentoPreferido(), 
            ajustes
        );
        dto.setCostoBase(calc != null ? calc.getCostoBase() : 0.0);
        dto.setCostoMaterial(calc != null ? calc.getCostoFilamento() : 0.0);
        dto.setCostoEnergia(calc != null ? calc.getCostoEnergia() : 0.0);
        
        return dto;
    }

    @Transactional
    public void addStock(UUID productoId, Integer cantidad, Double costo) {
        addStock(productoId, cantidad, costo, null);
    }

    @Transactional
    public void addStock(UUID productoId, Integer cantidad, Double costo, UUID pedidoId) {
        Producto producto = repository.findById(productoId)
            .orElseThrow(() -> new com.printrm.studio.exception.ResourceNotFoundException("Producto no encontrado"));
        
        actualizarInventarioLotes(producto, cantidad, costo);
        registrarGastosDeFabricacion(producto, cantidad, pedidoId);
    }

    private void actualizarInventarioLotes(Producto producto, Integer cantidad, Double costo) {
        Lote ultimoLote = loteRepository.findFirstByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionDesc(
            producto.getId(), 0);
        
        if (ultimoLote != null && Math.abs(ultimoLote.getCostoUnitario() - costo) < 0.01) {
            ultimoLote.setCantidadOriginal(ultimoLote.getCantidadOriginal() + cantidad);
            ultimoLote.setCantidadActual(ultimoLote.getCantidadActual() + cantidad);
            loteRepository.save(ultimoLote);
        } else {
            Lote nuevoLote = Lote.builder()
                .producto(producto)
                .cantidadOriginal(cantidad)
                .cantidadActual(cantidad)
                .costoUnitario(costo)
                .build();
            loteRepository.save(nuevoLote);
        }
        
        producto.setCantidadStock(producto.getCantidadStock() + cantidad);
        repository.save(producto);
    }

    private void registrarGastosDeFabricacion(Producto producto, Integer cantidad, UUID pedidoId) {
        AjustesDTO ajustes = ajustesService.getAjustes();
        CostCalculationResult costos = costCalculationService.calculateForProducto(producto, ajustes);

        transaccionService.registrarTransaccion(
            com.printrm.studio.domain.finanzas.Transaccion.TipoTransaccion.EGRESO,
            com.printrm.studio.domain.finanzas.Transaccion.CategoriaTransaccion.MATERIAL,
            -(costos.getCostoFilamento() * cantidad),
            "Filamento: " + cantidad + " uds de " + producto.getNombre() + " (Fabricación)",
            pedidoId
        );

        transaccionService.registrarTransaccion(
            com.printrm.studio.domain.finanzas.Transaccion.TipoTransaccion.EGRESO,
            com.printrm.studio.domain.finanzas.Transaccion.CategoriaTransaccion.ENERGIA,
            -(costos.getCostoEnergia() * cantidad),
            "Energía: " + cantidad + " uds de " + producto.getNombre() + " (Fabricación)",
            pedidoId
        );
    }

    @Transactional
    public void updateStock(String id, Integer delta) {
        Producto producto = repository.findById(UUID.fromString(id))
            .orElseThrow(() -> new com.printrm.studio.exception.ResourceNotFoundException("Producto no encontrado"));
        
        if (delta > 0) {
            AjustesDTO ajustes = ajustesService.getAjustes();
            CostCalculationResult costos = costCalculationService.calculateForProducto(producto, ajustes);
            addStock(producto.getId(), delta, costos.getCostoBase(), null);
        } else if (delta < 0) {
            consumeStock(producto, Math.abs(delta));
        }
    }

    private void consumeStock(Producto producto, Integer cantidadAConsumir) {
        if (producto.getCantidadStock() < cantidadAConsumir) {
            throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        List<Lote> lotesDisponibles = loteRepository.findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(
            producto.getId(), 0);

        int restante = cantidadAConsumir;
        for (Lote lote : lotesDisponibles) {
            if (restante <= 0) break;

            int aConsumirDeEsteLote = Math.min(lote.getCantidadActual(), restante);
            lote.setCantidadActual(lote.getCantidadActual() - aConsumirDeEsteLote);
            restante -= aConsumirDeEsteLote;
            loteRepository.save(lote);
        }

        if (restante > 0) {
            // This shouldn't happen if producto.getCantidadStock() was accurate
            throw new RuntimeException("Error inconsistencia de stock: no se pudo consumir la cantidad total de los lotes");
        }

        producto.setCantidadStock(producto.getCantidadStock() - cantidadAConsumir);
        repository.save(producto);
    }


    @Transactional
    public void delete(String id) {
        repository.deleteById(UUID.fromString(id));
    }
}
