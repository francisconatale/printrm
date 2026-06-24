package com.printrm.studio.domain.finanzas;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, UUID> {
    List<Transaccion> findByTipo(Transaccion.TipoTransaccion tipo);
    List<Transaccion> findAllByPedidoIdAndTipo(UUID pedidoId, Transaccion.TipoTransaccion tipo);
    boolean existsByPedidoIdAndTipo(UUID pedidoId, Transaccion.TipoTransaccion tipo);
    Page<Transaccion> findByTipoAndCategoriaOrderByFechaDesc(Transaccion.TipoTransaccion tipo, Transaccion.CategoriaTransaccion categoria, Pageable pageable);
    List<Transaccion> findByTipoAndCategoriaOrderByFechaDesc(Transaccion.TipoTransaccion tipo, Transaccion.CategoriaTransaccion categoria);
    List<Transaccion> findByGrupoIdAndTipo(UUID grupoId, Transaccion.TipoTransaccion tipo);
    boolean existsByGrupoIdAndTipo(UUID grupoId, Transaccion.TipoTransaccion tipo);

    @Query("SELECT t FROM Transaccion t WHERE t.pedidoId IN (SELECT p.id FROM Pedido p WHERE p.cliente.id = :clienteId) ORDER BY t.fecha DESC")
    Page<Transaccion> findByClienteId(@Param("clienteId") UUID clienteId, Pageable pageable);

    Page<Transaccion> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

    @Query("SELECT t FROM Transaccion t WHERE t.pedidoId IN (SELECT p.id FROM Pedido p WHERE p.cliente.id = :clienteId) AND t.fecha BETWEEN :desde AND :hasta ORDER BY t.fecha DESC")
    Page<Transaccion> findByClienteIdAndFechaBetween(@Param("clienteId") UUID clienteId, @Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta, Pageable pageable);

    List<Transaccion> findByTipoAndCategoriaAndFechaBetweenOrderByFechaDesc(Transaccion.TipoTransaccion tipo, Transaccion.CategoriaTransaccion categoria, LocalDateTime desde, LocalDateTime hasta);
}

