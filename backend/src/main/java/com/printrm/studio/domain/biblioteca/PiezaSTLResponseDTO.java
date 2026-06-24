package com.printrm.studio.domain.biblioteca;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private Double costoBase;
    private Double costoMaterial;
    private Double costoEnergia;
    private Double costoError;
    private String imagenBase64;
    
    private String perfilImpresoraNombre;
    private String perfilFilamentoNombre;
    private String perfilImpresionNombre;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime creadoEn;
}

