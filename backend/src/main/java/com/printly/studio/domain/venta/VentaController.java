package com.printly.studio.domain.venta;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService service;

    @PostMapping
    public VentaResponse registrar(@Valid @RequestBody VentaRequest request) {
        return service.registrar(request);
    }

    @GetMapping
    public List<VentaResponse> listar(
            @RequestParam(required = false) String fechaDesde,
            @RequestParam(required = false) String fechaHasta) {
        LocalDateTime desde = fechaDesde != null ? LocalDateTime.parse(fechaDesde) : null;
        LocalDateTime hasta = fechaHasta != null ? LocalDateTime.parse(fechaHasta) : null;
        return service.listar(desde, hasta);
    }

    @PostMapping("/{grupoId}/devolucion")
    public DevolucionResponse devolver(@PathVariable UUID grupoId, @Valid @RequestBody DevolucionRequest request) {
        return service.devolver(grupoId, request);
    }
}
