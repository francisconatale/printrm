package com.printrm.studio.domain.ajustes;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AjustesDTO {
    @NotNull(message = "El precio kWh es obligatorio")
    @Min(value = 0, message = "El precio kWh no puede ser negativo")
    private Double preciokWh;

    @NotNull(message = "El margen de error es obligatorio")
    @Min(value = 0, message = "El margen de error no puede ser negativo")
    private Double margenError;
}
