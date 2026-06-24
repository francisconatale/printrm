package com.printrm.studio.domain.clientes;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;
    private final ClienteMapper mapper;

    public List<ClienteDTO> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public Page<ClienteDTO> getAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }

    public ClienteDTO getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    @Transactional
    public ClienteDTO create(ClienteDTO request) {
        Cliente cliente = Cliente.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .build();
        return mapper.toDto(repository.save(cliente));
    }

    @Transactional
    public ClienteDTO update(UUID id, ClienteDTO request) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        cliente.setNombre(request.getNombre());
        cliente.setEmail(request.getEmail());
        cliente.setTelefono(request.getTelefono());
        
        return mapper.toDto(repository.save(cliente));
    }

    @Transactional
    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
