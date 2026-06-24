package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import com.printrm.studio.domain.stock.ProductoService;
import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@org.springframework.test.context.ActiveProfiles("test")
@Transactional
public class IdempotenciaFinancieraTest {

    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private ProductoService productoService;
    @Autowired
    private TransaccionRepository transaccionRepository;
    @Autowired
    private com.printrm.studio.utils.TestDataFactory testDataFactory;

    @Test
    public void testEvitarDobleDescuentoAlRegistrarMerma() {
        // 1. Setup: Crear perfiles y una pieza usando el Object Mother (TestDataFactory)
        com.printrm.studio.domain.perfil.FilamentProfile filament = testDataFactory.crearFilamentoPLA();
        PiezaSTL pieza = testDataFactory.crearPiezaBase(filament);
        Producto prod = testDataFactory.crearProductoSimple(pieza);
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
                List.of(new ItemPedidoRequestDTO(prod.getId(), 1))));

        // 2. Acción: Iniciar producción (YA NO genera egresos de costo base preemptivos)
        pedidoService.cambiarEstado(pedido.getId(), "EN_PRODUCCION");
        
        long countEgresosOriginal = transaccionRepository.findAll().stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO).count();
        assertEquals(0, countEgresosOriginal, "No debe haber egresos preemptivos por iniciar producción");

        // 2.5. Acción: Simular que la pieza se fabricó exitosamente (esto sí genera el egreso de material)
        productoService.addStock(prod.getId(), 1, 100.0, java.util.UUID.fromString(pedido.getId()));
        
        long countEgresosPostFabricacion = transaccionRepository.findAll().stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO).count();
        assertTrue(countEgresosPostFabricacion > 0, "Debe haber egresos después de fabricar");

        Double balanceAntesDeMerma = transaccionRepository.findAll().stream().mapToDouble(Transaccion::getMonto).sum();

        // 3. Acción: Registrar Merma de post-producción - Marcamos 1 unidad fallida
        pedidoService.registrarMerma(pedido.getId(), pedido.getItems().get(0).getId(), 1);

        // 4. Verificación: El balance monetario neto de una reclasificación es cero
        Double balanceFinal = transaccionRepository.findAll().stream().mapToDouble(Transaccion::getMonto).sum();
        
        assertEquals(balanceAntesDeMerma, balanceFinal, 
            "El balance debe reflejar el egreso original de material, sin duplicar gastos por la reclasificación a merma");
            
        // 5. Verificación estadística: Debe existir al menos una transacción de categoría MERMA
        long countMerma = transaccionRepository.findAll().stream()
                .filter(t -> t.getCategoria() == Transaccion.CategoriaTransaccion.MERMA).count();
        assertTrue(countMerma > 0, "Debe existir un registro estadístico de Merma");
    }
}
