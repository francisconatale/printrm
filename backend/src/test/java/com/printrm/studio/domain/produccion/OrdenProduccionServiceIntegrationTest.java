package com.printrm.studio.domain.produccion;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;
import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.pedidos.ItemPedidoRequestDTO;
import com.printrm.studio.domain.pedidos.PedidoRequestDTO;
import com.printrm.studio.domain.pedidos.PedidoResponseDTO;
import com.printrm.studio.domain.pedidos.PedidoService;
import com.printrm.studio.domain.perfil.FilamentProfile;
import com.printrm.studio.domain.perfil.FilamentProfileRepository;
import com.printrm.studio.domain.perfil.Perfil;
import com.printrm.studio.domain.perfil.PerfilRepository;
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
                        && t.getPedidoId().equals(UUID.fromString(pedido.getId())))
                .findFirst().orElse(null);
        Transaccion tEnergia = transacciones.stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO 
                        && t.getCategoria() == Transaccion.CategoriaTransaccion.ENERGIA
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
}
