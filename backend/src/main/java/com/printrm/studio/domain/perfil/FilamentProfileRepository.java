package com.printrm.studio.domain.perfil;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FilamentProfileRepository extends JpaRepository<FilamentProfile, UUID> {
    List<FilamentProfile> findAllByDeletedFalse();
    Page<FilamentProfile> findAllByDeletedFalse(Pageable pageable);
}
