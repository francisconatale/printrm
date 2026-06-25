package com.printly.studio.domain.clientes;

import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public ClienteDTO toDto(Cliente entity) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setEmail(entity.getEmail());
        dto.setTelefono(entity.getTelefono());
        return dto;
    }
}
