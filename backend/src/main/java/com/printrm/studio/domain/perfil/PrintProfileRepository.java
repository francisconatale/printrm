package com.printrm.studio.domain.perfil;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PrintProfileRepository extends JpaRepository<PrintProfile, UUID> {
}
