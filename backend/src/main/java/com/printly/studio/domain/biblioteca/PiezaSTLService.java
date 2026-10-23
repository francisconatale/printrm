package com.printly.studio.domain.biblioteca;

import com.printly.studio.domain.ajustes.AjustesDTO;
import com.printly.studio.domain.ajustes.AjustesService;
import com.printly.studio.domain.calculo.CostCalculationResult;
import com.printly.studio.domain.calculo.CostCalculationService;
import com.printly.studio.domain.perfil.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final CostCalculationService costCalculationService;
    private final AjustesService ajustesService;
    private final PiezaSTLMapper mapper;

    @Value("${studio.base-path}")
    private String basePath;

    public List<PiezaSTLResponseDTO> getAll() {
        AjustesDTO ajustes = ajustesService.getAjustes();
        return repository.findAllByDeletedFalseOrderByCreadoEnDesc().stream()
                .map(pieza -> mapper.toDto(pieza, ajustes))
                .collect(Collectors.toList());
    }

    public Page<PiezaSTLResponseDTO> getAll(Pageable pageable) {
        AjustesDTO ajustes = ajustesService.getAjustes();
        return repository.findAllByDeletedFalse(pageable)
                .map(pieza -> mapper.toDto(pieza, ajustes));
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
                    throw new RuntimeException("Error al mover el archivo STL subido a almacenamiento permanente: " + e.getMessage(), e);
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
                .costoError(dto.getCostoError())
                .insumosExtra(dto.getInsumosExtra())
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

        return mapper.toDto(repository.save(pieza), ajustesService.getAjustes());
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }
}
