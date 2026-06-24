package com.printrm.studio.domain.venta;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VentaResponse {
    private String grupoId;
    private Double total;
    private String compradorNombre;
    private String compradorEmail;
    private LocalDateTime fecha;
    private List<ItemVentaResponse> items;

    @Data
    public static class ItemVentaResponse {
        private String productoId;
        private String productoNombre;
        private Integer cantidad;
        private Double precioUnitario;
        private Double subtotal;
    }
}
