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

    public List<PrintProfileResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public PrintProfileResponseDTO findById(UUID id) {
        PrintProfile print = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de impresión no encontrado"));
        return mapToResponseDTO(print);
    }

    @Transactional
    public PrintProfileResponseDTO create(PrintProfileRequestDTO dto) {
        PrintProfile print = mapToEntity(dto);
        print = repository.save(print);
        return mapToResponseDTO(print);
    }

    @Transactional
    public PrintProfileResponseDTO update(UUID id, PrintProfileRequestDTO dto) {
        PrintProfile print = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil de impresión no encontrado"));
        
        updateEntity(print, dto);
        print = repository.save(print);
        return mapToResponseDTO(print);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Perfil de impresión no encontrado");
        }
        repository.deleteById(id);
    }

    private PrintProfileResponseDTO mapToResponseDTO(PrintProfile entity) {
        return PrintProfileResponseDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .layerHeight(entity.getLayerHeight())
                .perimeters(entity.getPerimeters())
                .fillDensity(entity.getFillDensity())
                .speedPrint(entity.getSpeedPrint())
                .printConfig(entity.getPrintConfig())
                .creadoEn(entity.getCreadoEn())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }

    private PrintProfile mapToEntity(PrintProfileRequestDTO dto) {
        return PrintProfile.builder()
                .nombre(dto.getNombre())
                .layerHeight(dto.getLayerHeight())
                .perimeters(dto.getPerimeters())
                .fillDensity(dto.getFillDensity())
                .speedPrint(dto.getSpeedPrint())
                .build();
    }

    private void updateEntity(PrintProfile entity, PrintProfileRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setLayerHeight(dto.getLayerHeight());
        entity.setPerimeters(dto.getPerimeters());
        entity.setFillDensity(dto.getFillDensity());
        entity.setSpeedPrint(dto.getSpeedPrint());
    }
}
