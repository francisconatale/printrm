package com.printrm.studio.domain.finanzas;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transacciones")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService service;

    @GetMapping
    public List<Transaccion> getAll() {
        return service.getAll();
    }

    @GetMapping("/balance")
    public Double getBalance() {
        return service.getBalance();
    }
}
