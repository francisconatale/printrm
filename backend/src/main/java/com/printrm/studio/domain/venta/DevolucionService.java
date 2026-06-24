package com.printrm.studio.domain.venta;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.pedidos.ItemPedido;
import com.printrm.studio.domain.pedidos.ItemPedidoRepository;
import com.printrm.studio.domain.pedidos.Pedido;
import com.printrm.studio.domain.pedidos.PedidoRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DevolucionService {

    private static final String DEVOLUCION_VENTA_PREFIX = "Devolución venta directa";
    private static final String DEVOLUCION_PEDIDO_PREFIX = "Devolución pedido";

    private final ProductoService productoService;
    private final ProductoRepository productoRepository;
    private final TransaccionRepository transaccionRepository;
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;

    @Transactional
    public DevolucionResponse devolverVentaDirecta(UUID grupoId, DevolucionRequest request) {
        List<Transaccion> ventas = transaccionRepository.findByGrupoIdAndTipo(grupoId, Transaccion.TipoTransaccion.INGRESO);
        if (ventas.isEmpty()) {
            throw new RuntimeException("Esta venta no existe o ya fue eliminada (ID: " + grupoId + ")");
        }

        if (isVentaTotalmenteDevuelta(grupoId)) {
            throw new RuntimeException("Esta venta ya fue devuelta por completo. No se pueden procesar más devoluciones.");
        }

        Map<UUID, Transaccion> ventaPorProducto = ventas.stream()
                .filter(t -> t.getProductoId() != null)
                .collect(HashMap::new, (m, t) -> m.put(t.getProductoId(), t), HashMap::putAll);

        Map<UUID, Integer> yaDevuelto = calcularDevueltoPorProducto(grupoId);

        String motivo = request.getMotivo() != null ? request.getMotivo() : "Sin motivo especificado";
        double totalReembolsado = 0;
        List<DevolucionResponse.ItemDevuelto> itemsDevueltos = new ArrayList<>();

        for (DevolucionRequest.ItemDevolucion item : request.getItems()) {
            Transaccion ventaOriginal = ventaPorProducto.get(item.getProductoId());
            if (ventaOriginal == null) {
                String prodName = productoRepository.findById(item.getProductoId()).map(Producto::getNombre).orElse("Producto desconocido");
                throw new RuntimeException("El producto \"" + prodName + "\" no forma parte de esta venta");
            }

            String prodName = ventaOriginal.getDescripcion() != null && ventaOriginal.getDescripcion().contains("×")
                    ? ventaOriginal.getDescripcion().split("·")[1].split("·")[0].trim()
                    : productoRepository.findById(item.getProductoId()).map(Producto::getNombre).orElse("Producto");

            int original = ventaOriginal.getCantidad() != null ? ventaOriginal.getCantidad() : 1;
            int yaRetornado = yaDevuelto.getOrDefault(item.getProductoId(), 0);
            int disponible = original - yaRetornado;

            if (disponible <= 0) {
                throw new RuntimeException("El producto \"" + prodName + "\" ya fue devuelto por completo (" + original + "/" + original + " unidades)");
            }

            if (item.getCantidad() > disponible) {
                throw new RuntimeException("Solo podés devolver hasta " + disponible + " de " + original + " unidades de \"" + prodName + "\". Anteriormente ya se devolvieron " + yaRetornado + ".");
            }

            double precioUnitario = ventaOriginal.getPrecioUnitario() != null
                    ? ventaOriginal.getPrecioUnitario()
                    : ventaOriginal.getMonto() / original;
            double subtotal = precioUnitario * item.getCantidad();

            productoService.updateStock(item.getProductoId().toString(), item.getCantidad());

            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(-subtotal)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precioUnitario)
                    .productoId(item.getProductoId())
                    .grupoId(grupoId)
                    .descripcion("↩ Devolución: " + prodName)
                    .build());

            itemsDevueltos.add(DevolucionResponse.ItemDevuelto.builder()
                    .productoId(item.getProductoId().toString())
                    .productoNombre(prodName)
                    .cantidad(item.getCantidad())
                    .subtotal(subtotal)
                    .build());

            totalReembolsado += subtotal;
        }

        boolean ahoraTotalmenteDevuelta = isVentaTotalmenteDevuelta(grupoId);
        if (ahoraTotalmenteDevuelta) {
            for (Transaccion t : ventas) {
                t.setDevueltoTotalmente(true);
                transaccionRepository.save(t);
            }
        }
        String mensaje = ahoraTotalmenteDevuelta
                ? "Todos los productos fueron devueltos. Esta venta está completamente cerrada."
                : "Devolución parcial procesada correctamente.";

        return DevolucionResponse.builder()
                .items(itemsDevueltos)
                .totalReembolsado(totalReembolsado)
                .mensaje(mensaje)
                .build();
    }

    @Transactional
    public DevolucionResponse devolverPedido(Pedido pedido, DevolucionRequest request) {
        if (pedido.getEstado() != Pedido.EstadoPedido.ENTREGADO) {
            if (pedido.getEstado() == Pedido.EstadoPedido.DEVUELTO) {
                throw new IllegalStateException("Este pedido ya fue devuelto por completo. No se pueden procesar más devoluciones.");
            }
            throw new IllegalStateException("Solo se pueden devolver productos de pedidos entregados. Estado actual: " + pedido.getEstado());
        }

        String motivo = request.getMotivo() != null ? request.getMotivo() : "Sin motivo especificado";
        double totalReembolsado = 0;
        List<DevolucionResponse.ItemDevuelto> itemsDevueltos = new ArrayList<>();

        for (DevolucionRequest.ItemDevolucion item : request.getItems()) {
            ItemPedido itemPedido = pedido.getItems().stream()
                    .filter(i -> i.getProducto() != null && i.getProducto().getId().equals(item.getProductoId()))
                    .findFirst()
                    .orElseThrow(() -> {
                        String prodName = productoRepository.findById(item.getProductoId()).map(Producto::getNombre).orElse("Producto desconocido");
                        return new RuntimeException("El producto \"" + prodName + "\" no está incluido en este pedido");
                    });

            String prodName = itemPedido.getProducto().getNombre();
            int entregado = itemPedido.getCantidadEntregada() != null ? itemPedido.getCantidadEntregada() : 0;

            if (entregado <= 0) {
                throw new RuntimeException("El producto \"" + prodName + "\" ya fue devuelto por completo. No quedan unidades entregadas para devolver.");
            }

            if (item.getCantidad() > entregado) {
                throw new RuntimeException("Solo podés devolver hasta " + entregado + " unidades de \"" + prodName + "\". Ya se devolvieron " + (itemPedido.getCantidad() - entregado) + ".");
            }

            productoService.updateStock(item.getProductoId().toString(), item.getCantidad());

            itemPedido.setCantidadEntregada(entregado - item.getCantidad());
            itemPedidoRepository.save(itemPedido);

            double precioUnitario = itemPedido.getSubtotal() / itemPedido.getCantidad();
            double subtotal = precioUnitario * item.getCantidad();
            totalReembolsado += subtotal;

            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(-subtotal)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precioUnitario)
                    .productoId(item.getProductoId())
                    .pedidoId(pedido.getId())
                    .descripcion("↩ Devolución: " + itemPedido.getProducto().getNombre())
                    .build());

            itemsDevueltos.add(DevolucionResponse.ItemDevuelto.builder()
                    .productoId(item.getProductoId().toString())
                    .productoNombre(itemPedido.getProducto().getNombre())
                    .cantidad(item.getCantidad())
                    .subtotal(subtotal)
                    .build());
        }

        boolean todasDevueltas = pedido.getItems().stream()
                .allMatch(i -> i.getCantidadEntregada() == null || i.getCantidadEntregada() == 0);
        if (todasDevueltas) {
            pedido.setEstado(Pedido.EstadoPedido.DEVUELTO);
            pedidoRepository.save(pedido);
        }

        String mensaje = todasDevueltas
                ? "Todos los productos del pedido fueron devueltos. Pedido marcado como DEVUELTO."
                : "Devolución parcial procesada correctamente.";

        return DevolucionResponse.builder()
                .items(itemsDevueltos)
                .totalReembolsado(totalReembolsado)
                .mensaje(mensaje)
                .build();
    }

    Map<UUID, Integer> calcularDevueltoPorProducto(UUID grupoId) {
        List<Transaccion> reembolsosPrevios = transaccionRepository
                .findByGrupoIdAndTipo(grupoId, Transaccion.TipoTransaccion.REEMBOLSO);

        Map<UUID, Integer> yaDevuelto = new HashMap<>();
        for (Transaccion r : reembolsosPrevios) {
            if (r.getProductoId() != null && r.getCantidad() != null) {
                yaDevuelto.merge(r.getProductoId(), r.getCantidad(), Integer::sum);
            }
        }
        return yaDevuelto;
    }

    public boolean isVentaTotalmenteDevuelta(UUID grupoId) {
        List<Transaccion> ingresos = transaccionRepository.findByGrupoIdAndTipo(grupoId, Transaccion.TipoTransaccion.INGRESO);
        if (ingresos.isEmpty()) return false;

        Map<UUID, Integer> yaDevuelto = calcularDevueltoPorProducto(grupoId);

        return ingresos.stream().allMatch(t -> {
            if (t.getProductoId() == null) return true;
            int original = t.getCantidad() != null ? t.getCantidad() : 1;
            int devuelto = yaDevuelto.getOrDefault(t.getProductoId(), 0);
            return devuelto >= original;
        });
    }
}
