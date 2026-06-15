package com.printrm.studio.domain.biblioteca;

import lombok.Data;

@Data
public class PiezaSTLRequestDTO {
    private String nombre;
    private String filePath;
    private Double volumenCm3;
    private Double pesoGramos;
    private String tiempoEstimado;
    
    private String perfilImpresoraId;
    private String perfilFilamentoId;
    private String perfilImpresionId;
}
