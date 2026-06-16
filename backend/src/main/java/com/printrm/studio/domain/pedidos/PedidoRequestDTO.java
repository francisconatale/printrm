package com.printrm.studio.domain.pedidos;

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
    private List<ItemPedidoRequestDTO> items;
}
