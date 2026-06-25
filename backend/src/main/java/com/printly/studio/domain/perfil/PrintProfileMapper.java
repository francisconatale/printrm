package com.printly.studio.domain.perfil;

import org.springframework.stereotype.Component;

@Component
public class PrintProfileMapper {

    public PrintProfileResponseDTO toResponseDto(PrintProfile entity) {
        return PrintProfileResponseDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .layerHeight(entity.getLayerHeight())
                .perimeters(entity.getPerimeters())
                .fillDensity(entity.getFillDensity())
                .speedPrint(entity.getSpeedPrint())
                .creadoEn(entity.getCreadoEn())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }

    public PrintProfile toEntity(PrintProfileRequestDTO dto) {
        return PrintProfile.builder()
                .nombre(dto.getNombre())
                .layerHeight(dto.getLayerHeight())
                .perimeters(dto.getPerimeters())
                .fillDensity(dto.getFillDensity())
                .speedPrint(dto.getSpeedPrint())
                .build();
    }

    public void updateEntity(PrintProfile entity, PrintProfileRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setLayerHeight(dto.getLayerHeight());
        entity.setPerimeters(dto.getPerimeters());
        entity.setFillDensity(dto.getFillDensity());
        entity.setSpeedPrint(dto.getSpeedPrint());
    }
}
