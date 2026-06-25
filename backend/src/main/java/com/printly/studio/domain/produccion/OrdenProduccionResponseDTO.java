package com.printly.studio.domain.produccion;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaInicio;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaFin;
}
