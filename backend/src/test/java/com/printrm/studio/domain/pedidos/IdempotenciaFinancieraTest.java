package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.finanzas.Transaccion;
import com.printrm.studio.domain.finanzas.TransaccionRepository;
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
public class IdempotenciaFinancieraTest {

    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private TransaccionRepository transaccionRepository;
    @Autowired
    private CalculoRepository calculoRepository;

    @Test
    public void testEvitarDobleDescuentoAlRegistrarMerma() {
        // 1. Setup: Crear un pedido con un ítem de $100 de costo base
        Calculo calc = calculoRepository.save(Calculo.builder()
                .costoEnergia(10.0)
                .costoFilamento(90.0)
                .costoBase(400.0)
                .build());
        
        PedidoResponseDTO pedido = pedidoService.crearPedido(new PedidoRequestDTO(null, 
                List.of(new ItemPedidoRequestDTO(calc.getId(), null, 1))));

        // 2. Acción: Iniciar producción (debería generar egresos por separado)
        pedidoService.cambiarEstado(pedido.getId(), "EN_PRODUCCION");
        
        long countEgresosOriginal = transaccionRepository.findAll().stream()
                .filter(t -> t.getTipo() == Transaccion.TipoTransaccion.EGRESO).count();
        assertEquals(2, countEgresosOriginal, "Debería haber 2 egresos (Material + Energía por separado)");

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
