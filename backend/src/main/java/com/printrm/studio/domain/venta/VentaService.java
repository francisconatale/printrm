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

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private static final String VENTA_DESCRIPTION_PREFIX = "Venta directa";

    private final ProductoService productoService;
    private final ProductoRepository productoRepository;
    private final TransaccionRepository transaccionRepository;
    private final DevolucionService devolucionService;

    @Transactional
    public VentaResponse registrar(VentaRequest request) {
        UUID grupoId = UUID.randomUUID();
        List<VentaResponse.ItemVentaResponse> items = procesarItems(request, grupoId);
        return buildResponse(request, grupoId, items);
    }

    public List<VentaResponse> listar(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        List<Transaccion> transacciones;
        if (fechaDesde != null && fechaHasta != null) {
            transacciones = transaccionRepository
                    .findByTipoAndCategoriaAndFechaBetweenOrderByFechaDesc(Transaccion.TipoTransaccion.INGRESO, Transaccion.CategoriaTransaccion.VENTA, fechaDesde, fechaHasta);
        } else {
            transacciones = transaccionRepository
                    .findByTipoAndCategoriaOrderByFechaDesc(Transaccion.TipoTransaccion.INGRESO, Transaccion.CategoriaTransaccion.VENTA);
        }

        Map<UUID, List<Transaccion>> agrupadas = transacciones.stream()
                .filter(t -> t.getGrupoId() != null)
                .collect(Collectors.groupingBy(Transaccion::getGrupoId, LinkedHashMap::new, Collectors.toList()));

        return agrupadas.entrySet().stream()
                .map(this::groupToVentaResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DevolucionResponse devolver(UUID grupoId, DevolucionRequest request) {
        return devolucionService.devolverVentaDirecta(grupoId, request);
    }

    @Transactional
    public void registrarReembolso(UUID pedidoId, double monto, String descripcion) {
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
        String cliente = pedido.getCliente() != null ? pedido.getCliente().getNombre() : "Consumidor Final";
        String desc = descripcion != null
                ? descripcion
                : "Pago · " + cliente;
        transaccionRepository.save(Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.INGRESO)
                .categoria(Transaccion.CategoriaTransaccion.VENTA)
                .monto(monto)
                .pedidoId(pedido.getId())
                .descripcion(desc)
                .build());
    }

    @Transactional
    public void registrarCobroSaldo(Pedido pedido) {
        double saldoPendiente = pedido.getTotal() - pedido.getMontoPagado();
        if (saldoPendiente > 0) {
            String cliente = pedido.getCliente() != null ? pedido.getCliente().getNombre() : "Consumidor Final";
            String orderRef = "Pedido #" + pedido.getId().toString().substring(0, 8).toUpperCase();
            registrarPago(pedido, saldoPendiente, "Cobro al entregar · " + orderRef + " · " + cliente);
        }
    }

    private List<VentaResponse.ItemVentaResponse> procesarItems(VentaRequest request, UUID grupoId) {
        List<VentaResponse.ItemVentaResponse> items = new ArrayList<>();
        String descBase = buildDescripcionVenta(request);

        for (VentaRequest.ItemVenta item : request.getItems()) {
            Producto producto = buscarProducto(item.getProductoId());
            validarPrecio(producto);
            validarStock(producto, item.getCantidad());

            double precioUnitario = producto.getPrecioSugerido();
            double subtotal = precioUnitario * item.getCantidad();

            productoService.updateStock(producto.getId().toString(), -item.getCantidad());
            transaccionRepository.save(crearTransaccionIngreso(producto, item.getCantidad(), precioUnitario, subtotal, grupoId, descBase));
            items.add(crearItemResponse(producto, item.getCantidad(), precioUnitario, subtotal));
        }
        return items;
    }

    private static String buildDescripcionVenta(VentaRequest request) {
        return request.getCompradorNombre() != null
                ? VENTA_DESCRIPTION_PREFIX + " - " + request.getCompradorNombre()
                : VENTA_DESCRIPTION_PREFIX;
    }

    private static VentaResponse buildResponse(VentaRequest request, UUID grupoId, List<VentaResponse.ItemVentaResponse> items) {
        VentaResponse response = new VentaResponse();
        response.setGrupoId(grupoId.toString());
        response.setTotal(items.stream().mapToDouble(VentaResponse.ItemVentaResponse::getSubtotal).sum());
        response.setCompradorNombre(request.getCompradorNombre());
        response.setCompradorEmail(request.getCompradorEmail());
        response.setFecha(java.time.LocalDateTime.now());
        response.setItems(items);
        return response;
    }

    private VentaResponse groupToVentaResponse(Map.Entry<UUID, List<Transaccion>> entry) {
        List<Transaccion> grupo = entry.getValue();
        VentaResponse vr = new VentaResponse();
        vr.setGrupoId(entry.getKey().toString());
        vr.setTotal(grupo.stream().mapToDouble(Transaccion::getMonto).sum());
        vr.setFecha(grupo.stream().map(Transaccion::getFecha).filter(Objects::nonNull).min(Comparator.naturalOrder()).orElse(null));
        vr.setItems(grupo.stream().map(this::toItemResponse).collect(Collectors.toList()));
        vr.setCompradorNombre(extraerCompradorNombre(grupo.get(0).getDescripcion()));
        vr.setDevueltoTotalmente(grupo.stream().anyMatch(Transaccion::isDevueltoTotalmente));
        return vr;
    }

    private VentaResponse.ItemVentaResponse toItemResponse(Transaccion t) {
        VentaResponse.ItemVentaResponse ir = new VentaResponse.ItemVentaResponse();
        ir.setProductoId(t.getProductoId() != null ? t.getProductoId().toString() : null);
        ir.setCantidad(t.getCantidad() != null ? t.getCantidad() : 1);
        ir.setPrecioUnitario(t.getPrecioUnitario() != null ? t.getPrecioUnitario() : t.getMonto());
        ir.setSubtotal(t.getMonto());
        return ir;
    }

    private static String extraerCompradorNombre(String descripcion) {
        if (descripcion == null || !descripcion.startsWith(VENTA_DESCRIPTION_PREFIX + " - ")) return null;
        return descripcion.substring((VENTA_DESCRIPTION_PREFIX + " - ").length());
    }

    private Producto buscarProducto(UUID id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
    }

    private static void validarPrecio(Producto producto) {
        if (producto.getPrecioSugerido() == null || producto.getPrecioSugerido() <= 0) {
            throw new RuntimeException("El producto '" + producto.getNombre() + "' no tiene precio de venta");
        }
    }

    private static void validarStock(Producto producto, int cantidadRequerida) {
        if (producto.getCantidadStock() < cantidadRequerida) {
            throw new RuntimeException("Stock insuficiente de '" + producto.getNombre()
                    + "'. Disponible: " + producto.getCantidadStock());
        }
    }

    private static Transaccion crearTransaccionIngreso(Producto producto, int cantidad, double precioUnitario,
                                                        double subtotal, UUID grupoId, String descBase) {
        return Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.INGRESO)
                .categoria(Transaccion.CategoriaTransaccion.VENTA)
                .monto(subtotal)
                .cantidad(cantidad)
                .precioUnitario(precioUnitario)
                .productoId(producto.getId())
                .grupoId(grupoId)
                .descripcion(descBase + " · " + producto.getNombre())
                .build();
    }

    private static VentaResponse.ItemVentaResponse crearItemResponse(Producto producto, int cantidad,
                                                                       double precioUnitario, double subtotal) {
        VentaResponse.ItemVentaResponse ir = new VentaResponse.ItemVentaResponse();
        ir.setProductoId(producto.getId().toString());
        ir.setProductoNombre(producto.getNombre());
        ir.setCantidad(cantidad);
        ir.setPrecioUnitario(precioUnitario);
        ir.setSubtotal(subtotal);
        return ir;
    }
}
