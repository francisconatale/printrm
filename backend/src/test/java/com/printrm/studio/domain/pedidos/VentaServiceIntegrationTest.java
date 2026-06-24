package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private com.printrm.studio.utils.TestDataFactory testDataFactory;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private TransaccionRepository transaccionRepository;

    private Producto producto;

    @BeforeEach
    public void setUp() {
        producto = testDataFactory.crearProductoVacio(300.0);
        
        // Add initial stock via updateStock or addStock
        productoService.addStock(producto.getId(), 10, 150.0);
    }

    @Test
    @DisplayName("Debe registrar la venta correctamente descontando stock y registrando transacción de ingreso")
    public void testRegistrarVentaExitoso() {
        UUID pedidoId = UUID.randomUUID();
        int stockInicial = productoRepository.findById(producto.getId()).get().getCantidadStock();
        assertEquals(10, stockInicial);

        ventaService.registrarVenta(producto.getId(), 3, 300.0, pedidoId);

        // Verificar stock descontado
        Producto productoActualizado = productoRepository.findById(producto.getId()).orElse(null);
        assertNotNull(productoActualizado);
        assertEquals(7, productoActualizado.getCantidadStock());

        // Verificar transacción registrada
        List<Transaccion> transacciones = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.INGRESO);
        Transaccion ventaTx = transacciones.stream()
                .filter(t -> t.getCategoria() == Transaccion.CategoriaTransaccion.VENTA 
                        && t.getPedidoId() != null 
                        && t.getPedidoId().equals(pedidoId))
                .findFirst().orElse(null);

        assertNotNull(ventaTx);
        assertEquals(900.0, ventaTx.getMonto());
        assertTrue(ventaTx.getDescripcion().contains("Producto Vacio"));
    }

    @Test
    @DisplayName("Debe fallar al registrar venta si no hay stock suficiente")
    public void testRegistrarVentaStockInsuficiente() {
        UUID pedidoId = UUID.randomUUID();
        assertThrows(RuntimeException.class, () -> {
            ventaService.registrarVenta(producto.getId(), 15, 300.0, pedidoId);
        });
    }
}
