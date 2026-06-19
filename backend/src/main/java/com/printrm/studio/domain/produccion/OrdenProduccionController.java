package com.printrm.studio.domain.produccion;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/produccion/ordenes")
@RequiredArgsConstructor
public class OrdenProduccionController {

    private final OrdenProduccionService service;

    @GetMapping
    public List<OrdenProduccionResponseDTO> getAll() {
        return service.getAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OrdenProduccionResponseDTO getById(@PathVariable String id) {
        return mapToDTO(service.getById(UUID.fromString(id)));
    }

    @PostMapping("/vinculada")
    public OrdenProduccionResponseDTO createVinculada(@RequestBody OrdenProduccionRequestDTO dto) {
        OrdenProduccion o = service.crearOrdenVinculada(
                UUID.fromString(dto.getItemPedidoId()),
                dto.getCantidad(),
                dto.getTipo(),
                dto.getProveedor(),
                dto.getCostoEstimado()
        );
        return mapToDTO(o);
    }

    @PostMapping("/independiente")
    public OrdenProduccionResponseDTO createIndependiente(@RequestBody OrdenProduccionRequestDTO dto) {
        OrdenProduccion o = service.crearOrdenIndependiente(
                UUID.fromString(dto.getProductoId()),
                dto.getCantidad(),
                dto.getTipo(),
                dto.getProveedor(),
                dto.getCostoEstimado()
        );
        return mapToDTO(o);
    }

    @PatchMapping("/{id}/estado")
    public OrdenProduccionResponseDTO updateStatus(@PathVariable String id, @RequestParam String estado) {
        OrdenProduccion o = service.cambiarEstado(UUID.fromString(id), estado);
        return mapToDTO(o);
    }

    private OrdenProduccionResponseDTO mapToDTO(OrdenProduccion o) {
        return OrdenProduccionResponseDTO.builder()
                .id(o.getId().toString())
                .itemPedidoId(o.getItemPedido() != null ? o.getItemPedido().getId().toString() : null)
                .pedidoId(o.getItemPedido() != null ? o.getItemPedido().getPedido().getId().toString() : null)
                .clienteNombre(o.getItemPedido() != null && o.getItemPedido().getPedido().getCliente() != null 
                        ? o.getItemPedido().getPedido().getCliente().getNombre() 
                        : (o.getItemPedido() != null ? "Consumidor Final" : "Stock Propio"))
                .productoId(o.getProducto() != null ? o.getProducto().getId().toString() : null)
                .productoNombre(o.getProducto() != null ? o.getProducto().getNombre() : "Pieza Cotizada")
                .cantidad(o.getCantidad())
                .tipo(o.getTipo().name())
                .estado(o.getEstado().name())
                .costoEstimado(o.getCostoEstimado())
                .proveedor(o.getProveedor())
                .fechaInicio(o.getFechaInicio())
                .fechaFin(o.getFechaFin())
                .build();
    }
}
