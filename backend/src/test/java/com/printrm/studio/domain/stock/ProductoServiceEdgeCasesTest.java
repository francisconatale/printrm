package com.printrm.studio.domain.stock;

import com.printrm.studio.utils.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("ProductoService — Edge Cases de Stock")
class ProductoServiceEdgeCasesTest {

    @Autowired private ProductoService productoService;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private LoteRepository loteRepository;
    @Autowired private TestDataFactory testDataFactory;

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = testDataFactory.crearProductoVacio(500.0);
    }

    @Nested
    @DisplayName("Consumo de stock")
    class StockConsumptionEdgeCases {

        @Test
        @DisplayName("LANZAR: consumir más stock del disponible lanza RuntimeException")
        void consumirMasQueDisponible_lanzaExcepcion() {
            productoService.addStock(producto.getId(), 3, 100.0);
            assertThrows(RuntimeException.class, () ->
                productoService.updateStock(producto.getId().toString(), -10));
        }

        @Test
        @DisplayName("OK: consumir exactamente todo el stock disponible funciona")
        void consumirTodoElStock_funciona() {
            productoService.addStock(producto.getId(), 5, 100.0);
            assertDoesNotThrow(() ->
                productoService.updateStock(producto.getId().toString(), -5));
            Producto actualizado = productoRepository.findById(producto.getId()).orElseThrow();
            assertEquals(0, actualizado.getCantidadStock());
        }

        @Test
        @DisplayName("OK: updateStock con delta = 0 no modifica stock")
        void updateStockConDeltaCero_noModificaStock() {
            productoService.addStock(producto.getId(), 10, 100.0);
            productoService.updateStock(producto.getId().toString(), 0);
            Producto actualizado = productoRepository.findById(producto.getId()).orElseThrow();
            assertEquals(10, actualizado.getCantidadStock());
        }

        @Test
        @DisplayName("LANZAR: updateStock con ID inexistente lanza ResourceNotFoundException")
        void updateStock_idInexistente_lanzaExcepcion() {
            String idFalso = UUID.randomUUID().toString();
            assertThrows(com.printrm.studio.exception.ResourceNotFoundException.class, () ->
                productoService.updateStock(idFalso, 10));
        }
    }

    @Nested
    @DisplayName("Adición de stock")
    class AddStockEdgeCases {

        @Test
        @DisplayName("OK: addStock con cantidad cero no modifica el stock")
        void addStock_cantidadCero_noModifica() {
            productoService.addStock(producto.getId(), 0, 100.0);
            Producto actualizado = productoRepository.findById(producto.getId()).orElseThrow();
            assertEquals(0, actualizado.getCantidadStock());
        }

        @Test
        @DisplayName("LANZAR: addStock con producto inexistente lanza ResourceNotFoundException")
        void addStock_productoInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(com.printrm.studio.exception.ResourceNotFoundException.class, () ->
                productoService.addStock(idFalso, 5, 100.0));
        }

        @Test
        @DisplayName("OK: addStock con costo diferente crea nuevo lote (no merge)")
        void addStock_costoDiferente_creaNuevoLote() {
            productoService.addStock(producto.getId(), 5, 100.0);
            productoService.addStock(producto.getId(), 3, 200.0);
            long lotes = loteRepository.findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(
                producto.getId(), 0).size();
            assertEquals(2, lotes);
        }

        @Test
        @DisplayName("OK: addStock con mismo costo hace merge en el mismo lote")
        void addStock_mismoCosto_fusionaLotes() {
            productoService.addStock(producto.getId(), 5, 100.0);
            productoService.addStock(producto.getId(), 3, 100.0);
            long lotes = loteRepository.findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(
                producto.getId(), 0).size();
            assertEquals(1, lotes);
        }
    }

    @Nested
    @DisplayName("FIFO — orden de consumo")
    class FIFOEdgeCases {

        @Test
        @DisplayName("OK: FIFO consume del lote más antiguo primero")
        void fifo_consumeLoteMasAntiguoPrimero() throws InterruptedException {
            productoService.addStock(producto.getId(), 10, 100.0);
            Thread.sleep(10);
            productoService.addStock(producto.getId(), 5, 200.0);

            productoService.updateStock(producto.getId().toString(), -8);

            var lotes = loteRepository.findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(
                producto.getId(), 0);
            assertEquals(2, lotes.size());
            assertEquals(2, lotes.get(0).getCantidadActual());
            assertEquals(5, lotes.get(1).getCantidadActual());
        }

        @Test
        @DisplayName("OK: FIFO consume lote entero y pasa al siguiente")
        void fifo_consumeLoteCompleto_yPasaAlSiguiente() throws InterruptedException {
            productoService.addStock(producto.getId(), 3, 100.0);
            Thread.sleep(10);
            productoService.addStock(producto.getId(), 5, 200.0);

            productoService.updateStock(producto.getId().toString(), -3);

            var lotes = loteRepository.findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(
                producto.getId(), 0);
            assertEquals(1, lotes.size());
            assertEquals(5, lotes.get(0).getCantidadActual());
            assertEquals(200.0, lotes.get(0).getCostoUnitario());
        }
    }

    @Nested
    @DisplayName("Transacciones en fabricación")
    class ManufacturingTransactionEdgeCases {

        @Test
        @DisplayName("OK: addStock con pedidoId nulo no lanza")
        void addStock_conPedidoIdNulo_noLanza() {
            assertDoesNotThrow(() ->
                productoService.addStock(producto.getId(), 5, 100.0, null));
        }

        @Test
        @DisplayName("OK: delete producto inexistente no lanza (deleteById de JPA es silencioso)")
        void deleteProductoInexistente_noLanza() {
            String idFalso = UUID.randomUUID().toString();
            assertDoesNotThrow(() ->
                productoService.delete(idFalso));
        }
    }
}
