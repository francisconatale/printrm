package com.printly.studio.domain.biblioteca;

import com.printly.studio.domain.ajustes.AjustesDTO;
import com.printly.studio.domain.calculo.CostCalculationResult;
import com.printly.studio.domain.calculo.CostCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PiezaSTLMapper {

    private final CostCalculationService costCalculationService;

    public PiezaSTLResponseDTO toDto(PiezaSTL pieza, AjustesDTO ajustes) {
        PiezaSTLResponseDTO dto = new PiezaSTLResponseDTO();
        dto.setId(pieza.getId());
        dto.setNombre(pieza.getNombre());
        dto.setFilePath(pieza.getFilePath());
        dto.setVolumenCm3(pieza.getVolumenCm3());
        dto.setPesoGramos(pieza.getPesoGramos());
        dto.setTiempoEstimado(pieza.getTiempoEstimado());
        dto.setImagenBase64(pieza.getImagenBase64());
        dto.setCreadoEn(pieza.getCreadoEn());

        if (pieza.getPerfilPreferido() != null) dto.setPerfilImpresoraNombre(pieza.getPerfilPreferido().getNombre());
        if (pieza.getFilamentoPreferido() != null) dto.setPerfilFilamentoNombre(pieza.getFilamentoPreferido().getNombre());
        if (pieza.getImpresionPreferida() != null) dto.setPerfilImpresionNombre(pieza.getImpresionPreferida().getNombre());

        int horas = 0;
        int minutos = 0;
        if (pieza.getTiempoEstimado() != null && pieza.getTiempoEstimado().contains("h")) {
            try {
                String[] parts = pieza.getTiempoEstimado().split("h");
                horas = Integer.parseInt(parts[0].trim());
                if (parts.length > 1) {
                    minutos = Integer.parseInt(parts[1].replace("m", "").trim());
                }
            } catch (Exception ignored) {}
        }

        CostCalculationResult calc = costCalculationService.calculate(
            pieza.getPesoGramos(), horas, minutos, 0.0,
            pieza.getPerfilPreferido(), pieza.getFilamentoPreferido(), ajustes
        );

        dto.setCostoBase(pieza.getCostoBase() != null ? pieza.getCostoBase() : (calc != null ? calc.getCostoBase() : 0.0));
        dto.setCostoMaterial(calc != null ? calc.getCostoFilamento() : 0.0);
        dto.setCostoEnergia(calc != null ? calc.getCostoEnergia() : 0.0);
        dto.setCostoError(pieza.getCostoError() != null ? pieza.getCostoError() : (calc != null && calc.getCostoError() != null ? calc.getCostoError() : 0.0));

        return dto;
    }
}
