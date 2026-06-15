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
public class PerfilResponseDTO {
    private UUID id;
    private String nombre;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
    private String modeloImpresora;
    private Double consumoW;
    private Double vidaUtilHoras;
    private Double costoRepuestos;

    // Slicer fields
    private Double nozzleDiameter;
    private String bedShape;
    private Double maxPrintHeight;

    // Slicer Configuration
    private String printConfig;
    private String filamentConfig;
    private String printerConfig;
}
