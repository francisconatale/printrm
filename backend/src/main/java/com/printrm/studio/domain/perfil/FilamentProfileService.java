package com.printrm.studio.domain.perfil;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilamentProfileService {

    private final FilamentProfileRepository repository;

    public List<FilamentProfileResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public FilamentProfileResponseDTO findById(UUID id) {
        FilamentProfile filament = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de filamento no encontrado"));
        return mapToResponseDTO(filament);
    }

    @Transactional
    public FilamentProfileResponseDTO create(FilamentProfileRequestDTO dto) {
        FilamentProfile filament = mapToEntity(dto);
        filament = repository.save(filament);
        return mapToResponseDTO(filament);
    }

    @Transactional
    public FilamentProfileResponseDTO update(UUID id, FilamentProfileRequestDTO dto) {
        FilamentProfile filament = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de filamento no encontrado"));
        
        updateEntity(filament, dto);
        filament = repository.save(filament);
        return mapToResponseDTO(filament);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Perfil de filamento no encontrado");
        }
        repository.deleteById(id);
    }

    private FilamentProfileResponseDTO mapToResponseDTO(FilamentProfile entity) {
        return FilamentProfileResponseDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .material(entity.getMaterial())
                .filamentoPorKg(entity.getFilamentoPorKg())
                .density(entity.getDensity())
                .diameter(entity.getDiameter())
                .colour(entity.getColour())
                .filamentConfig(entity.getFilamentConfig())
                .creadoEn(entity.getCreadoEn())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }

    private FilamentProfile mapToEntity(FilamentProfileRequestDTO dto) {
        return FilamentProfile.builder()
                .nombre(dto.getNombre())
                .material(dto.getMaterial())
                .filamentoPorKg(dto.getFilamentoPorKg())
                .density(dto.getDensity())
                .diameter(dto.getDiameter())
                .colour(dto.getColour())
                .build();
    }

    private void updateEntity(FilamentProfile entity, FilamentProfileRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setMaterial(dto.getMaterial());
        entity.setFilamentoPorKg(dto.getFilamentoPorKg());
        entity.setDensity(dto.getDensity());
        entity.setDiameter(dto.getDiameter());
        entity.setColour(dto.getColour());
    }
}
