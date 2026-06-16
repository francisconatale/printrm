package com.printrm.studio.domain.biblioteca;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.calculo.CostCalculationResult;
import com.printrm.studio.domain.calculo.CostCalculationService;
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
    private final CostCalculationService costCalculationService;
    private final AjustesService ajustesService;

    @Value("${studio.base-path}")
    private String basePath;

    public List<PiezaSTLResponseDTO> getAll() {
        AjustesDTO ajustes = ajustesService.getAjustes();
        return repository.findAllByOrderByCreadoEnDesc().stream()
                .map(pieza -> mapToDTO(pieza, ajustes))
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

        return mapToDTO(repository.save(pieza), ajustesService.getAjustes());
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }

    private PiezaSTLResponseDTO mapToDTO(PiezaSTL pieza, AjustesDTO ajustes) {
        PiezaSTLResponseDTO dto = new PiezaSTLResponseDTO();
        dto.setId(pieza.getId());
        dto.setNombre(pieza.getNombre());
        dto.setFilePath(pieza.getFilePath());
        dto.setVolumenCm3(pieza.getVolumenCm3());
        dto.setPesoGramos(pieza.getPesoGramos());
        dto.setTiempoEstimado(pieza.getTiempoEstimado());
        dto.setImagenBase64(pieza.getImagenBase64());
        dto.setCreadoEn(pieza.getCreadoEn());

        if (pieza.getPerfilPreferido() != null) dto.setPerfilImpresoraNombre(pieza.getPerfilPreferido().getNombre());
        if (pieza.getFilamentoPreferido() != null) dto.setPerfilFilamentoNombre(pieza.getFilamentoPreferido().getNombre());
        if (pieza.getImpresionPreferida() != null) dto.setPerfilImpresionNombre(pieza.getImpresionPreferida().getNombre());

        // Dynamic cost calculation
        int horas = 0;
        int minutos = 0;
        if (pieza.getTiempoEstimado() != null && pieza.getTiempoEstimado().contains("h")) {
            try {
                String[] parts = pieza.getTiempoEstimado().split("h");
                horas = Integer.parseInt(parts[0].trim());
                if (parts.length > 1) {
                    minutos = Integer.parseInt(parts[1].replace("m", "").trim());
                }
            } catch (Exception ignored) {}
        }

        CostCalculationResult calc = costCalculationService.calculate(
            pieza.getPesoGramos(), horas, minutos, 0.0, 
            pieza.getPerfilPreferido(), pieza.getFilamentoPreferido(), ajustes
        );

        dto.setCostoBase(calc != null ? calc.getCostoBase() : 0.0);

        return dto;
    }
}
