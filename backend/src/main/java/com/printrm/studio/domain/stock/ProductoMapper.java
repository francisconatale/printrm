package com.printrm.studio.domain.stock;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLResponseDTO;
import com.printrm.studio.domain.calculo.CostCalculationResult;
import com.printrm.studio.domain.calculo.CostCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductoMapper {

    private final CostCalculationService costCalculationService;
    private final AjustesService ajustesService;

    public ProductoResponseDTO toResponseDto(Producto p) {
        return ProductoResponseDTO.builder()
                .id(p.getId().toString())
                .nombre(p.getNombre())
                .cantidadStock(p.getCantidadStock())
                .precioSugerido(p.getPrecioSugerido())
                .creadoEn(p.getCreadoEn())
                .actualizadoEn(p.getActualizadoEn())
                .partes(p.getPartes().stream().map(this::piezaToDto).collect(Collectors.toList()))
                .lotes(p.getLotes().stream()
                        .filter(l -> l.getCantidadActual() > 0)
                        .sorted(Comparator.comparing(Lote::getFechaCreacion))
                        .map(l -> ProductoResponseDTO.LoteDTO.builder()
                                .id(l.getId().toString())
                                .cantidadActual(l.getCantidadActual())
                                .costoUnitario(l.getCostoUnitario())
                                .fechaCreacion(l.getFechaCreacion())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    public PiezaSTLResponseDTO piezaToDto(PiezaSTL pieza) {
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

        AjustesDTO ajustes = ajustesService.getAjustes();
        CostCalculationResult calc = costCalculationService.calculate(
            pieza.getPesoGramos(),
            costCalculationService.parseHours(pieza.getTiempoEstimado()),
            costCalculationService.parseMinutes(pieza.getTiempoEstimado()),
            0.0,
            pieza.getPerfilPreferido(),
            pieza.getFilamentoPreferido(),
            ajustes
        );
        dto.setCostoBase(calc != null ? calc.getCostoBase() : 0.0);
        dto.setCostoMaterial(calc != null ? calc.getCostoFilamento() : 0.0);
        dto.setCostoEnergia(calc != null ? calc.getCostoEnergia() : 0.0);

        return dto;
    }
}
