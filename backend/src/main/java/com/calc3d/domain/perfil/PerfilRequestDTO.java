package com.calc3d.domain.perfil;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String nombre;

    @Min(value = 0, message = "El filamento por kg no puede ser negativo")
    private Double filamentoPorKg;

    @Min(value = 0, message = "El precio kWh no puede ser negativo")
    private Double preciokWh;

    private String modeloImpresora;

    @Min(value = 0, message = "El consumo W no puede ser negativo")
    private Double consumoW;

    @Min(value = 0, message = "La vida útil no puede ser negativa")
    private Double vidaUtilHoras;

    @Min(value = 0, message = "El costo de repuestos no puede ser negativo")
    private Double costoRepuestos;

    @Min(value = 0, message = "El margen de error no puede ser negativo")
    private Double margenError;

    // Slicer Configuration
    private String printConfig;
    private String filamentConfig;
    private String printerConfig;
}
