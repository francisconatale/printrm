package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import com.printrm.studio.utils.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
@DisplayName("VentaService — Edge Cases")
class VentaServiceEdgeCasesTest {

    @Autowired private VentaService ventaService;
    @Autowired private ProductoService productoService;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private TransaccionRepository transaccionRepository;
    @Autowired private TestDataFactory testDataFactory;

    private Producto producto;
    private UUID pedidoId;

    @BeforeEach
    void setUp() {
        transaccionRepository.deleteAll();
        producto = testDataFactory.crearProductoVacio(500.0);
        pedidoId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("Registro de ventas")
    class VentaRegistroEdgeCases {

        @Test
        @DisplayName("OK: precioUnitario = 0 registra consumo pero NO transacción INGRESO")
        void precioCero_consumeStock_sinTransaccion() {
            productoService.addStock(producto.getId(), 5, 100.0);
            ventaService.registrarVenta(producto.getId(), 2, 0.0, pedidoId);

            Producto actualizado = productoRepository.findById(producto.getId()).orElseThrow();
            assertEquals(3, actualizado.getCantidadStock());

            List<Transaccion> ingresos = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.INGRESO);
            assertTrue(ingresos.isEmpty(), "No debe haber transacción INGRESO con precio 0");
        }

        @Test
        @DisplayName("LANZAR: registrar venta con stock insuficiente lanza RuntimeException")
        void ventaConStockInsuficiente_lanzaExcepcion() {
            assertThrows(RuntimeException.class, () ->
                ventaService.registrarVenta(producto.getId(), 10, 100.0, pedidoId));
        }

        @Test
        @DisplayName("LANZAR: registrar venta con producto inexistente lanza RuntimeException")
        void ventaProductoInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(RuntimeException.class, () ->
                ventaService.registrarVenta(idFalso, 1, 100.0, pedidoId));
        }

        @Test
        @DisplayName("OK: registrarConsumoStock descuenta stock correctamente")
        void registrarConsumoStock_descuentaStock() {
            productoService.addStock(producto.getId(), 5, 100.0);
            ventaService.registrarConsumoStock(producto.getId(), 3);
            Producto actualizado = productoRepository.findById(producto.getId()).orElseThrow();
            assertEquals(2, actualizado.getCantidadStock());
        }

        @Test
        @DisplayName("LANZAR: registrarConsumoStock con cantidad mayor al stock lanza excepción")
        void registrarConsumoStock_excesivo_lanzaExcepcion() {
            productoService.addStock(producto.getId(), 2, 100.0);
            assertThrows(RuntimeException.class, () ->
                ventaService.registrarConsumoStock(producto.getId(), 10));
        }
    }
}
