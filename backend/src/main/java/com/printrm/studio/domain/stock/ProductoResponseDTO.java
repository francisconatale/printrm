package com.printrm.studio.domain.stock;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.printrm.studio.domain.biblioteca.PiezaSTLResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponseDTO {
    private String id;
    private String nombre;
    private Integer cantidadStock;
    private Double precioSugerido;
    private List<PiezaSTLResponseDTO> partes;
    private List<LoteDTO> lotes;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime creadoEn;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime actualizadoEn;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoteDTO {
        private String id;
        private Integer cantidadActual;
        private Double costoUnitario;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime fechaCreacion;
    }
}
