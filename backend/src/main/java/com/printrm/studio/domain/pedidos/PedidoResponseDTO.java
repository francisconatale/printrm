package com.printrm.studio.domain.pedidos;

import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;

@Data
public class PedidoResponseDTO {
    private String id;
    private String clienteNombre;
    private String estado;
    private Double total;
    private Double montoPagado;
    private Double saldoPendiente;
    private LocalDateTime fechaCreacion;
    private List<ItemPedidoResponseDTO> items;
}
