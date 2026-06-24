package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final ProductoService productoService;
    private final TransaccionRepository transaccionRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public void registrarVenta(UUID productoId, int cantidad, double precioUnitario, UUID pedidoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        // 1. Consume las piezas físicamente del stock
        registrarConsumoStock(productoId, cantidad);

        // 2. Registra el ingreso contable en finanzas si el precio es mayor a 0
        if (precioUnitario > 0.0) {
            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.INGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(precioUnitario * cantidad)
                    .pedidoId(pedidoId)
                    .descripcion("Venta de " + cantidad + " unidades de " + producto.getNombre())
                    .build());
        }
    }

    @Transactional
    public void registrarConsumoStock(UUID productoId, int cantidad) {
        productoService.updateStock(productoId.toString(), -cantidad);
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

    @Transactional
    public void registrarReembolso(Pedido pedido) {
        boolean yaRegistrado = transaccionRepository.existsByPedidoIdAndTipo(pedido.getId(), Transaccion.TipoTransaccion.REEMBOLSO);
        if (yaRegistrado) return;

        if (pedido.getMontoPagado() > 0) {
            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.REEMBOLSO)
                    .categoria(Transaccion.CategoriaTransaccion.VENTA)
                    .monto(-pedido.getMontoPagado())
                    .pedidoId(pedido.getId())
                    .descripcion("Reembolso por pedido cancelado/devuelto")
                    .build());
        }
    }
}
