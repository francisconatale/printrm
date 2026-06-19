package com.printrm.studio.domain.produccion;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrdenProduccionRepository extends JpaRepository<OrdenProduccion, UUID> {
    List<OrdenProduccion> findByItemPedidoId(UUID itemPedidoId);
    List<OrdenProduccion> findByEstado(OrdenProduccion.EstadoProduccion estado);
    List<OrdenProduccion> findByProductoId(UUID productoId);
}
