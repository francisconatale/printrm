package com.printly.studio.domain.produccion;

import lombok.Data;

@Data
public class OrdenProduccionRequestDTO {
    private String itemPedidoId;
    private String productoId;
    private Integer cantidad;
}
