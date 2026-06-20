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
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;
    private final OrdenProduccionRepository ordenProduccionRepository;
    private final VentaService ventaService;

    @Transactional
    public PedidoResponseDTO crearPedido(PedidoRequestDTO request) {
        Cliente cliente = null;
        if (request.getClienteId() != null) {
            cliente = clienteRepository.findById(request.getClienteId()).orElse(null);
        }
            
        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .estado(Pedido.EstadoPedido.BORRADOR)
                .montoPagado(0.0)
                .build();

        Pedido savedPedido = repository.save(pedido);

        for (ItemPedidoRequestDTO itemDto : request.getItems()) {
            ItemPedido item = ItemPedido.builder()
                    .pedido(savedPedido)
                    .cantidad(itemDto.getCantidad())
                    .precioPersonalizado(itemDto.getPrecioPersonalizado())
                    .cantidadMerma(0)
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
        return mapToDTO(repository.save(savedPedido));
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
        return mapToDTO(repository.save(pedido));
    }

    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(String pedidoId, String itemId, Integer cantidad) {
        return actualizarCantidadItem(UUID.fromString(pedidoId), UUID.fromString(itemId), cantidad);
    }

    @Transactional
    public void cambiarEstado(String pedidoId, String nuevoEstado) {
        boolean estadoValido = false;
        if (nuevoEstado != null) {
            for (Pedido.EstadoPedido ep : Pedido.EstadoPedido.values()) {
                if (ep.name().equals(nuevoEstado)) {
                    estadoValido = true;
                    break;
                }
            }
        }
        if (!estadoValido) {
            throw new IllegalArgumentException("Estado de pedido no válido: " + nuevoEstado);
        }

        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        Pedido.EstadoPedido anterior = pedido.getEstado();

        if ("ENTREGADO".equals(nuevoEstado)) {
            boolean yaEntregadoCompletamente = true;
            for (ItemPedido item : pedido.getItems()) {
                int cantidadTotal = item.getCantidad() != null ? item.getCantidad() : 0;
                int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
                if (cantidadEntregada < cantidadTotal) {
                    yaEntregadoCompletamente = false;
                    break;
                }
            }

            if (yaEntregadoCompletamente) {
                throw new IllegalStateException("Este pedido ya fue entregado.");
            }

            // 1. Validar stock real disponible para todos los ítems de tipo producto (solo para las unidades pendientes de entrega)
            for (ItemPedido item : pedido.getItems()) {
                if (item.getProducto() != null) {
                    int stockDisponible = item.getProducto().getCantidadStock();
                    int cantidadTotal = item.getCantidad() != null ? item.getCantidad() : 0;
                    int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
                    int cantidadRequerida = cantidadTotal - cantidadEntregada;
                    if (cantidadRequerida > 0 && stockDisponible < cantidadRequerida) {
                        throw new RuntimeException("Stock insuficiente para entregar el producto: " + item.getProducto().getNombre() 
                                + " (Requerido: " + cantidadRequerida + ", Disponible: " + stockDisponible + ")");
                    }
                }
            }

            // 2. Descontar stock usando VentaService e incrementar cantidadEntregada
            for (ItemPedido item : pedido.getItems()) {
                if (item.getProducto() != null) {
                    int cantidadTotal = item.getCantidad() != null ? item.getCantidad() : 0;
                    int cantidadEntregada = item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0;
                    int cantidadRequerida = cantidadTotal - cantidadEntregada;
                    if (cantidadRequerida > 0) {
                        ventaService.registrarConsumoStock(item.getProducto().getId(), cantidadRequerida);
                        item.setCantidadEntregada(cantidadTotal);
                    }
                } else {
                    item.setCantidadEntregada(item.getCantidad());
                }
            }

            // 3. Registrar cobro final de saldo restante
            registrarIngresoPorVenta(pedido);

        } else if ("DEVUELTO".equals(nuevoEstado)) {
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
            if (!algunaUnidadDevuelta && anterior == Pedido.EstadoPedido.DEVUELTO) {
                throw new IllegalStateException("Este pedido ya fue devuelto.");
            }
            registrarReembolso(pedido);
        } else if ("EN_PRODUCCION".equals(nuevoEstado)) {
            registrarGastoProduccion(pedido);
        }
        
        pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado));
        repository.save(pedido);
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

                transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.EGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.MATERIAL)
                    .monto(montoAReclasificar) 
                    .pedidoId(pedido.getId())
                    .descripcion("Reclasificación por Merma (Ajuste Material)")
                    .build());

                transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.EGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.MERMA)
                    .monto(montoAReclasificar * -1)
                    .pedidoId(pedido.getId())
                    .descripcion("Estadística Merma: " + unidadesFallidas + " unidades de " + producto.getNombre())
                    .build());
            }
        }
    }

    @Transactional
    public PedidoResponseDTO registrarPago(String pedidoId, Double monto, String descripcion) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        pedido.setMontoPagado(pedido.getMontoPagado() + monto);
        
        transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.INGRESO)
                .categoria(Transaccion.CategoriaTransaccion.VENTA)
                .monto(monto)
                .pedidoId(pedido.getId())
                .descripcion(descripcion != null ? descripcion : "Pago parcial / Seña")
                .build());

        return mapToDTO(repository.save(pedido));
    }

    private void registrarGastoProduccion(Pedido pedido) {
        boolean yaRegistrado = transaccionRepository.existsByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.EGRESO);
        if (yaRegistrado) return;

        for (ItemPedido item : pedido.getItems()) {
            Producto producto = item.getProducto();
            if (producto != null && producto.getPartes() != null) {
                double costoBaseTotal = producto.getPartes().stream()
                        .mapToDouble(p -> p.getCostoBase() != null ? p.getCostoBase() : 0.0)
                        .sum();

                if (costoBaseTotal > 0) {
                    int cantidad = item.getCantidad() != null ? item.getCantidad() : 0;
                    transaccionRepository.save(Transaccion.builder()
                        .tipo(Transaccion.TipoTransaccion.EGRESO)
                        .categoria(Transaccion.CategoriaTransaccion.MATERIAL)
                        .monto(costoBaseTotal * cantidad * -1)
                        .pedidoId(pedido.getId())
                        .descripcion("Costo estimado de fabricación: " + producto.getNombre())
                        .build());
                }
            }
        }
    }

    private void registrarIngresoPorVenta(Pedido pedido) {
        double saldoPendiente = pedido.getTotal() - pedido.getMontoPagado();
        if (saldoPendiente > 0) {
            registrarPago(pedido.getId().toString(), saldoPendiente, "Cobro de saldo restante al entregar");
        }
    }

    private void registrarReembolso(Pedido pedido) {
        boolean yaRegistrado = transaccionRepository.existsByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.REEMBOLSO);
        if (yaRegistrado) return;

        if (pedido.getMontoPagado() > 0) {
            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(pedido.getMontoPagado() * -1)
                    .pedidoId(pedido.getId())
                    .descripcion("Reembolso total de dinero cobrado: $" + pedido.getMontoPagado())
                    .build());
        }
    }

    public List<PedidoResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PedidoResponseDTO getPedido(String pedidoId) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        return mapToDTO(pedido);
    }

    private PedidoResponseDTO mapToDTO(Pedido pedido) {
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
        dto.setItems(pedido.getItems().stream().map(item -> {
            ItemPedidoResponseDTO itemDto = new ItemPedidoResponseDTO();
            itemDto.setId(item.getId().toString());
            itemDto.setCantidad(item.getCantidad());
            itemDto.setCantidadMerma(item.getCantidadMerma());
            itemDto.setCantidadEntregada(item.getCantidadEntregada() != null ? item.getCantidadEntregada() : 0);
            itemDto.setSubtotal(item.getSubtotal());
            itemDto.setPrecioPersonalizado(item.getPrecioPersonalizado());
            
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
        }).collect(Collectors.toList()));
        return dto;
    }
}
