package com.printrm.studio.domain.pedidos;

import lombok.Data;

@Data
public class ItemPedidoResponseDTO {
    private String id;
    private String productoId;
    private String productoNombre;
    private String perfilNombre;
    private Integer cantidad;
    private Integer cantidadMerma;
    private Double subtotal;
    private Double precioPersonalizado;
    private Integer stockDisponible;
    private Integer cantidadFaltante;
    private java.util.List<OrdenProduccionResumenDTO> ordenesProduccion;

    @Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class OrdenProduccionResumenDTO {
        private String id;
        private Integer cantidad;
        private String estado;
    }
}
