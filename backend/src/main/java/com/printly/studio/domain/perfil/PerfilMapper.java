package com.printly.studio.domain.perfil;

import org.springframework.stereotype.Component;

@Component
public class PerfilMapper {

    public PerfilResponseDTO toResponseDto(Perfil entity) {
        return PerfilResponseDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .creadoEn(entity.getCreadoEn())
                .actualizadoEn(entity.getActualizadoEn())
                .modeloImpresora(entity.getModeloImpresora())
                .consumoW(entity.getConsumoW())
                .vidaUtilHoras(entity.getVidaUtilHoras())
                .costoRepuestos(entity.getCostoRepuestos())
                .filamentoPorKg(entity.getFilamentoPorKg())
                .nozzleDiameter(entity.getNozzleDiameter())
                .bedShape(entity.getBedShape())
                .maxPrintHeight(entity.getMaxPrintHeight())
                .build();
    }

    public Perfil toEntity(PerfilRequestDTO dto) {
        return Perfil.builder()
                .nombre(dto.getNombre())
                .modeloImpresora(dto.getModeloImpresora())
                .consumoW(dto.getConsumoW())
                .vidaUtilHoras(dto.getVidaUtilHoras())
                .costoRepuestos(dto.getCostoRepuestos())
                .filamentoPorKg(dto.getFilamentoPorKg())
                .nozzleDiameter(dto.getNozzleDiameter())
                .bedShape(dto.getBedShape())
                .maxPrintHeight(dto.getMaxPrintHeight())
                .build();
    }

    public void updateEntity(Perfil entity, PerfilRequestDTO dto) {
        if (dto.getNombre() != null) entity.setNombre(dto.getNombre());
        if (dto.getModeloImpresora() != null) entity.setModeloImpresora(dto.getModeloImpresora());
        if (dto.getConsumoW() != null) entity.setConsumoW(dto.getConsumoW());
        if (dto.getVidaUtilHoras() != null) entity.setVidaUtilHoras(dto.getVidaUtilHoras());
        if (dto.getCostoRepuestos() != null) entity.setCostoRepuestos(dto.getCostoRepuestos());
        if (dto.getFilamentoPorKg() != null) entity.setFilamentoPorKg(dto.getFilamentoPorKg());
        if (dto.getNozzleDiameter() != null) entity.setNozzleDiameter(dto.getNozzleDiameter());
        if (dto.getBedShape() != null) entity.setBedShape(dto.getBedShape());
        if (dto.getMaxPrintHeight() != null) entity.setMaxPrintHeight(dto.getMaxPrintHeight());

    }
}
