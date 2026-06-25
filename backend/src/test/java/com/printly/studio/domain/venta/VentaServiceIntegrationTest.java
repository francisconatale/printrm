package com.printly.studio.domain.venta;

import com.printly.studio.domain.finanzas.Transaccion;
import com.printly.studio.domain.finanzas.TransaccionRepository;
import com.printly.studio.domain.stock.Producto;
import com.printly.studio.domain.stock.ProductoRepository;
import com.printly.studio.domain.stock.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("VentaService — Integration Tests")
public class VentaServiceIntegrationTest {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private com.printly.studio.utils.TestDataFactory testDataFactory;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private TransaccionRepository transaccionRepository;

    private Producto producto;
    private UUID productoId;

    @BeforeEach
    public void setUp() {
        producto = testDataFactory.crearProductoVacio(300.0);
        productoId = producto.getId();
        productoService.addStock(producto.getId(), 10, 150.0);
    }

    @Test
    @DisplayName("Debe registrar la venta correctamente descontando stock y registrando transacción de ingreso")
    public void testRegistrarVentaExitoso() {
        int stockInicial = productoRepository.findById(productoId).get().getCantidadStock();
        assertEquals(10, stockInicial);

        VentaRequest request = new VentaRequest();
        VentaRequest.ItemVenta item = new VentaRequest.ItemVenta();
        item.setProductoId(productoId);
        item.setCantidad(3);
        request.setItems(List.of(item));

        VentaResponse response = ventaService.registrar(request);

        assertNotNull(response.getGrupoId());
        assertEquals(900.0, response.getTotal());

        Producto productoActualizado = productoRepository.findById(productoId).orElse(null);
        assertNotNull(productoActualizado);
        assertEquals(7, productoActualizado.getCantidadStock());

        List<Transaccion> transacciones = transaccionRepository.findByGrupoIdAndTipo(
                UUID.fromString(response.getGrupoId()), Transaccion.TipoTransaccion.INGRESO);
        assertEquals(1, transacciones.size());
        assertEquals(900.0, transacciones.get(0).getMonto());
    }

    @Test
    @DisplayName("Debe fallar al registrar venta si no hay stock suficiente")
    public void testRegistrarVentaStockInsuficiente() {
        VentaRequest request = new VentaRequest();
        VentaRequest.ItemVenta item = new VentaRequest.ItemVenta();
        item.setProductoId(productoId);
        item.setCantidad(15);
        request.setItems(List.of(item));

        assertThrows(RuntimeException.class, () -> {
            ventaService.registrar(request);
        });
    }
}
