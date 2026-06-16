package com.printrm.studio.domain.pedidos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedidoRequestDTO {
    private UUID calculoId;
    private UUID productoId;
    private Integer cantidad;
}
