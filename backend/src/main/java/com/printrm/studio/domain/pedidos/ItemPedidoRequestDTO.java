package com.printrm.studio.domain.pedidos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedidoRequestDTO {
    private UUID productoId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    private Double precioPersonalizado;

    public ItemPedidoRequestDTO(UUID productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioPersonalizado = null;
    }
}
