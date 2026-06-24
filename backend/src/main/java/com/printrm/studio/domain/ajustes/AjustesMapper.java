package com.printrm.studio.domain.ajustes;

import org.springframework.stereotype.Component;

@Component
public class AjustesMapper {

    public AjustesDTO toDto(Ajustes entity) {
        return AjustesDTO.builder()
                .preciokWh(entity.getPreciokWh())
                .margenError(entity.getMargenError())
                .build();
    }
}
