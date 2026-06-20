package com.printrm.studio.domain.pedidos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoRequestDTO {
    private UUID clienteId;

    @NotEmpty(message = "El pedido debe tener al menos un ítem")
    @Valid
    private List<ItemPedidoRequestDTO> items;
}
