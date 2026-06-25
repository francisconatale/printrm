package com.printly.studio.domain.produccion;

import org.springframework.stereotype.Component;

@Component
public class OrdenProduccionMapper {

    public OrdenProduccionResponseDTO toDto(OrdenProduccion o) {
        return OrdenProduccionResponseDTO.builder()
                .id(o.getId().toString())
                .itemPedidoId(o.getItemPedido() != null ? o.getItemPedido().getId().toString() : null)
                .pedidoId(o.getItemPedido() != null ? o.getItemPedido().getPedido().getId().toString() : null)
                .clienteNombre(o.getItemPedido() != null && o.getItemPedido().getPedido().getCliente() != null
                        ? o.getItemPedido().getPedido().getCliente().getNombre()
                        : (o.getItemPedido() != null ? "Consumidor Final" : "Stock Propio"))
                .productoId(o.getProducto() != null ? o.getProducto().getId().toString() : null)
                .productoNombre(o.getProducto() != null ? o.getProducto().getNombre() : "Pieza Cotizada")
                .cantidad(o.getCantidad())
                .estado(o.getEstado().name())
                .fechaInicio(o.getFechaInicio())
                .fechaFin(o.getFechaFin())
                .build();
    }
}
