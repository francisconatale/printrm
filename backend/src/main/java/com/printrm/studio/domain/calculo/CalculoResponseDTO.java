package com.printrm.studio.domain.calculo;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    private UUID perfilId;
    private String perfilNombre;

    // Inputs
    private Integer horas;
    private Integer minutosAdicionales;
    private Double gramos;
    private Double insumosExtra;

    // Results
    private Double costoEnergia;
    private Double costoFilamento;
    private Double costoError;
    private Double subtotal;
    private Double costoBase;
    private Double precioVenta;
}
