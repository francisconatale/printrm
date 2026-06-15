package com.calc3d.domain.perfil;

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
public class PerfilResponseDTO {
    private UUID id;
    private String nombre;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
    private Double filamentoPorKg;
    private Double preciokWh;
    private String modeloImpresora;
    private Double consumoW;
    private Double vidaUtilHoras;
    private Double costoRepuestos;
    private Double margenError;

    // Slicer Configuration
    private String printConfig;
    private String filamentConfig;
    private String printerConfig;
}
