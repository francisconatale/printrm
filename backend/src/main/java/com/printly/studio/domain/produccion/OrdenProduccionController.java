package com.printly.studio.domain.produccion;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/produccion/ordenes")
@RequiredArgsConstructor
public class OrdenProduccionController {

    private final OrdenProduccionService service;
    private final OrdenProduccionMapper mapper;

    @GetMapping
    public Page<OrdenProduccionResponseDTO> getAll(@PageableDefault(size = 20) Pageable pageable) {
        return service.getAll(pageable).map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public OrdenProduccionResponseDTO getById(@PathVariable String id) {
        return mapper.toDto(service.getById(UUID.fromString(id)));
    }

    @PostMapping("/vinculada")
    public OrdenProduccionResponseDTO createVinculada(@jakarta.validation.Valid @RequestBody OrdenProduccionRequestDTO dto) {
        OrdenProduccion o = service.crearOrdenVinculada(
                com.printly.studio.utils.UUIDUtils.parseUUID(dto.getItemPedidoId()),
                dto.getCantidad()
        );
        return mapper.toDto(o);
    }

    @PostMapping("/independiente")
    public OrdenProduccionResponseDTO createIndependiente(@jakarta.validation.Valid @RequestBody OrdenProduccionRequestDTO dto) {
        OrdenProduccion o = service.crearOrdenIndependiente(
                com.printly.studio.utils.UUIDUtils.parseUUID(dto.getProductoId()),
                dto.getCantidad()
        );
        return mapper.toDto(o);
    }

    @PatchMapping("/{id}/estado")
    public OrdenProduccionResponseDTO updateStatus(@PathVariable String id, @RequestParam String estado) {
        OrdenProduccion o = service.cambiarEstado(UUID.fromString(id), estado);
        return mapper.toDto(o);
    }

    @PostMapping("/{id}/merma")
    public OrdenProduccionResponseDTO registrarMermaParcial(
            @PathVariable String id,
            @RequestParam Integer unidadesFallidas) {
        OrdenProduccion o = service.registrarMermaParcial(UUID.fromString(id), unidadesFallidas);
        return mapper.toDto(o);
    }
}
