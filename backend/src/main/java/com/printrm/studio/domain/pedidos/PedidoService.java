package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.calculo.Calculo;
import com.printrm.studio.domain.calculo.CalculoRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
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
                Calculo calculo = calculoRepository.findById(itemDto.getCalculoId())
                        .orElseThrow(() -> new RuntimeException("Cálculo no encontrado: " + itemDto.getCalculoId()));
                
                ItemPedido item = ItemPedido.builder()
                        .pedido(savedPedido)
                        .calculo(calculo)
                        .cantidad(itemDto.getCantidad())
                        .cantidadMerma(0)
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

    @Transactional
    public PedidoResponseDTO actualizarCantidadItem(String pedidoId, String itemId, Integer cantidad) {
        return actualizarCantidadItem(UUID.fromString(pedidoId), UUID.fromString(itemId), cantidad);
    }

    @Transactional
    public void cambiarEstado(String pedidoId, String nuevoEstado) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado));

        if ("ENTREGADO".equals(nuevoEstado)) {
            registrarIngresoPorVenta(pedido);
        } else if ("DEVUELTO".equals(nuevoEstado)) {
            registrarReembolso(pedido);
        } else if ("EN_PRODUCCION".equals(nuevoEstado)) {
            registrarGastoProduccion(pedido);
        }
        
        repository.save(pedido);
    }

    @Transactional
    public void registrarMerma(String pedidoId, String itemId, Integer unidadesFallidas) {
        Pedido pedido = repository.findById(UUID.fromString(pedidoId))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        ItemPedido item = itemRepository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado"));

        item.setCantidadMerma(item.getCantidadMerma() + unidadesFallidas);
        itemRepository.save(item);

        // Lógica de No Doble Descuento:
        // Buscamos si ya existe el gasto de producción para este pedido.
        List<Transaccion> egresos = transaccionRepository.findAllByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.EGRESO);
        
        if (!egresos.isEmpty()) {
            // Reclasificamos estadísticamente:
            // Tomamos una parte del monto de los egresos actuales y los movemos a la categoría MERMA
            Calculo calc = item.getCalculo();
            double costoPorUnidad = calc.getCostoEnergia() + calc.getCostoFilamento();
            double montoAReclasificar = costoPorUnidad * unidadesFallidas;

            // Para simplificar, creamos una transacción de ajuste que NO cambia el balance total
            // Ajuste 1: Restamos del gasto de material (ponemos un positivo para compensar el negativo)
            transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.EGRESO)
                .categoria(Transaccion.CategoriaTransaccion.MATERIAL)
                .monto(montoAReclasificar) 
                .pedidoId(pedido.getId())
                .descripcion("Reclasificación por Merma (Ajuste Material)")
                .build());

            // Ajuste 2: Sumamos a la categoría MERMA (ponemos el negativo real)
            transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.EGRESO)
                .categoria(Transaccion.CategoriaTransaccion.MERMA)
                .monto(montoAReclasificar * -1)
                .pedidoId(pedido.getId())
                .descripcion("Estadística Merma: " + unidadesFallidas + " unidades de " + calc.getPerfilNombre())
                .build());
            
            // El balance total sigue igual: (+X) + (-X) = 0 cambio neto.
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

    private void registrarIngresoPorVenta(Pedido pedido) {
        double saldoPendiente = pedido.getTotal() - pedido.getMontoPagado();
        if (saldoPendiente > 0) {
            registrarPago(pedido.getId().toString(), saldoPendiente, "Cobro de saldo restante al entregar");
        }
    }

    private void registrarReembolso(Pedido pedido) {
        boolean yaRegistrado = transaccionRepository.existsByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.REEMBOLSO);
        if (yaRegistrado) return;

        transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                .monto(pedido.getTotal() * -1)
                .pedidoId(pedido.getId())
                .descripcion("Reembolso por devolución")
                .build());
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
            itemDto.setSubtotal(item.getSubtotal());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
