package com.printrm.studio.domain.biblioteca;

import com.printrm.studio.domain.perfil.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PiezaSTLService {

    private final PiezaSTLRepository repository;
    private final PerfilRepository perfilRepository;
    private final FilamentProfileRepository filamentRepository;
    private final PrintProfileRepository printRepository;

    @Value("${studio.base-path}")
    private String basePath;

    public List<PiezaSTLResponseDTO> getAll() {
        return repository.findAllByOrderByCreadoEnDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PiezaSTLResponseDTO save(PiezaSTLRequestDTO dto) {
        String targetFileName = dto.getFilePath();
        if (targetFileName != null && !targetFileName.isEmpty()) {
            String currentBasePath = basePath != null ? basePath : ".";
            File srcFile = new File(currentBasePath + "/temp-uploads/" + targetFileName);
            if (srcFile.exists()) {
                File savedDir = new File(currentBasePath + "/saved-uploads");
                if (!savedDir.exists()) {
                    savedDir.mkdirs();
                }
                File destFile = new File(savedDir, targetFileName);
                if (destFile.exists()) {
                    String nameWithoutExt = targetFileName;
                    String ext = "";
                    int dotIdx = targetFileName.lastIndexOf('.');
                    if (dotIdx > 0) {
                        nameWithoutExt = targetFileName.substring(0, dotIdx);
                        ext = targetFileName.substring(dotIdx);
                    }
                    targetFileName = nameWithoutExt + "_" + System.currentTimeMillis() + ext;
                    destFile = new File(savedDir, targetFileName);
                }
                try {
                    Files.move(srcFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        PiezaSTL pieza = PiezaSTL.builder()
                .nombre(dto.getNombre())
                .filePath(targetFileName)
                .volumenCm3(dto.getVolumenCm3())
                .pesoGramos(dto.getPesoGramos())
                .tiempoEstimado(dto.getTiempoEstimado())
                .costoBase(dto.getCostoBase())
                .imagenBase64(dto.getImagenBase64())
                .build();

        if (dto.getPerfilImpresoraId() != null) {
            pieza.setPerfilPreferido(perfilRepository.findById(java.util.UUID.fromString(dto.getPerfilImpresoraId())).orElse(null));
        }
        if (dto.getPerfilFilamentoId() != null) {
            pieza.setFilamentoPreferido(filamentRepository.findById(java.util.UUID.fromString(dto.getPerfilFilamentoId())).orElse(null));
        }
        if (dto.getPerfilImpresionId() != null) {
            pieza.setImpresionPreferida(printRepository.findById(java.util.UUID.fromString(dto.getPerfilImpresionId())).orElse(null));
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
        dto.setCostoBase(pieza.getCostoBase());
        dto.setImagenBase64(pieza.getImagenBase64());
        dto.setCreadoEn(pieza.getCreadoEn());

        if (pieza.getPerfilPreferido() != null) dto.setPerfilImpresoraNombre(pieza.getPerfilPreferido().getNombre());
        if (pieza.getFilamentoPreferido() != null) dto.setPerfilFilamentoNombre(pieza.getFilamentoPreferido().getNombre());
        if (pieza.getImpresionPreferida() != null) dto.setPerfilImpresionNombre(pieza.getImpresionPreferida().getNombre());

        return dto;
    }
}
