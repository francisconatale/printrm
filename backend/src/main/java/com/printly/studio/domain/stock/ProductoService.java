package com.printly.studio.domain.stock;

import com.printly.studio.domain.ajustes.AjustesDTO;
import com.printly.studio.domain.ajustes.AjustesService;
import com.printly.studio.domain.biblioteca.PiezaSTL;
import com.printly.studio.domain.biblioteca.PiezaSTLRepository;
import com.printly.studio.domain.biblioteca.PiezaSTLResponseDTO;
import com.printly.studio.domain.calculo.CostCalculationResult;
import com.printly.studio.domain.calculo.CostCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final com.printly.studio.domain.finanzas.TransaccionService transaccionService;
    private final CostCalculationService costCalculationService;
    private final AjustesService ajustesService;
    private final ProductoMapper mapper;

    public List<ProductoResponseDTO> getAll() {
        return repository.findAllByDeletedFalse().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public Page<ProductoResponseDTO> getAll(Pageable pageable) {
        return repository.findAllByDeletedFalse(pageable)
                .map(mapper::toResponseDto);
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
                    com.printly.studio.utils.UUIDUtils.parseUUID(id);
                    return piezaRepository.findById(id).orElseThrow(() -> new com.printly.studio.exception.ResourceNotFoundException("Pieza no encontrada: " + id));
                })
                .collect(Collectors.toList());
            producto.setPartes(partes);
        }

        Producto saved = repository.save(producto);

        if (isNew && initialStock > 0) {
            updateStock(saved.getId().toString(), initialStock); 
        }

        saved = repository.findById(saved.getId()).orElse(saved);

        return mapper.toResponseDto(saved);
    }

    @Transactional
    public void addStock(UUID productoId, Integer cantidad, Double costo) {
        addStock(productoId, cantidad, costo, null);
    }

    @Transactional
    public void addStock(UUID productoId, Integer cantidad, Double costo, UUID pedidoId) {
        Producto producto = repository.findById(productoId)
            .orElseThrow(() -> new com.printly.studio.exception.ResourceNotFoundException("Producto no encontrado"));
        
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

        UUID grupoId = UUID.randomUUID();

        transaccionService.registrarTransaccion(
            com.printly.studio.domain.finanzas.Transaccion.TipoTransaccion.EGRESO,
            com.printly.studio.domain.finanzas.Transaccion.CategoriaTransaccion.MATERIAL,
            -(costos.getCostoFilamento() * cantidad),
            "Filamento: " + cantidad + " unidades de " + producto.getNombre(),
            pedidoId,
            grupoId,
            producto.getId()
        );

        transaccionService.registrarTransaccion(
            com.printly.studio.domain.finanzas.Transaccion.TipoTransaccion.EGRESO,
            com.printly.studio.domain.finanzas.Transaccion.CategoriaTransaccion.ENERGIA,
            -(costos.getCostoEnergia() * cantidad),
            "Energía: " + cantidad + " unidades de " + producto.getNombre(),
            pedidoId,
            grupoId,
            producto.getId()
        );

        if (costos.getCostoError() != null && costos.getCostoError() > 0) {
            transaccionService.registrarTransaccion(
                com.printly.studio.domain.finanzas.Transaccion.TipoTransaccion.EGRESO,
                com.printly.studio.domain.finanzas.Transaccion.CategoriaTransaccion.MERMA,
                -(costos.getCostoError() * cantidad),
                "Merma: " + cantidad + " unidades de " + producto.getNombre(),
                pedidoId,
                grupoId,
                producto.getId()
            );
        }
    }

    @Transactional
    public void updateStock(String id, Integer delta) {
        Producto producto = repository.findById(UUID.fromString(id))
            .orElseThrow(() -> new com.printly.studio.exception.ResourceNotFoundException("Producto no encontrado"));
        
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
            throw new RuntimeException("Error inconsistencia de stock: no se pudo consumir la cantidad total de los lotes");
        }

        producto.setCantidadStock(producto.getCantidadStock() - cantidadAConsumir);
        repository.save(producto);
    }

    public void validarStockDisponible(Producto producto, int cantidadRequerida) {
        if (cantidadRequerida > 0 && producto.getCantidadStock() < cantidadRequerida) {
            throw new RuntimeException("Stock insuficiente para entregar el producto: " + producto.getNombre() 
                    + " (Requerido: " + cantidadRequerida + ", Disponible: " + producto.getCantidadStock() + ")");
        }
    }


    @Transactional
    public void delete(String id) {
        repository.deleteById(UUID.fromString(id));
    }
}
