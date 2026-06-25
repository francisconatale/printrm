package com.printly.studio.domain.produccion;

import com.printly.studio.domain.biblioteca.PiezaSTL;
import com.printly.studio.domain.biblioteca.PiezaSTLRepository;
import com.printly.studio.domain.finanzas.Transaccion;
import com.printly.studio.domain.finanzas.TransaccionRepository;
import com.printly.studio.domain.pedidos.*;
import com.printly.studio.domain.perfil.FilamentProfile;
import com.printly.studio.domain.perfil.FilamentProfileRepository;
import com.printly.studio.domain.stock.Producto;
import com.printly.studio.domain.stock.ProductoRepository;
import com.printly.studio.utils.TestDataFactory;
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
@DisplayName("OrdenProduccionService — Edge Cases")
class OrdenProduccionEdgeCasesTest {

    @Autowired private OrdenProduccionService ordenService;
    @Autowired private OrdenProduccionRepository ordenRepository;
    @Autowired private PedidoService pedidoService;
    @Autowired private ItemPedidoRepository itemPedidoRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private FilamentProfileRepository filamentProfileRepository;
    @Autowired private PiezaSTLRepository piezaSTLRepository;
    @Autowired private TransaccionRepository transaccionRepository;
    @Autowired private TestDataFactory testDataFactory;

    private Producto producto;
    private UUID itemPedidoId;
    private OrdenProduccion ordenVinculada;

    @BeforeEach
    void setUp() {
        transaccionRepository.deleteAll();
        FilamentProfile filament = testDataFactory.crearFilamentoPLA();
        PiezaSTL pieza = testDataFactory.crearPiezaBase(filament);
        producto = testDataFactory.crearProductoSimple(pieza);

        PedidoRequestDTO request = new PedidoRequestDTO(
            null,
            List.of(new ItemPedidoRequestDTO(producto.getId(), 3))
        );
        PedidoResponseDTO pedido = pedidoService.crearPedido(request);
        itemPedidoId = UUID.fromString(pedido.getItems().get(0).getId());

        ordenVinculada = ordenService.crearOrdenVinculada(itemPedidoId, 2);
    }

    @Nested
    @DisplayName("Transiciones de estado inválidas")
    class InvalidStateTransitions {

        @Test
        @DisplayName("LANZAR: cambiar estado de orden inexistente lanza RuntimeException")
        void cambiarEstado_ordenInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(RuntimeException.class, () ->
                ordenService.cambiarEstado(idFalso, "COMPLETADO"));
        }

        @Test
        @DisplayName("LANZAR: estado inexistente como String lanza IllegalArgumentException")
        void cambiarEstado_estadoInvalido_lanzaExcepcion() {
            assertThrows(IllegalArgumentException.class, () ->
                ordenService.cambiarEstado(ordenVinculada.getId(), "ESTADO_INEXISTENTE"));
        }

