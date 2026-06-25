package com.printly.studio.domain.pedidos;

import com.printly.studio.domain.clientes.Cliente;
import com.printly.studio.domain.clientes.ClienteRepository;
import com.printly.studio.domain.finanzas.Transaccion;
import com.printly.studio.domain.finanzas.TransaccionRepository;
import com.printly.studio.domain.stock.Producto;
import com.printly.studio.domain.stock.ProductoRepository;
import com.printly.studio.domain.stock.ProductoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DevolucionIntegrationTest {

    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private TransaccionRepository transaccionRepository;
    @Autowired
    private com.printly.studio.utils.TestDataFactory testDataFactory;
    @Autowired
    private ProductoService productoService;

    @Test
    public void testDevolucionDePedidoGeneraReembolsoYConsistenciaDeBalance() {
        // 1. Setup: Cliente y un Pedido ENTREGADO (que generó un Ingreso de $800)
        Cliente cliente = clienteRepository.save(Cliente.builder().nombre("Cliente Devolución").build());
        Producto prod = testDataFactory.crearProductoVacio(800.0);
        
        // Agregar stock para permitir la entrega sin lanzar excepción
        productoService.addStock(prod.getId(), 1, 0.0);
        
        PedidoRequestDTO request = new PedidoRequestDTO(cliente.getId(), List.of(new ItemPedidoRequestDTO(prod.getId(), 1)));
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(request);
        pedidoService.cambiarEstado(pedido.getId(), "ENTREGADO");

        // 2. Verificación Inicial: Existe una transacción de INGRESO
        List<Transaccion> ingresosIniciales = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.INGRESO);
        assertEquals(1, ingresosIniciales.size());
        assertEquals(800.0, ingresosIniciales.get(0).getMonto());

        // 3. Acción: Cliente devuelve el producto
        pedidoService.cambiarEstado(pedido.getId(), "DEVUELTO");

        // 4. Verificación Final:
        //    a) El estado del pedido es DEVUELTO
        PedidoResponseDTO pedidoDevuelto = pedidoService.getPedido(pedido.getId());
        assertEquals("DEVUELTO", pedidoDevuelto.getEstado());

        //    b) Se creó una transacción de REEMBOLSO
        List<Transaccion> reembolsos = transaccionRepository.findByTipo(Transaccion.TipoTransaccion.REEMBOLSO);
        assertEquals(1, reembolsos.size());
    }
}
