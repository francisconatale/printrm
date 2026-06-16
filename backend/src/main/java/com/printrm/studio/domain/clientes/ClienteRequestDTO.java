package com.printrm.studio.domain.clientes;

import lombok.Data;

@Data
public class ClienteRequestDTO {
    private String nombre;
    private String email;
    private String telefono;
    private String notas;
}
