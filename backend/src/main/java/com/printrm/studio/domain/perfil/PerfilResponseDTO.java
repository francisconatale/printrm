package com.printrm.studio.domain.perfil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilResponseDTO {
    private UUID id;
    private String nombre;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime creadoEn;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime actualizadoEn;
    private String modeloImpresora;
    private Double consumoW;
    private Double vidaUtilHoras;
    private Double costoRepuestos;
    private Double filamentoPorKg;

    // Slicer fields
    private Double nozzleDiameter;
    private String bedShape;
    private Double maxPrintHeight;

}
