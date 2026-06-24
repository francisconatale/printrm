package com.printrm.studio.domain.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class DevolucionRequest {
    @NotEmpty(message = "Debe haber al menos un producto a devolver")
    @Valid
    private List<ItemDevolucion> items;

    private String motivo;

    @Data
    public static class ItemDevolucion {
        @NotNull(message = "El producto es obligatorio")
        private UUID productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser al menos 1")
        private Integer cantidad;
    }
}
