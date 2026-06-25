package com.printly.studio.domain.perfil;

import org.springframework.stereotype.Component;

@Component
public class FilamentProfileMapper {

    public FilamentProfileResponseDTO toResponseDto(FilamentProfile entity) {
        return FilamentProfileResponseDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .material(entity.getMaterial())
                .filamentoPorKg(entity.getFilamentoPorKg())
                .density(entity.getDensity())
                .diameter(entity.getDiameter())
                .colour(entity.getColour())
                .creadoEn(entity.getCreadoEn())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }

    public FilamentProfile toEntity(FilamentProfileRequestDTO dto) {
        return FilamentProfile.builder()
                .nombre(dto.getNombre())
                .material(dto.getMaterial())
                .filamentoPorKg(dto.getFilamentoPorKg())
                .density(dto.getDensity())
                .diameter(dto.getDiameter())
                .colour(dto.getColour())
                .build();
    }

    public void updateEntity(FilamentProfile entity, FilamentProfileRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setMaterial(dto.getMaterial());
        entity.setFilamentoPorKg(dto.getFilamentoPorKg());
        entity.setDensity(dto.getDensity());
        entity.setDiameter(dto.getDiameter());
        entity.setColour(dto.getColour());
    }
}
