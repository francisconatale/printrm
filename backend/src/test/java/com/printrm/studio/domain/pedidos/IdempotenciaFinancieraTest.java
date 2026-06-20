package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
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
    private TransaccionRepository transaccionRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private PiezaSTLRepository piezaSTLRepository;

    @Test
    public void testEvitarDobleDescuentoAlRegistrarMerma() {
        // 1. Setup: Crear un pedido con un ítem de producto con pieza de costo base 100.0
        PiezaSTL pieza = piezaSTLRepository.save(PiezaSTL.builder()
                .nombre("Pieza Test")
                .filePath("test.stl")
                .costoBase(100.0)
                .build());

        Producto prod = Producto.builder()
                .nombre("Producto Test")
                .partes(List.of(pieza))
                .precioSugerido(150.0)
                .build();
        prod = productoRepository.save(prod);
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
                List.of(new ItemPedidoRequestDTO(prod.getId(), 1))));

        // 2. Acción: Iniciar producción (debería generar egresos de costo base)
        pedidoService.cambiarEstado(pedido.getId(), "EN_PRODUCCION");
        
        long countEgresosOriginal = transaccionRepository.findAll().stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO).count();
        assertEquals(1, countEgresosOriginal, "Debería haber 1 egreso consolidado por fabricación");

        // 3. Acción: Registrar Merma (Fallo) - Marcamos 1 unidad fallida
        pedidoService.registrarMerma(pedido.getId(), pedido.getItems().get(0).getId(), 1);

        // 4. Verificación: El balance monetario no debe haber cambiado
        Double balanceFinal = transaccionRepository.findAll().stream().mapToDouble(Transaccion::getMonto).sum();
        
        assertEquals(-100.0, balanceFinal, 
            "El balance monetario NO debe cambiar al registrar una merma si ya se registró la producción (Cero cambio neto)");
            
        // 5. Verificación estadística: Debe existir al menos una transacción de categoría MERMA
        long countMerma = transaccionRepository.findAll().stream()
                .filter(t -> t.getCategoria() == Transaccion.CategoriaTransaccion.MERMA).count();
        assertTrue(countMerma > 0, "Debe existir un registro estadístico de Merma");
    }
}
