package com.printly.studio.domain.pedidos;

import com.printly.studio.domain.clientes.Cliente;
import com.printly.studio.domain.clientes.ClienteRepository;
import com.printly.studio.domain.stock.Producto;
import com.printly.studio.domain.stock.ProductoRepository;
import com.printly.studio.domain.stock.ProductoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@org.springframework.test.context.ActiveProfiles("test")
@Transactional
public class PedidoIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private com.printly.studio.utils.TestDataFactory testDataFactory;

    @Autowired
    private ProductoService productoService;

    @Test
    public void testCrearPedidoMultiPiezaYAsociarACliente() {
        // 1. Setup: Crear Cliente
        Cliente cliente = clienteRepository.save(Cliente.builder().nombre("Juan Pérez").build());

        // 2. Setup: Simular dos productos
        Producto prodA = testDataFactory.crearProductoVacio(100.0);
        Producto prodB = testDataFactory.crearProductoVacio(50.0);

        // 3. Acción: Crear Pedido con 8 unidades de A y 2 de B
        PedidoRequestDTO request = new PedidoRequestDTO();
        request.setClienteId(cliente.getId());
        request.setItems(List.of(
            new ItemPedidoRequestDTO(prodA.getId(), 8),
            new ItemPedidoRequestDTO(prodB.getId(), 2)
        ));

        PedidoResponseDTO pedido = pedidoService.crearPedido(request);

        // 4. Verificación
        assertNotNull(pedido.getId());
        assertEquals(cliente.getNombre(), pedido.getClienteNombre());
        assertEquals(900.0, pedido.getTotal()); // (8 * 100) + (2 * 50)
        assertEquals(2, pedido.getItems().size());
    }

    @Test
    public void testAjusteDeCantidadRecalculaTotal() {
        // 1. Setup: Pedido inicial con 8 unidades (8 * 100 = 800)
        Cliente cliente = clienteRepository.save(Cliente.builder().nombre("Ana").build());
        Producto prod = testDataFactory.crearProductoVacio(100.0);
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(cliente.getId(), 
            List.of(new ItemPedidoRequestDTO(prod.getId(), 8))));
        
        assertEquals(800.0, pedido.getTotal());

        // 2. Acción: Ajustar cantidad a 4
        String itemId = pedido.getItems().get(0).getId();
        PedidoResponseDTO pedidoActualizado = pedidoService.actualizarCantidadItem(pedido.getId(), itemId, 4);

        // 3. Verificación
        assertEquals(400.0, pedidoActualizado.getTotal());
        assertEquals(4, pedidoActualizado.getItems().get(0).getCantidad());
    }

    @Test
    public void testCancelarPedidoCambiaEstadoYPreservaDatos() {
        // 1. Setup: Crear pedido
        Producto prod = testDataFactory.crearProductoVacio(100.0);
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
            List.of(new ItemPedidoRequestDTO(prod.getId(), 1))));

        // 2. Acción: Cancelar
        pedidoService.cambiarEstado(pedido.getId(), "CANCELADO");

        // 3. Verificación
        PedidoResponseDTO result = pedidoService.getPedido(pedido.getId());
        assertEquals("CANCELADO", result.getEstado());
        assertEquals(100.0, result.getTotal()); // El total se preserva
    }

    @Test
    public void testEntregarPedidoDosVecesLanzaExcepcion() {
        Producto prod = testDataFactory.crearProductoVacio(100.0);
        productoService.addStock(prod.getId(), 10, 0.0);
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
            List.of(new ItemPedidoRequestDTO(prod.getId(), 1))));

        // Primer entrega (debe pasar)
        pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");

        // Intentar segunda entrega (debe fallar)
        assertThrows(IllegalStateException.class, () -> {
            pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");
        });
    }

    @Test
    public void testDevolverPedidoDosVecesLanzaExcepcion() {
        Producto prod = testDataFactory.crearProductoVacio(100.0);
        productoService.addStock(prod.getId(), 10, 0.0);

        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
            List.of(new ItemPedidoRequestDTO(prod.getId(), 1))));

        pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");
        pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");

        // Intentar segunda devolución (debe fallar)
        assertThrows(IllegalStateException.class, () -> {
            pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");
        });
    }
}
