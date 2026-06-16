package com.printrm.studio.domain.finanzas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, UUID> {
    List<Transaccion> findByTipo(Transaccion.TipoTransaccion tipo);
    List<Transaccion> findAllByPedidoIdAndTipo(UUID pedidoId, Transaccion.TipoTransaccion tipo);
    boolean existsByPedidoIdAndTipo(UUID pedidoId, Transaccion.TipoTransaccion tipo);
}
