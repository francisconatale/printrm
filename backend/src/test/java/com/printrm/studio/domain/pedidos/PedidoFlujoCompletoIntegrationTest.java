package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;
import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.perfil.FilamentProfile;
import com.printrm.studio.domain.perfil.FilamentProfileRepository;
import com.printrm.studio.domain.perfil.Perfil;
import com.printrm.studio.domain.perfil.PerfilRepository;
import com.printrm.studio.domain.produccion.OrdenProduccion;
import com.printrm.studio.domain.produccion.OrdenProduccionService;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
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
@DisplayName("Pedido & Producción — Full Flow Integration Tests")
public class PedidoFlujoCompletoIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private OrdenProduccionService ordenProduccionService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PiezaSTLRepository piezaSTLRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private FilamentProfileRepository filamentProfileRepository;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private AjustesService ajustesService;

    private Perfil printer;
    private FilamentProfile filament;
    private PiezaSTL pieza;
    private Producto producto;
    private Cliente cliente;

    @BeforeEach
    public void setUp() {
        // Initialize default adjustments
        ajustesService.initDefaultAjustes();
        AjustesDTO ajustes = ajustesService.getAjustes();
        ajustes.setPreciokWh(50.0);
        ajustesService.updateAjustes(ajustes);

        // Create printer profile
        printer = Perfil.builder()
                .nombre("Printer Test Flow")
                .consumoW(200.0)
                .filamentoPorKg(0.0)
                .build();
        printer = perfilRepository.save(printer);

        // Create filament profile
        filament = FilamentProfile.builder()
                .nombre("Filament Test Flow")
                .material("PLA")
                .filamentoPorKg(2000.0)
                .build();
        filament = filamentProfileRepository.save(filament);

        // Create PiezaSTL: 100g, 2h 30m estimated print time
        pieza = PiezaSTL.builder()
                .nombre("Pieza Test Flow")
                .filePath("pieza_test_flow.stl")
                .pesoGramos(100.0)
                .tiempoEstimado("2h 30m")
                .perfilPreferido(printer)
                .filamentoPreferido(filament)
                .costoBase(0.0)
                .build();
        pieza = piezaSTLRepository.save(pieza);

        // Create Producto referencing the PiezaSTL
        producto = Producto.builder()
                .nombre("Producto Test Flow")
                .partes(new ArrayList<>(List.of(pieza)))
                .precioSugerido(500.0)
                .cantidadStock(0)
                .build();
        producto = productoRepository.save(producto);

        // Create Cliente
        cliente = Cliente.builder()
                .nombre("Cliente Test Flow")
                .build();
        cliente = clienteRepository.save(cliente);
    }

    @Test
    @DisplayName("Debe calcular dinámicamente faltantes del pedido considerando stock y producción")
    public void testCalculoDinamicoDeFaltantes() {
        // 1. Crear Pedido por 5 unidades. Stock inicial = 0.
        PedidoRequestDTO request = new PedidoRequestDTO();
        request.setClienteId(cliente.getId());
        request.setItems(List.of(new ItemPedidoRequestDTO(producto.getId(), 5)));

        PedidoResponseDTO pedido = pedidoService.crearPedido(request);
        UUID itemId = UUID.fromString(pedido.getItems().get(0).getId());

        // Al inicio: Solicitadas 5, Stock 0, Faltante 5
        assertEquals(5, pedido.getItems().get(0).getCantidadFaltante());

        // 2. Crear una orden de producción vinculada por 3 unidades.
        OrdenProduccion orden = ordenProduccionService.crearOrdenVinculada(itemId, 3);

        // Ahora: Solicitadas 5, Stock 0, En Producción 3, Faltante 2
        pedido = pedidoService.getPedido(pedido.getId());
        assertEquals(2, pedido.getItems().get(0).getCantidadFaltante());

        // 3. Completar la orden de producción.
        orden = ordenProduccionService.cambiarEstado(orden.getId(), "COMPLETADO");

        // Al completarse la orden: Stock aumenta en 3.
        // Ahora: Solicitadas 5, Stock 3, En Producción 0, Completadas 3, Faltante 2
        pedido = pedidoService.getPedido(pedido.getId());
        assertEquals(2, pedido.getItems().get(0).getCantidadFaltante());
        assertEquals(3, pedido.getItems().get(0).getStockDisponible());
    }

    @Test
    @DisplayName("Flujo Completo: Crear pedido -> Ver faltante -> Mandar a fabricar -> Completar orden -> Entregar -> Verificar Ventas y Finanzas")
    public void testFlujoCompletoDePedidosYFabricacion() {
        // 1. Crear Pedido por 2 unidades
        PedidoRequestDTO request = new PedidoRequestDTO();
        request.setClienteId(cliente.getId());
        request.setItems(List.of(new ItemPedidoRequestDTO(producto.getId(), 2)));

        PedidoResponseDTO pedido = pedidoService.crearPedido(request);
        UUID itemId = UUID.fromString(pedido.getItems().get(0).getId());

        // Verificar faltante inicial (2 unidades)
        assertEquals(2, pedido.getItems().get(0).getCantidadFaltante());
        assertEquals(0, pedido.getItems().get(0).getStockDisponible());

        // Intentar entregar pedido sin stock debe lanzar excepción
        assertThrows(RuntimeException.class, () -> {
            pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");
        });

        // 2. Mandar a fabricar: Crear orden vinculada por las 2 unidades faltantes
        OrdenProduccion orden = ordenProduccionService.crearOrdenVinculada(itemId, 2);
        assertNotNull(orden);
        assertEquals(2, orden.getCantidad());
        assertEquals(OrdenProduccion.EstadoProduccion.COLA, orden.getEstado());

        // 3. Completar orden de producción
        orden = ordenProduccionService.cambiarEstado(orden.getId(), "COMPLETADO");
        assertEquals(OrdenProduccion.EstadoProduccion.COMPLETADO, orden.getEstado());

        // Verificar alta en stock (2 unidades) y registro de egresos por fabricación (Interna)
        // 1 unidad: 2.5h * 200W = 0.5kWh * $50 = $25 energía, 100g * $2/g = $200 filamento
        // 2 unidades: $50 energía, $400 filamento. Egresos: -50.0 y -400.0
        Producto productoActualizado = productoRepository.findById(producto.getId()).orElse(null);
        assertNotNull(productoActualizado);
        assertEquals(2, productoActualizado.getCantidadStock());

        List<Transaccion> egresos = transaccionRepository.findAll().stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO)
                .toList();
        
        Transaccion tMaterial = egresos.stream()
                .filter(t -> t.getCategoria() == Transaccion.CategoriaTransaccion.MATERIAL)
                .findFirst().orElse(null);
        Transaccion tEnergia = egresos.stream()
                .filter(t -> t.getCategoria() == Transaccion.CategoriaTransaccion.ENERGIA)
                .findFirst().orElse(null);

        assertNotNull(tMaterial);
        assertEquals(-400.0, tMaterial.getMonto(), 0.001);
        assertNotNull(tEnergia);
        assertEquals(-50.0, tEnergia.getMonto(), 0.001);

        // 4. Entregar el pedido
        pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");

        // Verificar que el estado del pedido es ENTREGADO
        PedidoResponseDTO pedidoEntregado = pedidoService.getPedido(pedido.getId());
        assertEquals("ENTREGADO", pedidoEntregado.getEstado());

        // Verificar consumo de stock (2 - 2 = 0)
        Producto productoPostEntrega = productoRepository.findById(producto.getId()).orElse(null);
        assertNotNull(productoPostEntrega);
        assertEquals(0, productoPostEntrega.getCantidadStock());

        // Verificar registro de ingreso por venta (2 unidades * 500 = $1000)
        List<Transaccion> ingresos = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.INGRESO);
        Transaccion ingresoVenta = ingresos.stream()
                .filter(t -> t.getCategoria() == Transaccion.CategoriaTransaccion.VENTA 
                        && t.getPedidoId() != null 
                        && t.getPedidoId().equals(UUID.fromString(pedido.getId())))
                .findFirst().orElse(null);

        assertNotNull(ingresoVenta);
        assertEquals(1000.0, ingresoVenta.getMonto(), 0.001);
    }
}
