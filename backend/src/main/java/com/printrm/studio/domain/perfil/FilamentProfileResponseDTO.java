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
public class FilamentProfileResponseDTO {
    private UUID id;
    private String nombre;
    private String material;
    private Double filamentoPorKg;
    private Double density;
    private Double diameter;
    private String colour;
    private String filamentConfig;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
