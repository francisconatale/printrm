package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import com.printrm.studio.domain.produccion.OrdenProduccion;
import com.printrm.studio.domain.produccion.OrdenProduccionRepository;
import com.printrm.studio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository repository;
    private final ItemPedidoRepository itemRepository;
    private final ClienteRepository clienteRepository;
    private final TransaccionRepository transaccionRepository;
    private final com.printrm.studio.domain.finanzas.TransaccionService transaccionService;
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;
    private final OrdenProduccionRepository ordenProduccionRepository;
    private final com.printrm.studio.domain.venta.VentaService ventaService;
    private final PedidoMapper mapper;

    @Transactional
    public PedidoResponseDTO crearPedido(PedidoRequestDTO request) {
        Cliente cliente = null;
        if (request.getClienteId() != null) {
            cliente = clienteRepository.findById(request.getClienteId()).orElse(null);
        }
            
        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .build();

        Pedido savedPedido = repository.save(pedido);

        for (ItemPedidoRequestDTO itemDto : request.getItems()) {
            ItemPedido item = ItemPedido.builder()
                    .pedido(savedPedido)
                    .cantidad(itemDto.getCantidad())
                    .build();

            if (itemDto.getProductoId() != null) {
                Producto prod = productoRepository.findById(itemDto.getProductoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + itemDto.getProductoId()));
                item.setProducto(prod);
            }

            item.calcularSubtotal();
            itemRepository.save(item);
            savedPedido.getItems().add(item);
        }

        savedPedido.calcularTotal();
        return mapper.toDto(repository.save(savedPedido));
    }

    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(UUID pedidoId, UUID itemId, Integer cantidad) {
        ItemPedido item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Ítem no encontrado"));
        
        item.setCantidad(cantidad);
        item.calcularSubtotal();
        itemRepository.save(item);

        Pedido pedido = repository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        
        pedido.calcularTotal();
        return mapper.toDto(repository.save(pedido));
    }

    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(String pedidoId, String itemId, Integer cantidad) {
        return actualizarCantidadItem(UUID.fromString(pedidoId), UUID.fromString(itemId), cantidad);
    }

    @Transactional
    public void cambiarEstado(String pedidoId, String nuevoEstadoStr) {
        Pedido.EstadoPedido nuevoEstado = parseEstado(nuevoEstadoStr);

        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        validarTransicionEstado(pedido.getEstado(), nuevoEstado);

        if (nuevoEstado == Pedido.EstadoPedido.ENTREGADO) {
            procesarEntrega(pedido);
        } else if (nuevoEstado == Pedido.EstadoPedido.DEVUELTO) {
            procesarDevolucion(pedido);
        }
        
        pedido.setEstado(nuevoEstado);
        repository.save(pedido);
    }

    private Pedido.EstadoPedido parseEstado(String estado) {
        try {
            return Pedido.EstadoPedido.valueOf(estado);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException("Estado de pedido no válido: " + estado);
        }
    }

    private void validarTransicionEstado(Pedido.EstadoPedido anterior, Pedido.EstadoPedido nuevo) {
        if (anterior == Pedido.EstadoPedido.CANCELADO || anterior == Pedido.EstadoPedido.DEVUELTO) {
            throw new IllegalStateException("No se puede cambiar el estado de un pedido " + anterior);
        }
        
        if (anterior == Pedido.EstadoPedido.ENTREGADO && nuevo != Pedido.EstadoPedido.DEVUELTO) {
            throw new IllegalStateException("Un pedido entregado solo puede ser devuelto.");
        }

        if (nuevo == Pedido.EstadoPedido.BORRADOR && anterior != Pedido.EstadoPedido.BORRADOR) {
            throw new IllegalStateException("No se puede volver al estado Borrador.");
        }
        
        if (nuevo == Pedido.EstadoPedido.COTIZADO && anterior.ordinal() >= Pedido.EstadoPedido.CONFIRMADO.ordinal()) {
            throw new IllegalStateException("No se puede volver a Cotizado un pedido que ya fue Confirmado o superior.");
        }

        if (nuevo == Pedido.EstadoPedido.CONFIRMADO && anterior.ordinal() >= Pedido.EstadoPedido.EN_PRODUCCION.ordinal()) {
            throw new IllegalStateException("No se puede volver a Confirmado un pedido que ya está en Producción o superior.");
        }
    }

    private void procesarEntrega(Pedido pedido) {
        boolean yaEntregadoCompletamente = pedido.getItems().stream()
                .allMatch(item -> {
                    int cant = item.getCantidad() != null ? item.getCantidad() : 0;
                    int ent = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
                    return ent >= cant;
                });

        if (yaEntregadoCompletamente) {
            throw new IllegalStateException("Este pedido ya fue entregado.");
        }

        for (ItemPedido item : pedido.getItems()) {
            int cantidadTotal = item.getCantidad() != null ? item.getCantidad() : 0;
            int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
            int cantidadRequerida = cantidadTotal - cantidadEntregada;
            
            if (item.getProducto() != null && cantidadRequerida > 0) {
                productoService.validarStockDisponible(item.getProducto(), cantidadRequerida);
                productoService.updateStock(item.getProducto().getId().toString(), -cantidadRequerida);
                
                item.setCantidadEntregada(cantidadTotal);
                itemRepository.save(item);
            } else if (item.getProducto() == null) {
                item.setCantidadEntregada(cantidadTotal);
                itemRepository.save(item);
            }
        }

        ventaService.registrarCobroSaldo(pedido);
    }

    private void procesarDevolucion(Pedido pedido) {
        boolean algunaUnidadDevuelta = false;
        for (ItemPedido item : pedido.getItems()) {
            if (item.getProducto() != null) {
                int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
                if (cantidadEntregada > 0) {
                    productoService.updateStock(item.getProducto().getId().toString(), cantidadEntregada);
                    item.setCantidadEntregada(0);
                    algunaUnidadDevuelta = true;
                }
            }
        }
        if (!algunaUnidadDevuelta && pedido.getEstado() == Pedido.EstadoPedido.DEVUELTO) {
            throw new IllegalStateException("Este pedido ya fue devuelto.");
        }
        double totalReembolso = pedido.getMontoPagado() != null ? pedido.getMontoPagado() : 0;
        ventaService.registrarReembolso(pedido.getId(), totalReembolso, "Reembolso por pedido cancelado/devuelto");
    }

    @Transactional
    public void registrarMerma(String pedidoId, String itemId, Integer unidadesFallidas) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        
        ItemPedido item = itemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new ResourceNotFoundException("Ítem no encontrado"));

        item.setCantidadMerma(item.getCantidadMerma() + unidadesFallidas);
        itemRepository.save(item);

        List<Transaccion> egresos = transaccionRepository.findAllByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.EGRESO);
        
        if (!egresos.isEmpty()) {
            Producto producto = item.getProducto();
            if (producto != null && producto.getPartes() != null) {
                double costoPorUnidad = producto.getPartes().stream()
                        .mapToDouble(p -> p.getCostoBase() != null ? p.getCostoBase() : 0.0)
                        .sum();
                double montoAReclasificar = costoPorUnidad * unidadesFallidas;

                transaccionService.registrarTransaccion(
                    Transaccion.TipoTransaccion.EGRESO,
                    Transaccion.CategoriaTransaccion.MATERIAL,
                    montoAReclasificar,
                    "Reclasificación por Merma (Ajuste Material)",
                    pedido.getId()
                );

                transaccionService.registrarTransaccion(
                    Transaccion.TipoTransaccion.EGRESO,
                    Transaccion.CategoriaTransaccion.MERMA,
                    -montoAReclasificar,
                    "Estadística Merma: " + unidadesFallidas + " unidades de " + producto.getNombre(),
                    pedido.getId()
                );
            }
        }
    }

    @Transactional
    public PedidoResponseDTO registrarPago(String pedidoId, Double monto, String descripcion) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        ventaService.registrarPago(pedido, monto, descripcion);
        return mapper.toDto(repository.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> getAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO getPedido(String pedidoId) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        return mapper.toDto(pedido);
    }
}
