package com.printly.studio.domain.ajustes;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AjustesService {

    private final AjustesRepository ajustesRepository;
    private final AjustesMapper mapper;
    private static final Long AJUSTES_ID = 1L;

    public AjustesService(AjustesRepository ajustesRepository, AjustesMapper mapper) {
        this.ajustesRepository = ajustesRepository;
        this.mapper = mapper;
    }

    @PostConstruct
    @Transactional
    public void initDefaultAjustes() {
        if (!ajustesRepository.existsById(AJUSTES_ID)) {
            Ajustes defaultAjustes = Ajustes.builder()
                    .id(AJUSTES_ID)
                    .preciokWh(50.0)
                    .margenError(10.0)
                    .build();
            ajustesRepository.save(defaultAjustes);
        }
    }

    public AjustesDTO getAjustes() {
        return ajustesRepository.findById(AJUSTES_ID)
                .map(mapper::toDto)
                .orElseGet(() -> {
                    return ajustesRepository.findAll().stream()
                            .findFirst()
                            .map(mapper::toDto)
                            .orElseGet(() -> {
                                return AjustesDTO.builder()
                                        .preciokWh(50.0)
                                        .margenError(10.0)
                                        .build();
                            });
                });
    }

    @Transactional
    public AjustesDTO updateAjustes(AjustesDTO dto) {
        Ajustes ajustes = ajustesRepository.findById(AJUSTES_ID)
                .orElseGet(() -> ajustesRepository.findAll().stream().findFirst()
                .orElseGet(() -> Ajustes.builder().id(AJUSTES_ID).build()));

        ajustes.setPreciokWh(dto.getPreciokWh());
        ajustes.setMargenError(dto.getMargenError());

        Ajustes saved = ajustesRepository.save(ajustes);
        return mapper.toDto(saved);
    }
}
