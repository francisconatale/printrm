package com.printrm.studio.domain.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LoteRepository extends JpaRepository<Lote, UUID> {
    List<Lote> findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(UUID productoId, Integer cantidad);
}
