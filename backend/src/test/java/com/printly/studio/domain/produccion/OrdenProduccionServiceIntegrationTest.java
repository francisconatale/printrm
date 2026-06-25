package com.printly.studio.domain.produccion;

import com.printly.studio.domain.ajustes.AjustesDTO;
import com.printly.studio.domain.ajustes.AjustesService;
import com.printly.studio.domain.biblioteca.PiezaSTL;
import com.printly.studio.domain.biblioteca.PiezaSTLRepository;
import com.printly.studio.domain.clientes.Cliente;
import com.printly.studio.domain.clientes.ClienteRepository;
import com.printly.studio.domain.finanzas.Transaccion;
import com.printly.studio.domain.finanzas.TransaccionRepository;
import com.printly.studio.domain.pedidos.ItemPedidoRequestDTO;
import com.printly.studio.domain.pedidos.PedidoRequestDTO;
import com.printly.studio.domain.pedidos.PedidoResponseDTO;
import com.printly.studio.domain.pedidos.PedidoService;
import com.printly.studio.domain.perfil.FilamentProfile;
import com.printly.studio.domain.perfil.FilamentProfileRepository;
import com.printly.studio.domain.perfil.Perfil;
import com.printly.studio.domain.perfil.PerfilRepository;
import com.printly.studio.domain.stock.Producto;
import com.printly.studio.domain.stock.ProductoRepository;
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
@DisplayName("OrdenProduccionService — Integration Tests")
public class OrdenProduccionServiceIntegrationTest {

    @Autowired
    private OrdenProduccionService ordenProduccionService;

    @Autowired
    private PedidoService pedidoService;

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
    private com.printly.studio.domain.finanzas.TransaccionService transaccionService;

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
        ajustes.setMargenError(0.0); // Desactivar el margen de error para que las validaciones matemáticas exactas de los tests pasen
        ajustesService.updateAjustes(ajustes);

        // Create printer profile
        printer = Perfil.builder()
                .nombre("Printer Test")
                .consumoW(200.0)
                .filamentoPorKg(0.0) // override at filament profile level
                .build();
        printer = perfilRepository.save(printer);

        // Create filament profile
        filament = FilamentProfile.builder()
                .nombre("Filament Test")
                .material("PLA")
                .filamentoPorKg(2000.0)
                .build();
        filament = filamentProfileRepository.save(filament);

        // Create PiezaSTL: 100g, 2h 30m estimated print time
        pieza = PiezaSTL.builder()
                .nombre("Pieza Test")
                .filePath("pieza_test.stl")
                .pesoGramos(100.0)
                .tiempoEstimado("2h 30m")
                .perfilPreferido(printer)
                .filamentoPreferido(filament)
                .costoBase(0.0)
                .build();
        pieza = piezaSTLRepository.save(pieza);

        // Create Producto referencing the PiezaSTL
        producto = Producto.builder()
                .nombre("Producto Test")
                .partes(new ArrayList<>(List.of(pieza)))
                .precioSugerido(500.0)
                .build();
        producto = productoRepository.save(producto);

