package com.printrm.studio.domain.clientes;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ClienteResponseDTO {
    private UUID id;
    private String nombre;
    private String email;
    private String telefono;
    private String notas;
    private LocalDateTime fechaCreacion;
}
