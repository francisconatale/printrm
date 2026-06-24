package com.printrm.studio.domain.venta;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void devolver(@PathVariable String grupoId, @Valid @RequestBody DevolucionRequest request) {
        service.devolver(grupoId, request);
    }
}
