package com.printrm.studio.domain.ajustes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AjustesRepository extends JpaRepository<Ajustes, Long> {
}
