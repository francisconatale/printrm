package com.printrm.studio.domain.venta;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class DevolucionResponse {
    private List<ItemDevuelto> items;
    private Double totalReembolsado;
    private String mensaje;

    @Data
    @Builder
    public static class ItemDevuelto {
        private String productoId;
        private String productoNombre;
        private Integer cantidad;
        private Double subtotal;
    }
}
