package com.printrm.studio.domain.pedidos;

import lombok.Data;

@Data
public class ItemPedidoResponseDTO {
    private String id;
    private Integer cantidad;
    private Double subtotal;
}
