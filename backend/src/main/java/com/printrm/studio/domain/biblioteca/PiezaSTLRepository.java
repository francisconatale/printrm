package com.printrm.studio.domain.biblioteca;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PiezaSTLRepository extends JpaRepository<PiezaSTL, String> {
    List<PiezaSTL> findAllByDeletedFalseOrderByCreadoEnDesc();
    List<PiezaSTL> findAllByOrderByCreadoEnDesc();
}
