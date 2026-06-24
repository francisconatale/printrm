package com.printrm.studio.domain.pedidos;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaCreacion;
    private List<ItemPedidoResponseDTO> items;
}
