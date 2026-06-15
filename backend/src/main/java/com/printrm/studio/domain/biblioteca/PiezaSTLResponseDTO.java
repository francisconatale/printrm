package com.printrm.studio.domain.biblioteca;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PiezaSTLResponseDTO {
    private String id;
    private String nombre;
    private String filePath;
    private Double volumenCm3;
    private Double pesoGramos;
    private String tiempoEstimado;
    
    private String perfilImpresoraNombre;
    private String perfilFilamentoNombre;
    private String perfilImpresionNombre;
    
    private LocalDateTime creadoEn;
}
