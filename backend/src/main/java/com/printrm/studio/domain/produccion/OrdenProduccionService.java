package com.printrm.studio.domain.produccion;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.calculo.CostCalculationResult;
import com.printrm.studio.domain.calculo.CostCalculationService;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.pedidos.ItemPedido;
import com.printrm.studio.domain.pedidos.ItemPedidoRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdenProduccionService {

    private final OrdenProduccionRepository repository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;
    private final TransaccionRepository transaccionRepository;
    private final AjustesService ajustesService;
    private final CostCalculationService costCalculationService;

    public List<OrdenProduccion> getAll() {
        return repository.findAll();
    }

    public OrdenProduccion getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de producción no encontrada: " + id));
    }

    @Transactional
    public OrdenProduccion crearOrdenVinculada(UUID itemId, Integer cantidad, String tipo, String proveedor, Double costoEstimado) {
        ItemPedido item = itemPedidoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Ítem de pedido no encontrado: " + itemId));

        OrdenProduccion.TipoProduccion tipoEnum = OrdenProduccion.TipoProduccion.valueOf(tipo.toUpperCase());
        OrdenProduccion.EstadoProduccion estadoInicial = tipoEnum == OrdenProduccion.TipoProduccion.EXTERNA 
                ? OrdenProduccion.EstadoProduccion.ENVIADO_PROVEEDOR 
                : OrdenProduccion.EstadoProduccion.COLA;

        OrdenProduccion orden = OrdenProduccion.builder()
                .itemPedido(item)
                .producto(item.getProducto())
                .cantidad(cantidad)
                .tipo(tipoEnum)
                .estado(estadoInicial)
                .proveedor(proveedor)
                .costoEstimado(costoEstimado != null ? costoEstimado : 0.0)
                .build();

        return repository.save(orden);
    }

    @Transactional
    public OrdenProduccion crearOrdenIndependiente(UUID productoId, Integer cantidad, String tipo, String proveedor, Double costoEstimado) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        OrdenProduccion.TipoProduccion tipoEnum = OrdenProduccion.TipoProduccion.valueOf(tipo.toUpperCase());
        OrdenProduccion.EstadoProduccion estadoInicial = tipoEnum == OrdenProduccion.TipoProduccion.EXTERNA 
                ? OrdenProduccion.EstadoProduccion.ENVIADO_PROVEEDOR 
                : OrdenProduccion.EstadoProduccion.COLA;

        OrdenProduccion orden = OrdenProduccion.builder()
                .itemPedido(null)
                .producto(producto)
                .cantidad(cantidad)
                .tipo(tipoEnum)
                .estado(estadoInicial)
                .proveedor(proveedor)
                .costoEstimado(costoEstimado != null ? costoEstimado : 0.0)
                .build();

        return repository.save(orden);
    }

    @Transactional
    public OrdenProduccion cambiarEstado(UUID ordenId, String nuevoEstado) {
        OrdenProduccion orden = repository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden de producción no encontrada: " + ordenId));

        OrdenProduccion.EstadoProduccion estadoEnum = OrdenProduccion.EstadoProduccion.valueOf(nuevoEstado.toUpperCase());
        orden.setEstado(estadoEnum);

        if (estadoEnum == OrdenProduccion.EstadoProduccion.COMPLETADO || estadoEnum == OrdenProduccion.EstadoProduccion.RECIBIDO_PROVEEDOR) {
            orden.setFechaFin(LocalDateTime.now());
            procesarFinalizacionOrden(orden);
        }

        return repository.save(orden);
    }

    private void procesarFinalizacionOrden(OrdenProduccion orden) {
        Producto producto = orden.getProducto();
        
        // 1. Alta de Stock
        if (producto != null) {
            if (orden.getTipo() == OrdenProduccion.TipoProduccion.INTERNA) {
                // Para internas, updateStock con delta positivo calcula automáticamente el costo del lote
                productoService.updateStock(producto.getId().toString(), orden.getCantidad());
            } else {
                // Para externas, dividimos el costoEstimado para definir el costo del lote
                double costoUnitario = orden.getCantidad() > 0 ? (orden.getCostoEstimado() / orden.getCantidad()) : 0.0;
                productoService.addStock(producto.getId(), orden.getCantidad(), costoUnitario);
            }
        }

        // 2. Registro Contable de Egresos en Finanzas
        if (orden.getItemPedido() != null) {
            UUID pedidoId = orden.getItemPedido().getPedido().getId();
            String productoNombre = producto != null ? producto.getNombre() : "Pieza Cotizada";

            if (orden.getTipo() == OrdenProduccion.TipoProduccion.EXTERNA) {
                // Registrar el costo cobrado por el proveedor externo
                transaccionRepository.save(Transaccion.builder()
                        .tipo(Transaccion.TipoTransaccion.EGRESO)
                        .categoria(Transaccion.CategoriaTransaccion.MATERIAL)
                        .monto(-orden.getCostoEstimado())
                        .pedidoId(pedidoId)
                        .descripcion("Pago a proveedor externo " + (orden.getProveedor() != null ? orden.getProveedor() : "") 
                                + " por fabricación de " + orden.getCantidad() + " unidades de " + productoNombre)
                        .build());
            } else {
                // Registrar egresos internos estimados de filamento y energía
                double filamentoTotal = 0.0;
                double energiaTotal = 0.0;
                
                if (producto != null) {
                    AjustesDTO ajustes = ajustesService.getAjustes();
                    for (PiezaSTL pieza : producto.getPartes()) {
                        CostCalculationResult res = costCalculationService.calculate(
                                pieza.getPesoGramos(),
                                parseHours(pieza.getTiempoEstimado()),
                                parseMinutes(pieza.getTiempoEstimado()),
                                0.0,
                                pieza.getPerfilPreferido(),
                                pieza.getFilamentoPreferido(),
                                ajustes
                        );
                        filamentoTotal += res.getCostoFilamento();
                        energiaTotal += res.getCostoEnergia();
                    }
                }

                filamentoTotal *= orden.getCantidad();
                energiaTotal *= orden.getCantidad();

                if (filamentoTotal > 0) {
                    transaccionRepository.save(Transaccion.builder()
                            .tipo(Transaccion.TipoTransaccion.EGRESO)
                            .categoria(Transaccion.CategoriaTransaccion.MATERIAL)
                            .monto(-filamentoTotal)
                            .pedidoId(pedidoId)
                            .descripcion("Costo material fabricación interna: " + orden.getCantidad() + " unidades de " + productoNombre)
                            .build());
                }
                if (energiaTotal > 0) {
                    transaccionRepository.save(Transaccion.builder()
                            .tipo(Transaccion.TipoTransaccion.EGRESO)
                            .categoria(Transaccion.CategoriaTransaccion.ENERGIA)
                            .monto(-energiaTotal)
                            .pedidoId(pedidoId)
                            .descripcion("Costo energía fabricación interna: " + orden.getCantidad() + " unidades de " + productoNombre)
                            .build());
                }
            }
        }
    }

    private Integer parseHours(String time) {
        if (time == null) return 0;
        try {
            String h = time.split("h")[0].trim();
            return Integer.parseInt(h);
        } catch (Exception e) { return 0; }
    }

    private Integer parseMinutes(String time) {
        if (time == null || !time.contains("h")) return 0;
        try {
            String m = time.split("h")[1].replace("m", "").trim();
            return Integer.parseInt(m);
        } catch (Exception e) { return 0; }
    }
}
