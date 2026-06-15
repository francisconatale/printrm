package com.printrm.studio.domain.ajustes;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AjustesService {

    private final AjustesRepository ajustesRepository;
    private static final Long AJUSTES_ID = 1L;

    public AjustesService(AjustesRepository ajustesRepository) {
        this.ajustesRepository = ajustesRepository;
    }

    @PostConstruct
    @Transactional
    public void initDefaultAjustes() {
        if (!ajustesRepository.existsById(AJUSTES_ID)) {
            Ajustes defaultAjustes = Ajustes.builder()
                    .id(AJUSTES_ID)
                    .filamentoPorKg(15000.0)
                    .preciokWh(50.0)
                    .vidaUtilHoras(5000.0)
                    .costoRepuestos(25000.0)
                    .margenError(10.0)
                    .build();
            ajustesRepository.save(defaultAjustes);
        }
    }

    public AjustesDTO getAjustes() {
        return ajustesRepository.findById(AJUSTES_ID)
                .map(this::mapToDTO)
                .orElseGet(() -> {
                    // Fallback to first available or default if not found
                    return ajustesRepository.findAll().stream()
                            .findFirst()
                            .map(this::mapToDTO)
                            .orElseGet(() -> {
                                // Last resort: Hardcoded defaults to avoid 500
                                return AjustesDTO.builder()
                                        .filamentoPorKg(15000.0)
                                        .preciokWh(50.0)
                                        .vidaUtilHoras(5000.0)
                                        .costoRepuestos(25000.0)
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

        ajustes.setFilamentoPorKg(dto.getFilamentoPorKg());
        ajustes.setPreciokWh(dto.getPreciokWh());
        ajustes.setVidaUtilHoras(dto.getVidaUtilHoras());
        ajustes.setCostoRepuestos(dto.getCostoRepuestos());
        ajustes.setMargenError(dto.getMargenError());

        Ajustes saved = ajustesRepository.save(ajustes);
        return mapToDTO(saved);
    }

    private AjustesDTO mapToDTO(Ajustes ajustes) {
        return AjustesDTO.builder()
                .filamentoPorKg(ajustes.getFilamentoPorKg())
                .preciokWh(ajustes.getPreciokWh())
                .vidaUtilHoras(ajustes.getVidaUtilHoras())
                .costoRepuestos(ajustes.getCostoRepuestos())
                .margenError(ajustes.getMargenError())
                .build();
    }
}
