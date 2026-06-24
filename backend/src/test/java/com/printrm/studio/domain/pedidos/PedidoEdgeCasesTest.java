package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
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
@DisplayName("PedidoService — Edge Cases")
class PedidoEdgeCasesTest {

    @Autowired private PedidoService pedidoService;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private TransaccionRepository transaccionRepository;
    @Autowired private TestDataFactory testDataFactory;
    @Autowired private ProductoService productoService;

    private Cliente cliente;
    private Producto producto;
    private Producto productoSinStock;

    @BeforeEach
    void setUp() {
        transaccionRepository.deleteAll();
        cliente = clienteRepository.save(Cliente.builder().nombre("Cliente Edge").build());
        producto = testDataFactory.crearProductoVacio(500.0);
        productoService.addStock(producto.getId(), 5, 0.0);
        productoSinStock = testDataFactory.crearProductoVacio(300.0);
    }

    private PedidoResponseDTO crearPedidoBase() {
        PedidoRequestDTO request = new PedidoRequestDTO(
            cliente.getId(),
            List.of(new ItemPedidoRequestDTO(producto.getId(), 2))
        );
        return pedidoService.crearPedido(request);
    }

    private void entregarPedido(PedidoResponseDTO pedido) {
        pedidoService.cambiarEstado(pedido.getId(), "CONFIRMADO");
        pedidoService.cambiarEstado(pedido.getId(), "EN_PRODUCCION");
        pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");
    }

    @Nested
    @DisplayName("Transiciones de estado inválidas")
    class InvalidStateTransitions {

