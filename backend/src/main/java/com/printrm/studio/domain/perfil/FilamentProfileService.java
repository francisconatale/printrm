package com.printrm.studio.domain.perfil;

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
public class FilamentProfileService {

    private final FilamentProfileRepository repository;
    private final FilamentProfileMapper mapper;

    public List<FilamentProfileResponseDTO> findAll() {
        return repository.findAllByDeletedFalse().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public Page<FilamentProfileResponseDTO> findAll(Pageable pageable) {
        return repository.findAllByDeletedFalse(pageable)
                .map(mapper::toResponseDto);
    }

    public FilamentProfileResponseDTO findById(UUID id) {
        FilamentProfile filament = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de filamento no encontrado"));
        return mapper.toResponseDto(filament);
    }

    @Transactional
    public FilamentProfileResponseDTO create(FilamentProfileRequestDTO dto) {
        FilamentProfile filament = mapper.toEntity(dto);
        filament = repository.save(filament);
        return mapper.toResponseDto(filament);
    }

    @Transactional
    public FilamentProfileResponseDTO update(UUID id, FilamentProfileRequestDTO dto) {
        FilamentProfile filament = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de filamento no encontrado"));
        
        mapper.updateEntity(filament, dto);
        filament = repository.save(filament);
        return mapper.toResponseDto(filament);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Perfil de filamento no encontrado");
        }
        repository.deleteById(id);
    }
}
