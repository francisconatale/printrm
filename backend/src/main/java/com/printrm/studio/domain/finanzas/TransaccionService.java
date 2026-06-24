package com.printrm.studio.domain.finanzas;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final TransaccionRepository repository;

    public List<Transaccion> getAll() {
        return repository.findAll();
    }

    public Page<Transaccion> getAll(Pageable pageable, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        if (fechaDesde != null && fechaHasta != null) {
            return repository.findByFechaBetween(fechaDesde, fechaHasta, pageable);
        }
        return repository.findAll(pageable);
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

    public void registrarTransaccion(Transaccion.TipoTransaccion tipo, Transaccion.CategoriaTransaccion categoria, Double monto, String descripcion, java.util.UUID pedidoId) {
        registrarTransaccion(tipo, categoria, monto, descripcion, pedidoId, null, null);
    }

    public void registrarTransaccion(Transaccion.TipoTransaccion tipo, Transaccion.CategoriaTransaccion categoria, Double monto, String descripcion, java.util.UUID pedidoId, java.util.UUID grupoId, java.util.UUID productoId) {
        if (monto != null && monto != 0) {
            Transaccion tx = Transaccion.builder()
                    .tipo(tipo)
                    .categoria(categoria)
                    .monto(monto)
                    .descripcion(descripcion)
                    .pedidoId(pedidoId)
                    .grupoId(grupoId)
                    .productoId(productoId)
                    .build();
            repository.save(tx);
        }
    }

    public Page<Transaccion> getByCliente(java.util.UUID clienteId, Pageable pageable, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        if (fechaDesde != null && fechaHasta != null) {
            return repository.findByClienteIdAndFechaBetween(clienteId, fechaDesde, fechaHasta, pageable);
        }
        return repository.findByClienteId(clienteId, pageable);
    }
}
