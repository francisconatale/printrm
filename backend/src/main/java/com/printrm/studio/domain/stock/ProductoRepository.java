package com.printrm.studio.domain.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, UUID> {
}
