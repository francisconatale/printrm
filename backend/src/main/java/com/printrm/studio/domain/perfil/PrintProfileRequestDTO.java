package com.printrm.studio.domain.perfil;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrintProfileRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String nombre;

    @NotNull(message = "La altura de capa es obligatoria")
    @Min(value = 0, message = "La altura de capa no puede ser negativa")
    private Double layerHeight;

    @NotNull(message = "El número de perímetros es obligatorio")
    @Min(value = 1, message = "Debe haber al menos 1 perímetro")
    private Integer perimeters;

    @NotBlank(message = "La densidad de relleno es obligatoria")
    private String fillDensity;

    @NotNull(message = "La velocidad de impresión es obligatoria")
    @Min(value = 1, message = "La velocidad debe ser mayor a 0")
    private Double speedPrint;
}
