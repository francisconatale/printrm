package com.printly.studio.domain.perfil;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final PerfilRepository repository;
    private final PerfilMapper mapper;

    public List<PerfilResponseDTO> findAll() {
        return repository.findAllByDeletedFalse().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public Page<PerfilResponseDTO> findAll(Pageable pageable) {
        return repository.findAllByDeletedFalse(pageable)
                .map(mapper::toResponseDto);
    }

    public PerfilResponseDTO findById(UUID id) {
        Perfil perfil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        return mapper.toResponseDto(perfil);
    }

    @Transactional
    public PerfilResponseDTO create(PerfilRequestDTO dto) {
        Perfil perfil = mapper.toEntity(dto);
        perfil = repository.save(perfil);
        return mapper.toResponseDto(perfil);
    }

    @Transactional
    public PerfilResponseDTO update(UUID id, PerfilRequestDTO dto) {
        Perfil perfil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        
        mapper.updateEntity(perfil, dto);
        perfil = repository.save(perfil);
        return mapper.toResponseDto(perfil);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Perfil no encontrado");
        }
        repository.deleteById(id);
    }


}
