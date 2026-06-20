package com.printrm.studio.domain.perfil;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final PerfilRepository repository;
    
    @Value("${studio.base-path}")
    private String basePath;

    public List<PerfilResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public PerfilResponseDTO findById(UUID id) {
        Perfil perfil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        return mapToResponseDTO(perfil);
    }

    @Transactional
    public PerfilResponseDTO create(PerfilRequestDTO dto) {
        Perfil perfil = mapToEntity(dto);
        perfil = repository.save(perfil);
        return mapToResponseDTO(perfil);
    }

    @Transactional
    public PerfilResponseDTO update(UUID id, PerfilRequestDTO dto) {
        Perfil perfil = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        
        updateEntity(perfil, dto);
        perfil = repository.save(perfil);
        return mapToResponseDTO(perfil);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Perfil no encontrado");
        }
        repository.deleteById(id);
    }

    public Map<String, List<String>> getSlicerConfigs() {
        Map<String, List<String>> configs = new HashMap<>();
        configs.put("print", listIniFiles("print"));
        configs.put("filament", listIniFiles("filament"));
        configs.put("printer", listIniFiles("printer"));
        return configs;
    }

    private List<String> listIniFiles(String subDir) {
        File dir = new File(basePath + "/configs/" + subDir);
        if (!dir.exists() || !dir.isDirectory()) return Collections.emptyList();
        
        File[] files = dir.listFiles((d, name) -> name.toLowerCase().endsWith(".ini"));
        if (files == null) return Collections.emptyList();
        
        return Arrays.stream(files)
                .map(File::getName)
                .map(name -> name.substring(0, name.length() - 4)) // Remove .ini
                .collect(Collectors.toList());
    }

    private PerfilResponseDTO mapToResponseDTO(Perfil perfil) {
        return PerfilResponseDTO.builder()
                .id(perfil.getId())
                .nombre(perfil.getNombre())
                .creadoEn(perfil.getCreadoEn())
                .actualizadoEn(perfil.getActualizadoEn())
                .modeloImpresora(perfil.getModeloImpresora())
                .consumoW(perfil.getConsumoW())
                .vidaUtilHoras(perfil.getVidaUtilHoras())
                .costoRepuestos(perfil.getCostoRepuestos())
                .filamentoPorKg(perfil.getFilamentoPorKg())
                .nozzleDiameter(perfil.getNozzleDiameter())
                .bedShape(perfil.getBedShape())
                .maxPrintHeight(perfil.getMaxPrintHeight())
                .printConfig(perfil.getPrintConfig())
                .filamentConfig(perfil.getFilamentConfig())
                .printerConfig(perfil.getPrinterConfig())
                .build();
    }

    private Perfil mapToEntity(PerfilRequestDTO dto) {
        return Perfil.builder()
                .nombre(dto.getNombre())
                .modeloImpresora(dto.getModeloImpresora())
                .consumoW(dto.getConsumoW())
                .vidaUtilHoras(dto.getVidaUtilHoras())
                .costoRepuestos(dto.getCostoRepuestos())
                .filamentoPorKg(dto.getFilamentoPorKg())
                .nozzleDiameter(dto.getNozzleDiameter())
                .bedShape(dto.getBedShape())
                .maxPrintHeight(dto.getMaxPrintHeight())
                .printConfig(dto.getPrintConfig())
                .filamentConfig(dto.getFilamentConfig())
                .printerConfig(dto.getPrinterConfig())
                .build();
    }

    private void updateEntity(Perfil perfil, PerfilRequestDTO dto) {
        if (dto.getNombre() != null) perfil.setNombre(dto.getNombre());
        if (dto.getModeloImpresora() != null) perfil.setModeloImpresora(dto.getModeloImpresora());
        if (dto.getConsumoW() != null) perfil.setConsumoW(dto.getConsumoW());
        if (dto.getVidaUtilHoras() != null) perfil.setVidaUtilHoras(dto.getVidaUtilHoras());
        if (dto.getCostoRepuestos() != null) perfil.setCostoRepuestos(dto.getCostoRepuestos());
        if (dto.getFilamentoPorKg() != null) perfil.setFilamentoPorKg(dto.getFilamentoPorKg());
        if (dto.getNozzleDiameter() != null) perfil.setNozzleDiameter(dto.getNozzleDiameter());
        if (dto.getBedShape() != null) perfil.setBedShape(dto.getBedShape());
        if (dto.getMaxPrintHeight() != null) perfil.setMaxPrintHeight(dto.getMaxPrintHeight());
        if (dto.getPrintConfig() != null) perfil.setPrintConfig(dto.getPrintConfig());
        if (dto.getFilamentConfig() != null) perfil.setFilamentConfig(dto.getFilamentConfig());
        if (dto.getPrinterConfig() != null) perfil.setPrinterConfig(dto.getPrinterConfig());
    }
}
