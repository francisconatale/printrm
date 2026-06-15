package com.printrm.studio.domain.ajustes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AjustesDTO {
    private Double filamentoPorKg;
    private Double preciokWh;
    private Double margenError;
}
