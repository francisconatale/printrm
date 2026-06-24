package com.printrm.studio.domain.venta;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public List<VentaResponse> listar() {
        return service.listar();
    }

    @PostMapping("/{grupoId}/devolucion")
    public DevolucionResponse devolver(@PathVariable UUID grupoId, @Valid @RequestBody DevolucionRequest request) {
        return service.devolver(grupoId, request);
    }
}
