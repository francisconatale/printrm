package com.printrm.studio.domain.onboarding;

import org.springframework.stereotype.Component;

@Component
public class OnboardingMapper {

    public OnboardingDTO toDto(Onboarding entity) {
        return OnboardingDTO.builder()
                .nombreUsuario(entity.getNombreUsuario())
                .nombreEmprendimiento(entity.getNombreEmprendimiento())
                .completado(entity.getCompletado())
                .build();
    }
}
