package com.printrm.studio.domain.biblioteca;

import com.printrm.studio.domain.perfil.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PiezaSTLService {

    private final PiezaSTLRepository repository;
    private final PerfilRepository perfilRepository;
    private final FilamentProfileRepository filamentRepository;
    private final PrintProfileRepository printRepository;

    public List<PiezaSTLResponseDTO> getAll() {
        return repository.findAllByOrderByCreadoEnDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PiezaSTLResponseDTO save(PiezaSTLRequestDTO dto) {
        PiezaSTL pieza = PiezaSTL.builder()
                .nombre(dto.getNombre())
                .filePath(dto.getFilePath())
                .volumenCm3(dto.getVolumenCm3())
                .pesoGramos(dto.getPesoGramos())
                .tiempoEstimado(dto.getTiempoEstimado())
                .build();

        if (dto.getPerfilImpresoraId() != null) {
            pieza.setPerfilPreferido(perfilRepository.findById(dto.getPerfilImpresoraId()).orElse(null));
        }
        if (dto.getPerfilFilamentoId() != null) {
            pieza.setFilamentoPreferido(filamentRepository.findById(dto.getPerfilFilamentoId()).orElse(null));
        }
        if (dto.getPerfilImpresionId() != null) {
            pieza.setImpresionPreferida(printRepository.findById(dto.getPerfilImpresionId()).orElse(null));
        }

        return mapToDTO(repository.save(pieza));
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }

    private PiezaSTLResponseDTO mapToDTO(PiezaSTL pieza) {
        PiezaSTLResponseDTO dto = new PiezaSTLResponseDTO();
        dto.setId(pieza.getId());
        dto.setNombre(pieza.getNombre());
        dto.setFilePath(pieza.getFilePath());
        dto.setVolumenCm3(pieza.getVolumenCm3());
        dto.setPesoGramos(pieza.getPesoGramos());
        dto.setTiempoEstimado(pieza.getTiempoEstimado());
        dto.setCreadoEn(pieza.getCreadoEn());

        if (pieza.getPerfilPreferido() != null) dto.setPerfilImpresoraNombre(pieza.getPerfilPreferido().getNombre());
        if (pieza.getFilamentoPreferido() != null) dto.setPerfilFilamentoNombre(pieza.getFilamentoPreferido().getNombre());
        if (pieza.getImpresionPreferida() != null) dto.setPerfilImpresionNombre(pieza.getImpresionPreferida().getNombre());

        return dto;
    }
}
