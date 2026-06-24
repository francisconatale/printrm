package com.printrm.studio.domain.finanzas;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transacciones")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService service;

    @GetMapping
    public Page<Transaccion> getAll(@PageableDefault(size = 20) Pageable pageable) {
        return service.getAll(pageable);
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
