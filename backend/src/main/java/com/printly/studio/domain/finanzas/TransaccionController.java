package com.printly.studio.domain.finanzas;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transacciones")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService service;

    @GetMapping
    public Page<Transaccion> getAll(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String clienteId,
            @RequestParam(required = false) String fechaDesde,
            @RequestParam(required = false) String fechaHasta) {
        LocalDateTime desde = fechaDesde != null ? LocalDateTime.parse(fechaDesde) : null;
        LocalDateTime hasta = fechaHasta != null ? LocalDateTime.parse(fechaHasta) : null;
        if (clienteId != null && !clienteId.isBlank()) {
            return service.getByCliente(java.util.UUID.fromString(clienteId), pageable, desde, hasta);
        }
        return service.getAll(pageable, desde, hasta);
    }

    @GetMapping("/balance")
    public Double getBalance() {
        return service.getBalance();
    }

    @PostMapping
    public Transaccion create(@RequestBody Transaccion transaccion) {
        return service.create(transaccion);
    }
}
