package com.printrm.studio.domain.pedidos;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

    @GetMapping
    public List<PedidoResponseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PedidoResponseDTO getById(@PathVariable String id) {
        return service.getPedido(id);
    }

    @PostMapping
    public PedidoResponseDTO create(@RequestBody PedidoRequestDTO request) {
        return service.crearPedido(request);
    }

    @PatchMapping("/{pedidoId}/items/{itemId}")
    public PedidoResponseDTO updateItemQuantity(
            @PathVariable String pedidoId,
            @PathVariable String itemId,
            @RequestParam Integer cantidad) {
        return service.actualizarCantidadItem(pedidoId, itemId, cantidad);
    }

    @PatchMapping("/{id}/estado")
    public void updateStatus(@PathVariable String id, @RequestParam String estado) {
        service.cambiarEstado(id, estado);
    }
}
