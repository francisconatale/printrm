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
public class FilamentProfileRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String nombre;

    private String material;

    @NotNull(message = "El costo por kg es obligatorio")
    @Min(value = 0, message = "El costo por kg no puede ser negativo")
    private Double filamentoPorKg;

    @NotNull(message = "La densidad es obligatoria")
    @Min(value = 0, message = "La densidad no puede ser negativa")
    private Double density;

    @NotNull(message = "El diámetro es obligatorio")
    @Min(value = 0, message = "El diámetro no puede ser negativo")
    private Double diameter;

    @NotBlank(message = "El color es obligatorio")
    private String colour;
}
