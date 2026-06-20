package com.printrm.studio.domain.finanzas;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final TransaccionRepository repository;

    public List<Transaccion> getAll() {
        return repository.findAll();
    }

    public Double getBalance() {
        return repository.findAll().stream()
                .mapToDouble(t -> t.getMonto() != null ? t.getMonto() : 0.0)
                .sum();
    }

    public Transaccion create(Transaccion transaccion) {
        transaccion.setId(null);
        transaccion.setFecha(null);
        return repository.save(transaccion);
    }
}
