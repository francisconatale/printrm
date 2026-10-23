package com.printly.studio.domain.calculo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CostCalculationResult {
    private Integer horas;
    private Integer minutosAdicionales;
    private Double gramos;
    private Double tiempoTotalHoras;
    private Double costoEnergia;
    private Double costoFilamento;
    private Double costoError;
    private Double subtotal;
    private Double costoBase;
    private Double insumosExtra;
}