        // Create Cliente
        cliente = Cliente.builder()
                .nombre("Cliente Test")
                .build();
        cliente = clienteRepository.save(cliente);
    }

    @Test
    @DisplayName("Debe registrar egresos de filamento y energía al completar una orden vinculada")
    public void testOrdenVinculadaRegistraEgresos() {
        PedidoRequestDTO request = new PedidoRequestDTO();
        request.setClienteId(cliente.getId());
        request.setItems(List.of(new ItemPedidoRequestDTO(producto.getId(), 1)));

        PedidoResponseDTO pedido = pedidoService.crearPedido(request);
        UUID itemId = UUID.fromString(pedido.getItems().get(0).getId());

        OrdenProduccion orden = ordenProduccionService.crearOrdenVinculada(itemId, 2);
        orden = ordenProduccionService.cambiarEstado(orden.getId(), "COMPLETADO");

        // 1 unidad: 2.5h * 200W = 0.5kWh * $50 = $25 energía, 100g * $2/g = $200 filamento
        // 2 unidades: $50 energía, $400 filamento
        List<Transaccion> transacciones = transaccionRepository.findAll();

        Transaccion tMaterial = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.MATERIAL
                        && t.getPedidoId() != null
                        && t.getPedidoId().equals(UUID.fromString(pedido.getId())))
                .findFirst().orElse(null);
        Transaccion tEnergia = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.ENERGIA
                        && t.getPedidoId() != null
                        && t.getPedidoId().equals(UUID.fromString(pedido.getId())))
                .findFirst().orElse(null);

        assertNotNull(tMaterial);
        assertEquals(-400.0, tMaterial.getMonto(), 0.001);
        assertNotNull(tEnergia);
        assertEquals(-50.0, tEnergia.getMonto(), 0.001);
    }

    @Test
    @DisplayName("Debe registrar egresos de filamento y energía al completar una orden independiente")
    public void testOrdenIndependienteRegistraEgresos() {
        OrdenProduccion orden = ordenProduccionService.crearOrdenIndependiente(producto.getId(), 1);
        orden = ordenProduccionService.cambiarEstado(orden.getId(), "COMPLETADO");

        List<Transaccion> transacciones = transaccionRepository.findAll();

        Transaccion tMaterial = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.MATERIAL)
                .findFirst().orElse(null);
        Transaccion tEnergia = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.ENERGIA)
                .findFirst().orElse(null);

        assertNotNull(tMaterial, "Debe registrar egreso de filamento");
        assertEquals(-200.0, tMaterial.getMonto(), 0.001);
        assertNotNull(tEnergia, "Debe registrar egreso de energía");
        assertEquals(-25.0, tEnergia.getMonto(), 0.001);
    }

    @Test
    @DisplayName("Debe registrar merma parcial y actualizar el balance y la cantidad de la orden")
    public void testMermaParcial() {
        // Given un pedido de 3 productos
        OrdenProduccion orden = ordenProduccionService.crearOrdenIndependiente(producto.getId(), 3);
        
        // When se merman 2
        orden = ordenProduccionService.registrarMermaParcial(orden.getId(), 2);
        
        // Then tengo 1 producto (la orden queda en cantidad 1)
        assertEquals(1, orden.getCantidad(), "La orden debe quedar con 1 unidad restante");
        assertNotEquals(OrdenProduccion.EstadoProduccion.MERMA, orden.getEstado(), "La orden no debe pasar a estado MERMA total");
        
        // Y el balance refleja el escenario de merma
        List<Transaccion> transacciones = transaccionRepository.findAll();
        
        Transaccion tMerma = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.MERMA)
                .findFirst().orElse(null);
                
        assertNotNull(tMerma, "Debe registrar un egreso consolidado de categoría MERMA");
        
        // 2 unidades mermadas. Costo unitario: $200 filamento + $25 energía = $225.
        // Total merma: 2 * 225 = $450.
        assertEquals(-450.0, tMerma.getMonto(), 0.001, "El monto de la merma debe ser el costo de 2 unidades");
    }

    @Test
    @DisplayName("Debe registrar merma total y marcar la orden como MERMA")
    public void testMermaTotal() {
        // Given un pedido de 3 productos
        OrdenProduccion orden = ordenProduccionService.crearOrdenIndependiente(producto.getId(), 3);
        
        // When se merman todas (3)
        orden = ordenProduccionService.registrarMermaParcial(orden.getId(), 3);
        
        // Then la orden se marca como MERMA
        assertEquals(OrdenProduccion.EstadoProduccion.MERMA, orden.getEstado(), "La orden debe pasar a estado MERMA");
        assertEquals(3, orden.getCantidad(), "La cantidad no se reduce si la orden completa es merma");
        
        List<Transaccion> transacciones = transaccionRepository.findAll();
        Transaccion tMerma = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.MERMA)
                .findFirst().orElse(null);
                
        assertNotNull(tMerma, "Debe registrar un egreso consolidado de categoría MERMA");
        // Total merma: 3 * 225 = $675.
        assertEquals(-675.0, tMerma.getMonto(), 0.001, "El monto de la merma debe ser el costo de 3 unidades");
    }

    @Test
    @DisplayName("Debe impactar correctamente en el balance global al combinar mermas y produccion exitosa")
    public void testEscenarioCompletoProduccionYMermaConBalance() {
        // 1. Inyectamos capital inicial para probar el balance: +$1000
        Transaccion capitalInicial = Transaccion.builder()
                .tipo(Transaccion.TipoTransaccion.INGRESO)
                .categoria(Transaccion.CategoriaTransaccion.VENTA)
                .monto(1000.0)
                .descripcion("Capital Inicial")
                .build();
        transaccionService.create(capitalInicial);
        
        assertEquals(1000.0, transaccionService.getBalance(), 0.001);

        // 2. Given un pedido de 3 productos
        OrdenProduccion orden = ordenProduccionService.crearOrdenIndependiente(producto.getId(), 3);
        
        // 3. When se merman 2 de los 3 productos (Fallo en la impresión)
        orden = ordenProduccionService.registrarMermaParcial(orden.getId(), 2);
        
        // El balance hasta ahora: 1000 (inicial) - 450 (merma de 2 unidades) = 550
        assertEquals(550.0, transaccionService.getBalance(), 0.001, "El balance debe descontar el costo de las 2 unidades mermadas");
        
        // 4. And se completa la 1 unidad restante exitosamente
        orden = ordenProduccionService.cambiarEstado(orden.getId(), "COMPLETADO");
        
        // El balance final: 550 - 225 (producción exitosa de 1 unidad) = 325
        assertEquals(325.0, transaccionService.getBalance(), 0.001, "El balance final debe contemplar la merma parcial y la producción final");
        
        // La orden debe estar terminada y solo se suma stock por 1 unidad
        assertEquals(OrdenProduccion.EstadoProduccion.COMPLETADO, orden.getEstado());
    }
}
