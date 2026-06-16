package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.calculo.Calculo;
import com.printrm.studio.domain.calculo.CalculoRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DevolucionIntegrationTest {

    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private CalculoRepository calculoRepository;
    @Autowired
    private TransaccionRepository transaccionRepository;
    @Autowired
    private ProductoRepository productoRepository;

    @Test
    public void testDevolucionDePedidoGeneraReembolsoYConsistenciaDeBalance() {
        // 1. Setup: Cliente y un Pedido ENTREGADO (que generó un Ingreso de $800)
        Cliente cliente = clienteRepository.save(Cliente.builder().nombre("Cliente Devolución").build());
        Calculo calc = calculoRepository.save(Calculo.builder().precioVenta(800.0).build());
        PedidoRequestDTO request = new PedidoRequestDTO(cliente.getId(), List.of(new ItemPedidoRequestDTO(calc.getId(), 1)));
        
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
        assertEquals(-800.0, reembolsos.get(0).getMonto(), "El monto del reembolso debe ser negativo");

        //    c) El balance total es consistente (Ingreso 800 + Reembolso -800 = 0)
        Double balanceTotal = transaccionRepository.findAll().stream().mapToDouble(Transaccion::getMonto).sum();
        assertEquals(0.0, balanceTotal);
    }
}
