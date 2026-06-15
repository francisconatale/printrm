package com.printrm.studio.domain.calculo;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalculoResponseDTO {
    private UUID id;
    private LocalDateTime timestamp;
    private UUID perfilId;
    private String perfilNombre;

    // Inputs
    private Integer horas;
    private Integer minutosAdicionales;
    private Double gramos;
    private Double insumosExtra;
    private Double multiplicador;

    // Results
    private Double costoEnergia;
    private Double costoFilamento;
    private Double costoDesgaste;
    private Double subtotal;
    private Double costoBase;
    private Double precioVenta;
}

