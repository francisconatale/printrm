package com.printrm.studio.domain.onboarding;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OnboardingService {

    private final OnboardingRepository repository;
    private final OnboardingMapper mapper;
    private static final Long ONBOARDING_ID = 1L;

    public OnboardingService(OnboardingRepository repository, OnboardingMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
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
                .map(mapper::toDto)
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
        return mapper.toDto(saved);
    }
}