        @Test
        @DisplayName("LANZAR: CONFIRMADO -> COTIZADO (retroceso) debe fallar")
        void noSePuedeVolverACotizado_desdeCONFIRMADO() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.cambiarEstado(pedido.getId(), "COTIZADO");
            pedidoService.cambiarEstado(pedido.getId(), "CONFIRMADO");
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "COTIZADO"));
        }

        @Test
        @DisplayName("LANZAR: CANCELADO no puede cambiar a ningún estado")
        void cancelado_noPuedeCambiarEstado() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.cambiarEstado(pedido.getId(), "CANCELADO");
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "COTIZADO"));
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "CONFIRMADO"));
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO"));
        }

        @Test
        @DisplayName("LANZAR: DEVUELTO no puede cambiar a ningún estado")
        void devuelto_noPuedeCambiarEstado() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.cambiarEstado(pedido.getId(), "COTIZADO");
            pedidoService.cambiarEstado(pedido.getId(), "CONFIRMADO");
            pedidoService.cambiarEstado(pedido.getId(), "EN_PRODUCCION");
            pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");
            pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "COTIZADO"));
        }

        @Test
        @DisplayName("LANZAR: doble ENTREGADO lanza excepción")
        void dobleEntrega_lanzaExcepcion() {
            PedidoResponseDTO pedido = crearPedidoBase();
            entregarPedido(pedido);
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO"));
        }

        @Test
        @DisplayName("LANZAR: doble DEVUELTO lanza excepción")
        void dobleDevolucion_lanzaExcepcion() {
            PedidoResponseDTO pedido = crearPedidoBase();
            entregarPedido(pedido);
            pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO"));
        }

        @Test
        @DisplayName("LANZAR: estado inválido como string lanza IllegalArgumentException")
        void estadoStringInvalido_lanzaExcepcion() {
            PedidoResponseDTO pedido = crearPedidoBase();
            assertThrows(IllegalArgumentException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "INEXISTENTE"));
        }

        @Test
        @DisplayName("LANZAR: cambiar a BORRADOR desde COTIZADO lanza excepción")
        void noSePuedeVolverABorrador() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.cambiarEstado(pedido.getId(), "COTIZADO");
            assertThrows(IllegalStateException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "BORRADOR"));
        }
    }

    @Nested
    @DisplayName("Pagos y montos")
    class PaymentEdgeCases {

        @Test
        @DisplayName("OK: registrar pago parcial funciona correctamente")
        void pagoParcial_acumulaMontoPagado() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.registrarPago(pedido.getId(), 200.0, "Seña");
            PedidoResponseDTO actualizado = pedidoService.getPedido(pedido.getId());
            assertEquals(200.0, actualizado.getMontoPagado());
            assertTrue(actualizado.getSaldoPendiente() > 0);
        }

        @Test
        @DisplayName("OK: múltiples pagos parciales se acumulan correctamente")
        void multiplesPagosParciales_seAcumulan() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.registrarPago(pedido.getId(), 100.0, "Pago 1");
            pedidoService.registrarPago(pedido.getId(), 200.0, "Pago 2");
            pedidoService.registrarPago(pedido.getId(), 150.0, "Pago 3");
            PedidoResponseDTO actualizado = pedidoService.getPedido(pedido.getId());
            assertEquals(450.0, actualizado.getMontoPagado());
        }

        @Test
        @DisplayName("LANZAR: registrar pago en pedido cancelado no lanza (solo persiste el pago)")
        void pagoEnPedidoCancelado_persisteMonto() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.cambiarEstado(pedido.getId(), "CANCELADO");
            assertDoesNotThrow(() ->
                pedidoService.registrarPago(pedido.getId(), 100.0, "Pago post-cancelacion"));
            PedidoResponseDTO actualizado = pedidoService.getPedido(pedido.getId());
            assertEquals(100.0, actualizado.getMontoPagado());
        }

        @Test
        @DisplayName("LANZAR: getPedido con UUID inexistente lanza ResourceNotFoundException")
        void getPedido_idInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(com.printrm.studio.exception.ResourceNotFoundException.class, () ->
                pedidoService.getPedido(idFalso.toString()));
        }
    }

    @Nested
    @DisplayName("Stock y entregas")
    class StockAndDeliveryEdgeCases {

        @Test
        @DisplayName("LANZAR: entregar pedido con stock insuficiente lanza RuntimeException")
        void entregaConStockInsuficiente_lanzaExcepcion() {
            PedidoRequestDTO request = new PedidoRequestDTO(
                cliente.getId(),
                List.of(new ItemPedidoRequestDTO(productoSinStock.getId(), 10))
            );
            PedidoResponseDTO pedido = pedidoService.crearPedido(request);
            pedidoService.cambiarEstado(pedido.getId(), "COTIZADO");
            pedidoService.cambiarEstado(pedido.getId(), "CONFIRMADO");
            pedidoService.cambiarEstado(pedido.getId(), "EN_PRODUCCION");
            assertThrows(RuntimeException.class, () ->
                pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO"));
        }

        @Test
        @DisplayName("LANZAR: actualizar cantidad de ítem inexistente lanza ResourceNotFoundException")
        void actualizarItemInexistente_lanzaExcepcion() {
            String pedidoStr = crearPedidoBase().getId();
            UUID pedidoId = UUID.fromString(pedidoStr);
            UUID itemFalso = UUID.randomUUID();
            assertThrows(com.printrm.studio.exception.ResourceNotFoundException.class, () ->
                pedidoService.actualizarCantidadItem(pedidoId, itemFalso, 5));
        }

        @Test
        @DisplayName("OK: pedido sin cliente (consumidor final) se crea correctamente")
        void pedidoSinCliente_seCreaComoConsumidorFinal() {
            PedidoRequestDTO request = new PedidoRequestDTO(
                null,
                List.of(new ItemPedidoRequestDTO(producto.getId(), 1))
            );
            PedidoResponseDTO pedido = pedidoService.crearPedido(request);
            assertNotNull(pedido.getId());
            assertEquals("Consumidor Final", pedido.getClienteNombre());
        }
    }

    @Nested
    @DisplayName("Devolución y reembolso")
    class ReturnAndRefundEdgeCases {

        @Test
        @DisplayName("OK: devolución genera REEMBOLSO y restaura stock")
        void devolucion_restauraStock_yGeneraReembolso() {
            PedidoResponseDTO pedido = crearPedidoBase();
            entregarPedido(pedido);
            int stockAntes = productoService.getAll().stream()
                .filter(p -> p.getId().equals(producto.getId().toString()))
                .findFirst().get().getCantidadStock();

            pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");

            int stockDespues = productoService.getAll().stream()
                .filter(p -> p.getId().equals(producto.getId().toString()))
                .findFirst().get().getCantidadStock();
            assertEquals(stockAntes + 2, stockDespues);

            List<Transaccion> reembolsos = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.REEMBOLSO);
            assertFalse(reembolsos.isEmpty());
        }

        @Test
        @DisplayName("OK: solo se genera un REEMBOLSO aunque se llame a procesarDevolucion una vez")
        void devolucion_generaUnSoloReembolso() {
            PedidoResponseDTO pedido = crearPedidoBase();
            pedidoService.registrarPago(pedido.getId(), 100.0, "Seña");
            entregarPedido(pedido);
            pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");

            List<Transaccion> reembolsos = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.REEMBOLSO);
            assertEquals(1, reembolsos.size(), "Debe haber exactamente 1 REEMBOLSO");
        }
    }

    @Nested
    @DisplayName("Merma en items")
    class MermaEdgeCases {

        @Test
        @DisplayName("OK: registrar merma en ítem sin producto (consumidor final) no lanza")
        void mermaEnItemSinProducto_noLanza() {
            PedidoRequestDTO request = new PedidoRequestDTO(
                cliente.getId(),
                List.of(new ItemPedidoRequestDTO(null, 1))
            );
            PedidoResponseDTO pedido = pedidoService.crearPedido(request);
            String pedidoId = pedido.getId();
            String itemId = pedido.getItems().get(0).getId();
            assertDoesNotThrow(() ->
                pedidoService.registrarMerma(pedidoId, itemId, 1));
        }
    }
}
