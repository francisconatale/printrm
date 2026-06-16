package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.calculo.Calculo;
import com.printrm.studio.domain.calculo.CalculoRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
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
    private final TransaccionRepository transaccionRepository;
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;

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

        if (request.getItems() != null) {
            for (ItemPedidoRequestDTO itemDto : request.getItems()) {
                ItemPedido item = ItemPedido.builder()
                        .pedido(savedPedido)
                        .cantidad(itemDto.getCantidad())
                        .cantidadMerma(0)
                        .build();

                if (itemDto.getProductoId() != null) {
                    Producto prod = productoRepository.findById(itemDto.getProductoId())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemDto.getProductoId()));
                    item.setProducto(prod);
                } else if (itemDto.getCalculoId() != null) {
                    Calculo calculo = calculoRepository.findById(itemDto.getCalculoId())
                            .orElseThrow(() -> new RuntimeException("Cálculo no encontrado: " + itemDto.getCalculoId()));
                    item.setCalculo(calculo);
                }
                
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

    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(String pedidoId, String itemId, Integer cantidad) {
        return actualizarCantidadItem(UUID.fromString(pedidoId), UUID.fromString(itemId), cantidad);
    }

    @Transactional
    public void cambiarEstado(String pedidoId, String nuevoEstado) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Pedido.EstadoPedido anterior = pedido.getEstado();
        pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado));

        if ("ENTREGADO".equals(nuevoEstado)) {
            registrarIngresoPorVenta(pedido);
            actualizarStockPorPedido(pedido, -1); // Descontar stock
        } else if ("DEVUELTO".equals(nuevoEstado)) {
            registrarReembolso(pedido);
            actualizarStockPorPedido(pedido, 1); // Reponer stock
        } else if ("EN_PRODUCCION".equals(nuevoEstado)) {
            registrarGastoProduccion(pedido);
        }
        
        repository.save(pedido);
    }

    private void actualizarStockPorPedido(Pedido pedido, int multiplicador) {
        for (ItemPedido item : pedido.getItems()) {
            if (item.getProducto() != null) {
                productoService.updateStock(item.getProducto().getId().toString(), item.getCantidad() * multiplicador);
            }
        }
    }

    @Transactional
    public void registrarMerma(String pedidoId, String itemId, Integer unidadesFallidas) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        ItemPedido item = itemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado"));

        item.setCantidadMerma(item.getCantidadMerma() + unidadesFallidas);
        itemRepository.save(item);

        List<Transaccion> egresos = transaccionRepository.findAllByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.EGRESO);
        
        if (!egresos.isEmpty()) {
            Calculo calc = item.getCalculo();
            if (calc != null) {
                double costoPorUnidad = calc.getCostoEnergia() + calc.getCostoFilamento();
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
                    .descripcion("Estadística Merma: " + unidadesFallidas + " unidades de " + calc.getPerfilNombre())
                    .build());
            }
        }
    }

    @Transactional
    public PedidoResponseDTO registrarPago(String pedidoId, Double monto, String descripcion) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

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
            Calculo calc = item.getCalculo();
            if (calc != null) {
                transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.EGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.MATERIAL)
                    .monto(calc.getCostoFilamento() * item.getCantidad() * -1)
                    .pedidoId(pedido.getId())
                    .descripcion("Material: " + calc.getPerfilNombre())
                    .build());

                transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.EGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.ENERGIA)
                    .monto(calc.getCostoEnergia() * item.getCantidad() * -1)
                    .pedidoId(pedido.getId())
                    .descripcion("Energía: " + calc.getPerfilNombre())
                    .build());
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
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
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
        dto.setItems(pedido.getItems().stream().map(item -> {
            ItemPedidoResponseDTO itemDto = new ItemPedidoResponseDTO();
            itemDto.setId(item.getId().toString());
            itemDto.setCantidad(item.getCantidad());
            itemDto.setCantidadMerma(item.getCantidadMerma());
            
            if (item.getProducto() != null) {
                itemDto.setProductoId(item.getProducto().getId().toString());
                itemDto.setProductoNombre(item.getProducto().getNombre());
                itemDto.setPerfilNombre(item.getProducto().getNombre());
            } else if (item.getCalculo() != null) {
                itemDto.setCalculoId(item.getCalculo().getId().toString());
                itemDto.setPerfilNombre(item.getCalculo() != null ? item.getCalculo().getPerfilNombre() : "Cotización");
            }
            
            itemDto.setSubtotal(item.getSubtotal());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
