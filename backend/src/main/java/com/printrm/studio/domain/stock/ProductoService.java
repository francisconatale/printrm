package com.printrm.studio.domain.stock;

import com.printrm.studio.domain.biblioteca.PiezaSTLResponseDTO;
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
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioSugerido(dto.getPrecioSugerido());
        
        // If it's a new product and has initial stock, we create an initial lot
        Integer initialStock = dto.getCantidadStock() != null ? dto.getCantidadStock() : 0;
        if (isNew) {
            producto.setCantidadStock(initialStock);
        }

        if (dto.getParteIds() != null) {
            List<PiezaSTL> partes = dto.getParteIds().stream()
                .map(id -> piezaRepository.findById(id).orElseThrow(() -> new RuntimeException("Pieza no encontrada: " + id)))
                .collect(Collectors.toList());
            producto.setPartes(partes);
        }

        Producto saved = repository.save(producto);

        if (isNew && initialStock > 0) {
            addStock(saved.getId(), initialStock, 0.0); // Default cost 0 for initial stock if not specified
        }

        return mapToResponseDTO(saved);
    }

    private ProductoResponseDTO mapToResponseDTO(Producto p) {
        return ProductoResponseDTO.builder()
                .id(p.getId().toString())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
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
        dto.setCostoBase(pieza.getCostoBase());
        dto.setImagenBase64(pieza.getImagenBase64());
        dto.setCreadoEn(pieza.getCreadoEn());
        if (pieza.getPerfilPreferido() != null) dto.setPerfilImpresoraNombre(pieza.getPerfilPreferido().getNombre());
        if (pieza.getFilamentoPreferido() != null) dto.setPerfilFilamentoNombre(pieza.getFilamentoPreferido().getNombre());
        if (pieza.getImpresionPreferida() != null) dto.setPerfilImpresionNombre(pieza.getImpresionPreferida().getNombre());
        return dto;
    }

    @Transactional
    public void addStock(UUID productoId, Integer cantidad, Double costo) {
        Producto producto = repository.findById(productoId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        // Cost-Tiered FIFO: Check if we can merge with the latest active lot
        Lote ultimoLote = loteRepository.findFirstByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionDesc(
            productoId, 0);
        
        if (ultimoLote != null && Math.abs(ultimoLote.getCostoUnitario() - costo) < 0.01) {
            // Same cost, merge into existing lot
            ultimoLote.setCantidadOriginal(ultimoLote.getCantidadOriginal() + cantidad);
            ultimoLote.setCantidadActual(ultimoLote.getCantidadActual() + cantidad);
            loteRepository.save(ultimoLote);
        } else {
            // Different cost or no active lot, create new one
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

    @Transactional
    public void updateStock(String id, Integer delta) {
        Producto producto = repository.findById(UUID.fromString(id))
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (delta > 0) {
            // If adding stock without specifying cost, we assume 0.0 or could take last lot's cost
            addStock(producto.getId(), delta, 0.0);
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
