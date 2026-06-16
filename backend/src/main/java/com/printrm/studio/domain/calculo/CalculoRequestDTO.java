package com.printrm.studio.domain.calculo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CalculoRequestDTO {
    @NotNull(message = "El ID del perfil es obligatorio")
    private UUID perfilId;

    @NotBlank(message = "El nombre del perfil es obligatorio")
    private String perfilNombre;

    @NotNull(message = "Las horas son obligatorias")
    @Min(value = 0, message = "Las horas no pueden ser negativas")
    private Integer horas;

    @Min(value = 0, message = "Los minutos no pueden ser negativos")
    private Integer minutosAdicionales;

    @NotNull(message = "Los gramos son obligatorios")
    @Min(value = 0, message = "Los gramos no pueden ser negativos")
    private Double gramos;

    @Min(value = 0, message = "Los insumos extra no pueden ser negativos")
    private Double insumosExtra;

    @NotNull(message = "El multiplicador es obligatorio")
    @Min(value = 1, message = "El multiplicador debe ser al menos 1")
    private Double multiplicador;

    // Precalculated results from frontend
    @NotNull
    private Double costoEnergia;
    @NotNull
    private Double costoFilamento;
    @NotNull
    private Double costoDesgaste;
    @NotNull
    private Double subtotal;
    @NotNull
    private Double costoBase;
    @NotNull
    private Double precioVenta;
}

