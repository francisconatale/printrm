package com.printrm.studio.domain.pedidos;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {
    Page<Pedido> findByClienteId(UUID clienteId, Pageable pageable);

    Page<Pedido> findByFechaCreacionBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

    Page<Pedido> findByClienteIdAndFechaCreacionBetween(UUID clienteId, LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
}
