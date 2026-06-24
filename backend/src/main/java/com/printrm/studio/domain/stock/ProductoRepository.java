package com.printrm.studio.domain.stock;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, UUID> {
    List<Producto> findAllByDeletedFalse();
    Page<Producto> findAllByDeletedFalse(Pageable pageable);
}