        @Test
        @DisplayName("LANZAR: estado en minúsculas también funciona (case insensitive)")
        void cambiarEstado_minusculas_funciona() {
            assertDoesNotThrow(() ->
                ordenService.cambiarEstado(ordenVinculada.getId(), "completado"));
        }
    }

    @Nested
    @DisplayName("Merma en órdenes")
    class MermaEdgeCases {

        @Test
        @DisplayName("OK: merma parcial reduce la cantidad de la orden")
        void mermaParcial_reduceCantidad() {
            OrdenProduccion orden = ordenService.registrarMermaParcial(ordenVinculada.getId(), 1);
            assertEquals(1, orden.getCantidad());
            assertEquals(OrdenProduccion.EstadoProduccion.COLA, orden.getEstado());
        }

        @Test
        @DisplayName("OK: merma total marca orden como MERMA y fechaFin")
        void mermaTotal_marcaComoMERMA() {
            OrdenProduccion orden = ordenService.registrarMermaParcial(ordenVinculada.getId(), 2);
            assertEquals(OrdenProduccion.EstadoProduccion.MERMA, orden.getEstado());
            assertNotNull(orden.getFechaFin());
        }

        @Test
        @DisplayName("OK: merma con unidadesFallidas > cantidad también marca MERMA")
        void merma_excedeCantidad_marcaMERMA() {
            OrdenProduccion orden = ordenService.registrarMermaParcial(ordenVinculada.getId(), 10);
            assertEquals(OrdenProduccion.EstadoProduccion.MERMA, orden.getEstado());
        }

        @Test
        @DisplayName("OK: merma con 0 unidades no modifica la orden")
        void merma_conCeroUnidades_noModifica() {
            OrdenProduccion orden = ordenService.registrarMermaParcial(ordenVinculada.getId(), 0);
            assertEquals(2, orden.getCantidad());
            assertEquals(OrdenProduccion.EstadoProduccion.COLA, orden.getEstado());
        }

        @Test
        @DisplayName("LANZAR: merma en orden inexistente lanza RuntimeException")
        void merma_ordenInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(RuntimeException.class, () ->
                ordenService.registrarMermaParcial(idFalso, 1));
        }

        @Test
        @DisplayName("OK: merma en orden sin producto (null producto) no lanza")
        void merma_ordenSinProducto_noLanza() {
            OrdenProduccion ordenSinProducto = ordenService.crearOrdenIndependiente(producto.getId(), 1);
            ordenSinProducto.setProducto(null);
            ordenRepository.save(ordenSinProducto);
            assertDoesNotThrow(() ->
                ordenService.registrarMermaParcial(ordenSinProducto.getId(), 1));
        }
    }

    @Nested
    @DisplayName("Creación de órdenes")
    class OrderCreationEdgeCases {

        @Test
        @DisplayName("LANZAR: crear orden vinculada con item inexistente lanza RuntimeException")
        void crearVinculada_itemInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(RuntimeException.class, () ->
                ordenService.crearOrdenVinculada(idFalso, 1));
        }

        @Test
        @DisplayName("LANZAR: crear orden independiente con producto inexistente lanza RuntimeException")
        void crearIndependiente_productoInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(RuntimeException.class, () ->
                ordenService.crearOrdenIndependiente(idFalso, 1));
        }

        @Test
        @DisplayName("OK: crear orden con cantidad 0 se guarda igualmente")
        void crearOrden_cantidadCero_seCrea() {
            OrdenProduccion orden = ordenService.crearOrdenVinculada(itemPedidoId, 0);
            assertNotNull(orden.getId());
            assertEquals(0, orden.getCantidad());
        }
    }

    @Nested
    @DisplayName("Finalización y transacciones")
    class CompletionEdgeCases {

        @Test
        @DisplayName("OK: completar orden genera transacciones de MATERIAL y ENERGIA")
        void completarOrden_generaTransacciones() {
            int transaccionesAntes = transaccionRepository.findAll().size();
            ordenService.cambiarEstado(ordenVinculada.getId(), "COMPLETADO");
            int transaccionesDespues = transaccionRepository.findAll().size();
            assertTrue(transaccionesDespues > transaccionesAntes,
                "Debe haber al menos una transacción nueva al completar");
        }

        @Test
        @DisplayName("OK: completar orden vincula fechaFin")
        void completarOrden_asignaFechaFin() {
            OrdenProduccion orden = ordenService.cambiarEstado(ordenVinculada.getId(), "COMPLETADO");
            assertNotNull(orden.getFechaFin());
        }

        @Test
        @DisplayName("OK: getById con ID existente devuelve la orden")
        void getById_devuelveOrden() {
            OrdenProduccion orden = ordenService.getById(ordenVinculada.getId());
            assertNotNull(orden);
            assertEquals(ordenVinculada.getId(), orden.getId());
        }

        @Test
        @DisplayName("LANZAR: getById con ID inexistente lanza RuntimeException")
        void getById_idInexistente_lanzaExcepcion() {
            UUID idFalso = UUID.randomUUID();
            assertThrows(RuntimeException.class, () ->
                ordenService.getById(idFalso));
        }
    }
}
