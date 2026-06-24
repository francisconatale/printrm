package com.printrm.studio.steps;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionService;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import com.printrm.studio.domain.venta.DevolucionRequest;
import com.printrm.studio.domain.venta.VentaRequest;
import com.printrm.studio.domain.venta.VentaService;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class DevolucionVentaDirectaSteps {

    @Autowired private TransaccionService transaccionService;
    @Autowired private ProductoService productoService;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private VentaService ventaService;

    private UUID productoId;
    private double precioProducto;
    private String grupoId;

    private double balanceAntes;
    private double balanceMedio;
    private double balanceDespues;

    @Given("un balance inicial de {double} en caja")
    public void un_balance_inicial_en_caja(double monto) {
        transaccionService.registrarTransaccion(
                Transaccion.TipoTransaccion.INGRESO,
                Transaccion.CategoriaTransaccion.OTRO,
                monto,
                "Saldo inicial de caja",
                null
        );
    }

    @Given("un producto {string} con precio {double}")
    public void un_producto_con_precio(String nombre, double precio) {
        com.printrm.studio.domain.stock.ProductoRequestDTO dto = new com.printrm.studio.domain.stock.ProductoRequestDTO();
        dto.setNombre(nombre);
        dto.setPrecioSugerido(precio);
        dto.setCantidadStock(0);
        com.printrm.studio.domain.stock.ProductoResponseDTO response = productoService.save(dto);
        productoId = UUID.fromString(response.getId());
        precioProducto = precio;
    }

    @Given("stock de {int} unidades fabricadas con costo {double} cada una")
    public void stock_de_unidades_fabricadas_con_costo(int cantidad, double costo) {
        productoService.addStock(productoId, cantidad, costo);
    }

    @Given("una venta de {int} unidades del producto")
    public void una_venta_de_unidades_del_producto(int cantidad) {
        VentaRequest request = new VentaRequest();
        VentaRequest.ItemVenta item = new VentaRequest.ItemVenta();
        item.setProductoId(productoId);
        item.setCantidad(cantidad);
        request.setItems(List.of(item));
        var response = ventaService.registrar(request);
        grupoId = response.getGrupoId();
    }

    @When("se venden {int} unidades del producto")
    public void se_venden_unidades_del_producto(int cantidad) {
        balanceAntes = transaccionService.getBalance();
        VentaRequest request = new VentaRequest();
        VentaRequest.ItemVenta item = new VentaRequest.ItemVenta();
        item.setProductoId(productoId);
        item.setCantidad(cantidad);
        request.setItems(List.of(item));
        var response = ventaService.registrar(request);
        grupoId = response.getGrupoId();
    }

    @When("se devuelve {int} unidad del producto")
    public void se_devuelve_unidad_del_producto(int cantidad) {
        balanceMedio = transaccionService.getBalance();
        DevolucionRequest request = new DevolucionRequest();
        DevolucionRequest.ItemDevolucion item = new DevolucionRequest.ItemDevolucion();
        item.setProductoId(productoId);
        item.setCantidad(cantidad);
        request.setItems(List.of(item));
        ventaService.devolver(grupoId, request);
        balanceDespues = transaccionService.getBalance();
    }

    @When("se devuelven {int} unidades del producto")
    public void se_devuelven_unidades_del_producto(int cantidad) {
        balanceAntes = transaccionService.getBalance();
        DevolucionRequest request = new DevolucionRequest();
        DevolucionRequest.ItemDevolucion item = new DevolucionRequest.ItemDevolucion();
        item.setProductoId(productoId);
        item.setCantidad(cantidad);
        request.setItems(List.of(item));
        ventaService.devolver(grupoId, request);
        balanceDespues = transaccionService.getBalance();
    }

    @When("se intenta devolver {int} unidades del mismo producto nuevamente")
    public void se_intenta_devolver_unidades_del_mismo_producto_nuevamente(int cantidad) {
        balanceAntes = transaccionService.getBalance();
        DevolucionRequest request = new DevolucionRequest();
        DevolucionRequest.ItemDevolucion item = new DevolucionRequest.ItemDevolucion();
        item.setProductoId(productoId);
        item.setCantidad(cantidad);
        request.setItems(List.of(item));
        try {
            ventaService.devolver(grupoId, request);
            fail("Debió lanzar excepción por devolución duplicada");
        } catch (RuntimeException e) {
            assertTrue(e.getMessage().contains("Solo puedes devolver hasta"));
        }
        balanceDespues = transaccionService.getBalance();
    }

    @Then("el balance de caja aumentó en {double}")
    public void el_balance_de_caja_aumento_en(double incremento) {
        assertEquals(incremento, transaccionService.getBalance() - balanceAntes, 0.01);
    }

    @Then("el balance de caja se redujo en {double}")
    public void el_balance_de_caja_se_redujo_en(double decremento) {
        assertEquals(-decremento, transaccionService.getBalance() - balanceMedio, 0.01);
    }

    @Then("el stock del producto es {int}")
    public void el_stock_del_producto_es(int stockEsperado) {
        Producto producto = productoRepository.findById(productoId).orElseThrow();
        assertEquals(stockEsperado, producto.getCantidadStock());
    }

    @Then("el stock del producto volvió a {int}")
    public void el_stock_del_producto_volvio_a(int stockEsperado) {
        Producto producto = productoRepository.findById(productoId).orElseThrow();
        assertEquals(stockEsperado, producto.getCantidadStock());
    }

    @Then("la devolución se procesa correctamente")
    public void la_devolucion_se_procesa_correctamente() {
        assertNotNull(grupoId);
    }

    @Then("el sistema rechaza la devolución por exceder las unidades disponibles")
    public void el_sistema_rechaza_la_devolucion_por_exceder_las_unidades_disponibles() {
        // La excepción ya fue capturada en el When
    }

    @Then("el balance de caja no se modifica respecto al paso anterior")
    public void el_balance_de_caja_no_se_modifica() {
        assertEquals(balanceAntes, balanceDespues, 0.01);
    }
}
