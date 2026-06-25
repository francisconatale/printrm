package com.printly.studio.domain.stock;

import lombok.Data;
import java.util.List;

@Data
public class ProductoRequestDTO {
    private String id;
    private String nombre;
    private Double precioSugerido;
    private Integer cantidadStock;
    private List<String> parteIds;
}
