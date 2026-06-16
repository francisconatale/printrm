package com.printrm.studio.domain.pedidos;

import lombok.Data;

@Data
public class ItemPedidoResponseDTO {
    private String id;
    private String calculoId;
    private String productoId;
    private String productoNombre;
    private String perfilNombre;
    private Integer cantidad;
    private Integer cantidadMerma;
    private Double subtotal;
}
