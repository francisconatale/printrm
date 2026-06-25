package com.printly.studio.domain.pedidos;

import lombok.Data;

@Data
public class ItemPedidoResponseDTO {
    private String id;
    private String productoId;
    private String productoNombre;
    private String perfilNombre;
    private Integer cantidad;
    private Integer cantidadMerma;
    private Integer cantidadEntregada;
    private Double subtotal;
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
