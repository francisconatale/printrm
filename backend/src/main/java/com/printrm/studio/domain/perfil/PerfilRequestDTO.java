package com.printrm.studio.domain.perfil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String nombre;

    private String modeloImpresora;

    private Double consumoW;

    // Slicer Configuration
    private String printConfig;
    private String filamentConfig;
    private String printerConfig;
}

