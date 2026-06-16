package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.calculo.Calculo;
import com.printrm.studio.domain.calculo.CalculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository repository;
    private final ItemPedidoRepository itemRepository;
    private final ClienteRepository clienteRepository;
    private final CalculoRepository calculoRepository;

    @Transactional
    public PedidoResponseDTO crearPedido(PedidoRequestDTO request) {
        Cliente cliente = null;
        if (request.getClienteId() != null) {
            cliente = clienteRepository.findById(request.getClienteId()).orElse(null);
        }

        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .estado(Pedido.EstadoPedido.BORRADOR)
                .build();

        Pedido savedPedido = repository.save(pedido);

        if (request.getItems() != null) {
            for (ItemPedidoRequestDTO itemDto : request.getItems()) {
                Calculo calculo = calculoRepository.findById(itemDto.getCalculoId())
                        .orElseThrow(() -> new RuntimeException("Cálculo no encontrado: " + itemDto.getCalculoId()));
                
                ItemPedido item = ItemPedido.builder()
                        .pedido(savedPedido)
                        .calculo(calculo)
                        .cantidad(itemDto.getCantidad())
                        .build();
                item.calcularSubtotal();
                itemRepository.save(item);
                savedPedido.getItems().add(item);
            }
        }

        savedPedido.calcularTotal();
        return mapToDTO(repository.save(savedPedido));
    }

    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(UUID pedidoId, UUID itemId, Integer cantidad) {
        ItemPedido item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado"));
        
        item.setCantidad(cantidad);
        item.calcularSubtotal();
        itemRepository.save(item);

        Pedido pedido = repository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.calcularTotal();
        return mapToDTO(repository.save(pedido));
    }

    // Helper for tests with String IDs
    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(String pedidoId, String itemId, Integer cantidad) {
        return actualizarCantidadItem(UUID.fromString(pedidoId), UUID.fromString(itemId), cantidad);
    }

    @Transactional
    public void cambiarEstado(String pedidoId, String estado) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(Pedido.EstadoPedido.valueOf(estado));
        repository.save(pedido);
    }

    public List<PedidoResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PedidoResponseDTO getPedido(String pedidoId) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return mapToDTO(pedido);
    }

    private PedidoResponseDTO mapToDTO(Pedido pedido) {
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(pedido.getId().toString());
        dto.setClienteNombre(pedido.getCliente() != null ? pedido.getCliente().getNombre() : "Consumidor Final");
        dto.setEstado(pedido.getEstado().name());
        dto.setTotal(pedido.getTotal());
        dto.setItems(pedido.getItems().stream().map(item -> {
            ItemPedidoResponseDTO itemDto = new ItemPedidoResponseDTO();
            itemDto.setId(item.getId().toString());
            itemDto.setCantidad(item.getCantidad());
            itemDto.setSubtotal(item.getSubtotal());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
