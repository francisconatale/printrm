package com.printly.studio.domain.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    public Page<ProductoResponseDTO> getAll(@PageableDefault(size = 20) Pageable pageable) {
        return service.getAll(pageable);
    }

    @PostMapping
    public ProductoResponseDTO save(@RequestBody ProductoRequestDTO dto) {
        return service.save(dto);
    }

    @PatchMapping("/{id}/stock")
    public void updateStock(
            @PathVariable String id, 
            @RequestParam Integer delta,
            @RequestParam(required = false) Double costo) {
        if (delta > 0 && costo != null) {
            service.addStock(java.util.UUID.fromString(id), delta, costo, null);
        } else {
            service.updateStock(id, delta);
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
