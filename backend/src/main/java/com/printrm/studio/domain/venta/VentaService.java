package com.printrm.studio.domain.venta;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.pedidos.Pedido;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final ProductoService productoService;
    private final ProductoRepository productoRepository;
    private final TransaccionRepository transaccionRepository;

    @Transactional
    public VentaResponse registrar(VentaRequest request) {
        UUID grupoId = UUID.randomUUID();
        double totalGeneral = 0;
        List<VentaResponse.ItemVentaResponse> items = new ArrayList<>();

        String descBase = "Venta directa"
                + (request.getCompradorNombre() != null ? " - " + request.getCompradorNombre() : "");

        for (VentaRequest.ItemVenta item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            if (producto.getPrecioSugerido() == null || producto.getPrecioSugerido() <= 0) {
                throw new RuntimeException("El producto '" + producto.getNombre() + "' no tiene precio de venta");
            }

            if (producto.getCantidadStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente de '" + producto.getNombre()
                        + "'. Disponible: " + producto.getCantidadStock());
            }

            double precioUnitario = producto.getPrecioSugerido();
            double subtotal = precioUnitario * item.getCantidad();
            totalGeneral += subtotal;

            productoService.updateStock(producto.getId().toString(), -item.getCantidad());

            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.INGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(subtotal)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precioUnitario)
                    .productoId(producto.getId())
                    .grupoId(grupoId)
                    .descripcion(descBase + " - " + item.getCantidad() + " x " + producto.getNombre())
                    .build());

            VentaResponse.ItemVentaResponse ir = new VentaResponse.ItemVentaResponse();
            ir.setProductoId(producto.getId().toString());
            ir.setProductoNombre(producto.getNombre());
            ir.setCantidad(item.getCantidad());
            ir.setPrecioUnitario(precioUnitario);
            ir.setSubtotal(subtotal);
            items.add(ir);
        }

        VentaResponse response = new VentaResponse();
        response.setGrupoId(grupoId.toString());
        response.setTotal(totalGeneral);
        response.setCompradorNombre(request.getCompradorNombre());
        response.setCompradorEmail(request.getCompradorEmail());
        response.setFecha(java.time.LocalDateTime.now());
        response.setItems(items);
        return response;
    }

    public List<VentaResponse> listar() {
        List<Transaccion> transacciones = transaccionRepository
                .findByTipoAndCategoriaOrderByFechaDesc(
                        Transaccion.TipoTransaccion.INGRESO,
                        Transaccion.CategoriaTransaccion.VENTA);

        Map<UUID, List<Transaccion>> agrupadas = transacciones.stream()
                .filter(t -> t.getGrupoId() != null)
                .collect(Collectors.groupingBy(Transaccion::getGrupoId,
                        LinkedHashMap::new, Collectors.toList()));

        return agrupadas.entrySet().stream().map(entry -> {
            List<Transaccion> grupo = entry.getValue();
            VentaResponse vr = new VentaResponse();
            vr.setGrupoId(entry.getKey().toString());
            vr.setTotal(grupo.stream().mapToDouble(Transaccion::getMonto).sum());
            vr.setFecha(grupo.stream().map(Transaccion::getFecha)
                    .filter(Objects::nonNull).min(Comparator.naturalOrder()).orElse(null));

            vr.setItems(grupo.stream().map(t -> {
                VentaResponse.ItemVentaResponse ir = new VentaResponse.ItemVentaResponse();
                ir.setProductoId(t.getProductoId() != null ? t.getProductoId().toString() : null);
                ir.setCantidad(t.getCantidad() != null ? t.getCantidad() : 1);
                ir.setPrecioUnitario(t.getPrecioUnitario() != null ? t.getPrecioUnitario() : t.getMonto());
                ir.setSubtotal(t.getMonto());
                return ir;
            }).collect(Collectors.toList()));

            String desc = grupo.get(0).getDescripcion();
            if (desc != null && desc.contains(" - ")) {
                vr.setCompradorNombre(desc.substring(desc.indexOf(" - ") + 3));
            }

            return vr;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void devolver(String grupoIdStr, DevolucionRequest request) {
        UUID grupoId = UUID.fromString(grupoIdStr);
        List<Transaccion> ventas = transaccionRepository.findByGrupoIdAndTipo(grupoId, Transaccion.TipoTransaccion.INGRESO);

        if (ventas.isEmpty()) {
            throw new RuntimeException("No se encontró la venta con grupoId: " + grupoIdStr);
        }

        Map<UUID, Transaccion> ventaPorProducto = ventas.stream()
                .filter(t -> t.getProductoId() != null)
                .collect(Collectors.toMap(Transaccion::getProductoId, t -> t, (a, b) -> a));

        List<Transaccion> reembolsosPrevios = transaccionRepository
                .findByGrupoIdAndTipo(grupoId, Transaccion.TipoTransaccion.REEMBOLSO);

        Map<UUID, Integer> yaDevuelto = new HashMap<>();
        for (Transaccion r : reembolsosPrevios) {
            if (r.getProductoId() != null && r.getCantidad() != null) {
                yaDevuelto.merge(r.getProductoId(), r.getCantidad(), Integer::sum);
            }
        }

        double totalReembolso = 0;

        for (DevolucionRequest.ItemDevolucion item : request.getItems()) {
            Transaccion ventaOriginal = ventaPorProducto.get(item.getProductoId());
            if (ventaOriginal == null) {
                throw new RuntimeException("El producto " + item.getProductoId() + " no está en esta venta");
            }

            int original = ventaOriginal.getCantidad() != null ? ventaOriginal.getCantidad() : 1;
            int yaRetornado = yaDevuelto.getOrDefault(item.getProductoId(), 0);
            int disponible = original - yaRetornado;

            if (item.getCantidad() > disponible) {
                throw new RuntimeException(
                        "Solo puedes devolver hasta " + disponible + " unidades de este producto");
            }

            productoService.updateStock(item.getProductoId().toString(), item.getCantidad());

            double precioUnitario = ventaOriginal.getPrecioUnitario() != null
                    ? ventaOriginal.getPrecioUnitario()
                    : ventaOriginal.getMonto() / original;
            double subtotal = precioUnitario * item.getCantidad();
            totalReembolso += subtotal;

            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(-subtotal)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precioUnitario)
                    .productoId(item.getProductoId())
                    .grupoId(grupoId)
                    .descripcion("Devolución parcial - " + item.getCantidad() + " x "
                            + ventaOriginal.getDescripcion())
                    .build());
        }
    }

    @Transactional
    public void registrarReembolso(UUID pedidoId, double monto, String descripcion) {
        boolean yaRegistrado = transaccionRepository.existsByPedidoIdAndTipo(pedidoId, Transaccion.TipoTransaccion.REEMBOLSO);
        if (yaRegistrado) return;

        if (monto <= 0) return;

        transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                .categoria(Transaccion.CategoriaTransaccion.VENTA)
                .monto(-monto)
                .pedidoId(pedidoId)
                .descripcion(descripcion)
                .build());
    }

    @Transactional
    public void registrarPago(Pedido pedido, Double monto, String descripcion) {
        pedido.setMontoPagado(pedido.getMontoPagado() + monto);
        transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.INGRESO)
                .categoria(Transaccion.CategoriaTransaccion.VENTA)
                .monto(monto)
                .pedidoId(pedido.getId())
                .descripcion(descripcion != null ? descripcion : "Pago parcial / Seña")
                .build());
    }

    @Transactional
    public void registrarCobroSaldo(Pedido pedido) {
        double saldoPendiente = pedido.getTotal() - pedido.getMontoPagado();
        if (saldoPendiente > 0) {
            registrarPago(pedido, saldoPendiente, "Cobro de saldo restante al entregar");
        }
    }
}
