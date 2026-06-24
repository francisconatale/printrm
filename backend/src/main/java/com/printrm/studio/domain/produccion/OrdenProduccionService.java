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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<OrdenProduccion> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public OrdenProduccion getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de producción no encontrada: " + id));
    }

    @Transactional
    public OrdenProduccion crearOrdenVinculada(UUID itemId, Integer cantidad) {
        ItemPedido item = itemPedidoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Ítem de pedido no encontrado: " + itemId));

        OrdenProduccion orden = OrdenProduccion.builder()
                .itemPedido(item)
                .producto(item.getProducto())
                .cantidad(cantidad)
                .estado(OrdenProduccion.EstadoProduccion.COLA)
                .build();

        return repository.save(orden);
    }

    @Transactional
    public OrdenProduccion crearOrdenIndependiente(UUID productoId, Integer cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        OrdenProduccion orden = OrdenProduccion.builder()
                .itemPedido(null)
                .producto(producto)
                .cantidad(cantidad)
                .estado(OrdenProduccion.EstadoProduccion.COLA)
                .build();

        return repository.save(orden);
    }

    @Transactional
    public OrdenProduccion cambiarEstado(UUID ordenId, String nuevoEstado) {
        OrdenProduccion orden = repository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden de producción no encontrada: " + ordenId));

        OrdenProduccion.EstadoProduccion estadoEnum = OrdenProduccion.EstadoProduccion.valueOf(nuevoEstado.toUpperCase());
        orden.setEstado(estadoEnum);

        if (estadoEnum == OrdenProduccion.EstadoProduccion.COMPLETADO) {
            orden.setFechaFin(LocalDateTime.now());
            procesarFinalizacionOrden(orden);
        } else if (estadoEnum == OrdenProduccion.EstadoProduccion.MERMA) {
            orden.setFechaFin(LocalDateTime.now());
            procesarMermaOrden(orden);
        }

        return repository.save(orden);
    }

    private void procesarFinalizacionOrden(OrdenProduccion orden) {
        Producto producto = orden.getProducto();
        if (producto == null) return;

        double costoUnitario = producto.getPartes().stream()
                .mapToDouble(p -> costCalculationService.calculate(
                        p.getPesoGramos(), parseHours(p.getTiempoEstimado()),
                        parseMinutes(p.getTiempoEstimado()), 0.0,
                        p.getPerfilPreferido(), p.getFilamentoPreferido(),
                        ajustesService.getAjustes()).getCostoBase())
                .sum();
        
        // productoService.addStock ya se encarga de registrar las transacciones de MATERIAL y ENERGIA consumidas
        UUID pedidoId = orden.getItemPedido() != null ? orden.getItemPedido().getPedido().getId() : null;
        productoService.addStock(producto.getId(), orden.getCantidad(), costoUnitario, pedidoId);
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

    private void procesarMermaOrden(OrdenProduccion orden) {
        registrarMermaInterno(orden, orden.getCantidad());
    }

    @Transactional
    public OrdenProduccion registrarMermaParcial(UUID ordenId, Integer unidadesFallidas) {
        OrdenProduccion orden = repository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden de producción no encontrada: " + ordenId));

        if (unidadesFallidas <= 0) return orden;

        registrarMermaInterno(orden, unidadesFallidas);

        if (unidadesFallidas >= orden.getCantidad()) {
            orden.setEstado(OrdenProduccion.EstadoProduccion.MERMA);
            orden.setFechaFin(LocalDateTime.now());
        } else {
            orden.setCantidad(orden.getCantidad() - unidadesFallidas);
        }

        return repository.save(orden);
    }

    private void registrarMermaInterno(OrdenProduccion orden, Integer unidadesFallidas) {
        Producto producto = orden.getProducto();
        if (producto == null) return;

        UUID pedidoId = orden.getItemPedido() != null ? orden.getItemPedido().getPedido().getId() : null;
        String nombre = producto.getNombre();

        AjustesDTO ajustes = ajustesService.getAjustes();
        double filamento = 0, energia = 0;
        for (PiezaSTL pieza : producto.getPartes()) {
            CostCalculationResult r = costCalculationService.calculate(
                    pieza.getPesoGramos(), parseHours(pieza.getTiempoEstimado()),
                    parseMinutes(pieza.getTiempoEstimado()), 0.0,
                    pieza.getPerfilPreferido(), pieza.getFilamentoPreferido(), ajustes);
            filamento += r.getCostoFilamento();
            energia += r.getCostoEnergia();
        }
        filamento *= unidadesFallidas;
        energia *= unidadesFallidas;
        
        double margenError = ajustes != null && ajustes.getMargenError() != null ? ajustes.getMargenError() / 100.0 : 0.0;
        double costoTotal = (filamento + energia) * (1.0 + margenError);

        if (costoTotal > 0) {
            transaccionRepository.save(Transaccion.builder()
                    .tipo(Transaccion.TipoTransaccion.EGRESO)
                    .categoria(Transaccion.CategoriaTransaccion.MERMA)
                    .monto(-costoTotal)
                    .pedidoId(pedidoId)
                    .descripcion("Merma en producción: " + unidadesFallidas + " uds de " + nombre)
                    .build());
        }
    }
}
