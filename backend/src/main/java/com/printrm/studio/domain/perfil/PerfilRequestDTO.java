package com.printrm.studio.domain.perfil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String nombre;

    private String modeloImpresora;

    private Double consumoW;
    private Double vidaUtilHoras;
    private Double costoRepuestos;
    private Double filamentoPorKg;

    // Slicer fields
    private Double nozzleDiameter;
    private String bedShape;
    private Double maxPrintHeight;

    // Slicer Configuration
    private String printConfig;
    private String filamentConfig;
    private String printerConfig;
}
