package com.printly.studio.domain.clientes;

import lombok.Data;
import java.util.UUID;

@Data
public class ClienteDTO {
    private UUID id;
    private String nombre;
    private String email;
    private String telefono;
}
