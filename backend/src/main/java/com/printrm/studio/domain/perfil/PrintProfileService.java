package com.printrm.studio.domain.perfil;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrintProfileService {

    private final PrintProfileRepository repository;
    private final PrintProfileMapper mapper;

    public List<PrintProfileResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public PrintProfileResponseDTO findById(UUID id) {
        PrintProfile print = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de impresión no encontrado"));
        return mapper.toResponseDto(print);
    }

    @Transactional
    public PrintProfileResponseDTO create(PrintProfileRequestDTO dto) {
        PrintProfile print = mapper.toEntity(dto);
        print = repository.save(print);
        return mapper.toResponseDto(print);
    }

    @Transactional
    public PrintProfileResponseDTO update(UUID id, PrintProfileRequestDTO dto) {
        PrintProfile print = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de impresión no encontrado"));
        
        mapper.updateEntity(print, dto);
        print = repository.save(print);
        return mapper.toResponseDto(print);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Perfil de impresión no encontrado");
        }
        repository.deleteById(id);
    }
}
