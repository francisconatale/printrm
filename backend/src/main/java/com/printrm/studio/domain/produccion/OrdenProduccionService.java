package com.printrm.studio.domain.produccion;

import com.printrm.studio.domain.pedidos.ItemPedido;
import com.printrm.studio.domain.pedidos.ItemPedidoRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
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
        }

        return repository.save(orden);
    }
}
