package com.printrm.studio.domain.stock;

import com.printrm.studio.domain.biblioteca.PiezaSTLResponseDTO;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductoResponseDTO {
    private String id;
    private String nombre;
    private Integer cantidadStock;
    private Double precioSugerido;
    private List<PiezaSTLResponseDTO> partes;
    private List<LoteDTO> lotes;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;

    @Data
    @Builder
    public static class LoteDTO {
        private String id;
        private Integer cantidadActual;
        private Double costoUnitario;
        private LocalDateTime fechaCreacion;
    }
}
