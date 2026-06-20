package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
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
    private ProductoRepository productoRepository;

    @Test
    public void testCrearPedidoMultiPiezaYAsociarACliente() {
        // 1. Setup: Crear Cliente
        Cliente cliente = clienteRepository.save(Cliente.builder().nombre("Juan Pérez").build());

        // 2. Setup: Simular dos productos
        Producto prodA = productoRepository.save(Producto.builder().nombre("Producto A").precioSugerido(100.0).build());
        Producto prodB = productoRepository.save(Producto.builder().nombre("Producto B").precioSugerido(50.0).build());

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
        Producto prod = productoRepository.save(Producto.builder().nombre("Producto Test").precioSugerido(100.0).build());
        
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
        Producto prod = productoRepository.save(Producto.builder().nombre("Producto Test").precioSugerido(100.0).build());
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
            List.of(new ItemPedidoRequestDTO(prod.getId(), 1))));

        // 2. Acción: Cancelar
        pedidoService.cambiarEstado(pedido.getId(), "CANCELADO");

        // 3. Verificación
        PedidoResponseDTO result = pedidoService.getPedido(pedido.getId());
        assertEquals("CANCELADO", result.getEstado());
        assertEquals(100.0, result.getTotal()); // El total se preserva
    }
}
