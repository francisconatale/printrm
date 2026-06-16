package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.calculo.Calculo;
import com.printrm.studio.domain.calculo.CalculoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PedidoIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CalculoRepository calculoRepository;

    @Test
    public void testCrearPedidoMultiPiezaYAsociarACliente() {
        // 1. Setup: Crear Cliente
        Cliente cliente = clienteRepository.save(Cliente.builder().nombre("Juan Pérez").build());

        // 2. Setup: Simular dos cálculos (snapshots)
        Calculo calcA = calculoRepository.save(Calculo.builder().costoBase(100.0).build());
        Calculo calcB = calculoRepository.save(Calculo.builder().costoBase(50.0).build());

        // 3. Acción: Crear Pedido con 8 unidades de A y 2 de B
        PedidoRequestDTO request = new PedidoRequestDTO();
        request.setClienteId(cliente.getId());
        request.setItems(List.of(
            new ItemPedidoRequestDTO(calcA.getId(), null, 8),
            new ItemPedidoRequestDTO(calcB.getId(), null, 2)
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
        Calculo calc = calculoRepository.save(Calculo.builder().costoBase(100.0).build());
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(cliente.getId(), 
            List.of(new ItemPedidoRequestDTO(calc.getId(), null, 8))));
        
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
        Calculo calc = calculoRepository.save(Calculo.builder().costoBase(100.0).build());
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
            List.of(new ItemPedidoRequestDTO(calc.getId(), null, 1))));

        // 2. Acción: Cancelar
        pedidoService.cambiarEstado(pedido.getId(), "CANCELADO");

        // 3. Verificación
        PedidoResponseDTO result = pedidoService.getPedido(pedido.getId());
        assertEquals("CANCELADO", result.getEstado());
        assertEquals(100.0, result.getTotal()); // El total se preserva
    }
}
