package com.printrm.studio.domain.stock;

import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;
    private final PiezaSTLRepository piezaRepository;

    public List<Producto> getAll() {
        return repository.findAll();
    }

    @Transactional
    public Producto save(ProductoRequestDTO dto) {
        Producto producto = dto.getId() != null ? 
            repository.findById(UUID.fromString(dto.getId())).orElse(new Producto()) : 
            new Producto();

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioSugerido(dto.getPrecioSugerido());
        producto.setCantidadStock(dto.getCantidadStock() != null ? dto.getCantidadStock() : 0);

        if (dto.getParteIds() != null) {
            List<PiezaSTL> partes = dto.getParteIds().stream()
                .map(id -> piezaRepository.findById(id).orElseThrow(() -> new RuntimeException("Pieza no encontrada: " + id)))
                .collect(Collectors.toList());
            producto.setPartes(partes);
        }

        return repository.save(producto);
    }

    @Transactional
    public void updateStock(String id, Integer delta) {
        Producto producto = repository.findById(UUID.fromString(id))
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setCantidadStock(producto.getCantidadStock() + delta);
        repository.save(producto);
    }
}
