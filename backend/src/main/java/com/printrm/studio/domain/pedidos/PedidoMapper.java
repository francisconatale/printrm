package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.produccion.OrdenProduccion;
import com.printrm.studio.domain.produccion.OrdenProduccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PedidoMapper {

    private final OrdenProduccionRepository ordenProduccionRepository;

    public PedidoResponseDTO toDto(Pedido pedido) {
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(pedido.getId().toString());
        dto.setClienteNombre(pedido.getCliente() != null ? pedido.getCliente().getNombre() : "Consumidor Final");
        dto.setEstado(pedido.getEstado().name());
        dto.setTotal(pedido.getTotal());
        dto.setMontoPagado(pedido.getMontoPagado());
        dto.setSaldoPendiente(pedido.getTotal() - pedido.getMontoPagado());
        LocalDateTime fecha = pedido.getFechaCreacion() != null
                ? pedido.getFechaCreacion()
                : (pedido.getFechaActualizacion() != null ? pedido.getFechaActualizacion() : LocalDateTime.now());
        dto.setFechaCreacion(fecha);
        dto.setItems(pedido.getItems().stream().map(this::itemToDto).collect(Collectors.toList()));
        return dto;
    }

    private ItemPedidoResponseDTO itemToDto(ItemPedido item) {
        ItemPedidoResponseDTO itemDto = new ItemPedidoResponseDTO();
        itemDto.setId(item.getId().toString());
        itemDto.setCantidad(item.getCantidad());
        itemDto.setCantidadMerma(item.getCantidadMerma());
        itemDto.setCantidadEntregada(item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0);
        itemDto.setSubtotal(item.getSubtotal());

        List<OrdenProduccion> ordenes = ordenProduccionRepository.findByItemPedidoId(item.getId());
        itemDto.setOrdenesProduccion(ordenes.stream().map(o -> ItemPedidoResponseDTO.OrdenProduccionResumenDTO.builder()
            .id(o.getId().toString())
            .cantidad(o.getCantidad())
            .estado(o.getEstado().name())
            .build()).collect(Collectors.toList()));

        if (item.getProducto() != null) {
            itemDto.setProductoId(item.getProducto().getId().toString());
            itemDto.setProductoNombre(item.getProducto().getNombre());
            itemDto.setPerfilNombre(item.getProducto().getNombre());

            int stockTotal = item.getProducto().getCantidadStock();
            itemDto.setStockDisponible(stockTotal);

            int cantidadProducida = ordenes.stream()
                .filter(o -> o.getEstado() == OrdenProduccion.EstadoProduccion.COMPLETADO)
                .mapToInt(OrdenProduccion::getCantidad)
                .sum();

            int cantidadEnProduccion = ordenes.stream()
                .filter(o -> o.getEstado() == OrdenProduccion.EstadoProduccion.COLA
                          || o.getEstado() == OrdenProduccion.EstadoProduccion.IMPRIMIENDO)
                .mapToInt(OrdenProduccion::getCantidad)
                .sum();

            int cantidadTotal = item.getCantidad() != null ? item.getCantidad() : 0;
            int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
            int cantidadPendiente = Math.max(0, cantidadTotal - cantidadEntregada);
            int faltante = Math.max(0, cantidadPendiente - stockTotal - cantidadEnProduccion);
            itemDto.setCantidadFaltante(faltante);
        } else {
            itemDto.setPerfilNombre("Item Desconocido");
            itemDto.setStockDisponible(0);
            int cantidadTotal = item.getCantidad() != null ? item.getCantidad() : 0;
            int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
            itemDto.setCantidadFaltante(Math.max(0, cantidadTotal - cantidadEntregada));
        }

        return itemDto;
    }
}
