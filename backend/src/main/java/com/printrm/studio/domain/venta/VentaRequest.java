package com.printrm.studio.domain.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class VentaRequest {
    @NotEmpty(message = "Debe haber al menos un producto")
    @Valid
    private List<ItemVenta> items;

    private String compradorNombre;
    private String compradorEmail;

    @Data
    public static class ItemVenta {
        @NotNull(message = "El producto es obligatorio")
        private UUID productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad debe ser al menos 1")
        private Integer cantidad;
    }
}
