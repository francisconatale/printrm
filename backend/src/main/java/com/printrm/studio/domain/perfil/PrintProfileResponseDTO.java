package com.printrm.studio.domain.perfil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrintProfileResponseDTO {
    private UUID id;
    private String nombre;
    private Double layerHeight;
    private Integer perimeters;
    private String fillDensity;
    private Double speedPrint;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
