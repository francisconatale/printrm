package com.printrm.studio.domain.produccion;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdenProduccionResponseDTO {
    private String id;
    private String itemPedidoId;
    private String pedidoId;
    private String clienteNombre;
    private String productoId;
    private String productoNombre;
    private Integer cantidad;
    private String estado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
