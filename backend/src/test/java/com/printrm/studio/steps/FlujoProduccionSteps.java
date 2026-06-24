package com.printrm.studio.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;

import com.printrm.studio.domain.pedidos.PedidoService;
import com.printrm.studio.domain.pedidos.PedidoRequestDTO;
import com.printrm.studio.domain.pedidos.PedidoResponseDTO;
import com.printrm.studio.domain.pedidos.ItemPedidoRequestDTO;
import com.printrm.studio.domain.pedidos.Pedido;
import com.printrm.studio.domain.pedidos.ItemPedido;
import com.printrm.studio.domain.pedidos.PedidoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import com.printrm.studio.domain.stock.ProductoRequestDTO;
import com.printrm.studio.domain.stock.ProductoResponseDTO;
import com.printrm.studio.domain.clientes.ClienteService;
import com.printrm.studio.domain.clientes.Cliente;
import com.printrm.studio.domain.clientes.ClienteRepository;
import com.printrm.studio.domain.produccion.OrdenProduccionService;
import com.printrm.studio.domain.produccion.OrdenProduccion;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;

import java.util.List;
import java.util.UUID;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class FlujoProduccionSteps {

    @Autowired private PedidoService pedidoService;
    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private ProductoService productoService;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private OrdenProduccionService ordenProduccionService;
    @Autowired private PiezaSTLRepository piezaSTLRepository;

    private UUID clienteId;
    private UUID productoId;
    private UUID pedidoId;
    private UUID itemId;
    private UUID ordenId;

    @Given("que existe una pieza STL en la biblioteca")
    public void que_existe_una_pieza_stl_en_la_biblioteca() {
        PiezaSTL pieza = new PiezaSTL();
        pieza.setNombre("Pieza de Prueba");
        pieza.setFilePath("/mock/path.stl");
        pieza.setPesoGramos(50.0);
        pieza.setTiempoEstimado("1h 30m");
        piezaSTLRepository.save(pieza);
    }

    @Given("existe un producto asociado a esa pieza")
    public void existe_un_producto_asociado_a_esa_pieza() {
        ProductoRequestDTO dto = new ProductoRequestDTO();
        dto.setNombre("Producto Test");
        dto.setPrecioSugerido(1000.0);
        dto.setCantidadStock(0);
        
        ProductoResponseDTO response = productoService.save(dto);
        this.productoId = UUID.fromString(response.getId());
    }

    @Given("existe un cliente llamado {string}")
    public void existe_un_cliente_llamado(String nombreCliente) {
        Cliente cliente = new Cliente();
        cliente.setNombre(nombreCliente);
        clienteRepository.save(cliente);
        this.clienteId = cliente.getId();
    }

    @When("el cliente {string} pide {int} unidades de ese producto")
    public void el_cliente_pide_unidades_de_ese_producto(String nombreCliente, Integer cantidad) {
        ItemPedidoRequestDTO itemDto = new ItemPedidoRequestDTO(this.productoId, cantidad);
        
        PedidoRequestDTO pedidoDto = new PedidoRequestDTO(
            this.clienteId, 
            Collections.singletonList(itemDto)
        );

        PedidoResponseDTO response = pedidoService.crearPedido(pedidoDto);
        this.pedidoId = UUID.fromString(response.getId());
        
        PedidoResponseDTO pedidoGuardado = pedidoService.getPedido(this.pedidoId.toString());
        this.itemId = UUID.fromString(pedidoGuardado.getItems().get(0).getId());
    }

    @When("el pedido se manda a fabricar")
    public void el_pedido_se_manda_a_fabricar() {
        pedidoService.cambiarEstado(pedidoId.toString(), "EN_PRODUCCION");
        
        PedidoResponseDTO pedido = pedidoService.getPedido(this.pedidoId.toString());
        Integer cantidad = pedido.getItems().get(0).getCantidad();
        
        OrdenProduccion orden = ordenProduccionService.crearOrdenVinculada(this.itemId, cantidad);
        this.ordenId = orden.getId();
    }

    @When("durante la producción se registra una merma de {int} unidad y {int} se fabrican con éxito")
    public void durante_la_produccion_se_registra_una_merma_y_se_fabrican_con_exito(Integer cantMerma, Integer cantExito) {
        ordenProduccionService.registrarMermaParcial(this.ordenId, cantMerma);
        ordenProduccionService.cambiarEstado(this.ordenId, "COMPLETADO");
    }

    @When("se produce {int} unidad más para compensar la merma")
    public void se_produce_unidad_mas_para_compensar_la_merma(Integer cantExtra) {
        OrdenProduccion ordenExtra = ordenProduccionService.crearOrdenVinculada(this.itemId, cantExtra);
        ordenProduccionService.cambiarEstado(ordenExtra.getId(), "COMPLETADO");
    }

    @Then("el pedido puede confirmarse y registrarse como completado")
    public void el_pedido_puede_confirmarse_y_registrarse_como_completado() {
        pedidoService.cambiarEstado(pedidoId.toString(), "ENTREGADO");
        
        PedidoResponseDTO pedidoFinal = pedidoService.getPedido(this.pedidoId.toString());
        assertEquals("ENTREGADO", pedidoFinal.getEstado());
        assertEquals(3, pedidoFinal.getItems().get(0).getCantidadEntregada());
    }
}
