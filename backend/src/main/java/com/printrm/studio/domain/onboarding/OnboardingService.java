package com.printrm.studio.domain.onboarding;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OnboardingService {

    private final OnboardingRepository repository;
    private static final Long ONBOARDING_ID = 1L;

    public OnboardingService(OnboardingRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    @Transactional
    public void initDefault() {
        if (!repository.existsById(ONBOARDING_ID)) {
            Onboarding defaultRow = Onboarding.builder()
                    .id(ONBOARDING_ID)
                    .completado(false)
                    .build();
            repository.save(defaultRow);
        }
    }

    public OnboardingDTO getStatus() {
        return repository.findById(ONBOARDING_ID)
                .map(this::mapToDTO)
                .orElseGet(() -> OnboardingDTO.builder()
                        .completado(false)
                        .build());
    }

    @Transactional
    public OnboardingDTO complete(OnboardingDTO dto) {
        Onboarding onboarding = repository.findById(ONBOARDING_ID)
                .orElseGet(() -> Onboarding.builder().id(ONBOARDING_ID).build());

        onboarding.setNombreUsuario(dto.getNombreUsuario());
        onboarding.setNombreEmprendimiento(dto.getNombreEmprendimiento());
        onboarding.setCompletado(true);
        onboarding.setCompletadoEn(LocalDateTime.now());

        Onboarding saved = repository.save(onboarding);
        return mapToDTO(saved);
    }

    private OnboardingDTO mapToDTO(Onboarding entity) {
        return OnboardingDTO.builder()
                .nombreUsuario(entity.getNombreUsuario())
                .nombreEmprendimiento(entity.getNombreEmprendimiento())
                .completado(entity.getCompletado())
                .build();
    }
}
