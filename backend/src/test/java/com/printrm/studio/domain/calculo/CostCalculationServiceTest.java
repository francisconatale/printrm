package com.printrm.studio.domain.calculo;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.perfil.FilamentProfile;
import com.printrm.studio.domain.perfil.Perfil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CostCalculationService — Edge Cases")
class CostCalculationServiceTest {

    @InjectMocks
    private CostCalculationService service;

    private final AjustesDTO ajustesDefault = AjustesDTO.builder()
            .preciokWh(50.0)
            .margenError(10.0)
            .build();

    private final Perfil printerBase = Perfil.builder()
            .consumoW(100.0)
            .filamentoPorKg(15000.0)
            .build();

    private final FilamentProfile filamentBase = FilamentProfile.builder()
            .filamentoPorKg(20000.0)
            .build();

    @Nested
    @DisplayName("Campos nulos")
    class NullSafety {

        @Test
        @DisplayName("OK: todos los parámetros nulos no lanzan excepción")
        void parametrosTodosNulos_noLanza() {
            CostCalculationResult r = service.calculate(null, null, null, null, null, null, null);
            assertNotNull(r);
            assertEquals(0.0, r.getCostoBase());
            assertEquals(0.0, r.getCostoEnergia());
            assertEquals(0.0, r.getCostoFilamento());
        }

        @Test
        @DisplayName("OK: ajustes nulo usa defaults (precioKWh=50.0, margenError=0)")
        void ajustesNulo_usaDefaults() {
            CostCalculationResult r = service.calculate(1000.0, 2, 30, 50.0, printerBase, filamentBase, null);
            double energiaEsperada = (100.0 / 1000.0) * 2.5 * 50.0;
            double filamentoEsperado = (1000.0 / 1000.0) * 20000.0;
            assertEquals(energiaEsperada, r.getCostoEnergia(), 0.001);
            assertEquals(filamentoEsperado, r.getCostoFilamento(), 0.001);
            assertEquals(energiaEsperada + filamentoEsperado + 50.0, r.getSubtotal(), 0.001);
        }

        @Test
        @DisplayName("OK: printer nulo usa consumoW default 120W y filamentoPorKg no disponible")
        void printerNulo_usaConsumoDefault() {
            CostCalculationResult r = service.calculate(1000.0, 1, 0, 0.0, null, filamentBase, ajustesDefault);
            double energiaEsperada = (120.0 / 1000.0) * 1.0 * 50.0;
            assertEquals(energiaEsperada, r.getCostoEnergia(), 0.001);
        }

        @Test
        @DisplayName("OK: filament nulo usa filamentoPorKg del printer como fallback")
        void filamentNulo_usaFilamentoPorKgDelPrinter() {
            CostCalculationResult r = service.calculate(500.0, 1, 0, 0.0, printerBase, null, ajustesDefault);
            double filamentoEsperado = (500.0 / 1000.0) * 15000.0;
            assertEquals(filamentoEsperado, r.getCostoFilamento(), 0.001);
        }

        @Test
        @DisplayName("OK: gramos nulo se trata como 0")
        void gramosNulo_esCero() {
            CostCalculationResult r = service.calculate(null, 1, 0, 0.0, printerBase, filamentBase, ajustesDefault);
            assertEquals(0.0, r.getCostoFilamento(), 0.001);
        }

        @Test
        @DisplayName("OK: horas nulo se trata como 0")
        void horasNulo_esCero() {
            CostCalculationResult r = service.calculate(100.0, null, 30, 0.0, printerBase, filamentBase, ajustesDefault);
            double energiaEsperada = (100.0 / 1000.0) * 0.5 * 50.0;
            assertEquals(energiaEsperada, r.getCostoEnergia(), 0.001);
        }
    }

    @Nested
    @DisplayName("Cálculos con valores extremos")
    class ExtremeValues {

        @Test
        @DisplayName("OK: gramos = 0 da costo filamento = 0")
        void gramosCero_costoFilamentoCero() {
            CostCalculationResult r = service.calculate(0.0, 1, 0, 0.0, printerBase, filamentBase, ajustesDefault);
            assertEquals(0.0, r.getCostoFilamento(), 0.001);
        }

        @Test
        @DisplayName("OK: tiempo = 0 da costo energía = 0")
        void tiempoCero_costoEnergiaCero() {
            CostCalculationResult r = service.calculate(100.0, 0, 0, 0.0, printerBase, filamentBase, ajustesDefault);
            assertEquals(0.0, r.getCostoEnergia(), 0.001);
        }

        @Test
        @DisplayName("OK: margenError = 0 implica costoBase = subtotal")
        void margenErrorCero_costoBaseIgualSubtotal() {
            AjustesDTO ajustesSinError = AjustesDTO.builder()
                    .preciokWh(50.0)
                    .margenError(0.0)
                    .build();
            CostCalculationResult r = service.calculate(100.0, 1, 0, 10.0, printerBase, filamentBase, ajustesSinError);
            assertEquals(r.getSubtotal(), r.getCostoBase(), 0.001);
        }

        @Test
        @DisplayName("OK: insumosExtra = 0 no afecta subtotal")
        void insumosExtraCero_noAfecta() {
            CostCalculationResult r = service.calculate(100.0, 1, 0, 0.0, printerBase, filamentBase, ajustesDefault);
            double energia = (100.0 / 1000.0) * 1.0 * 50.0;
            double filamento = (100.0 / 1000.0) * 20000.0;
            assertEquals(energia + filamento, r.getSubtotal(), 0.001);
        }

        @Test
        @DisplayName("OK: tiempo de 2h 30m = 2.5 horas")
        void tiempo2h30m_es2_5Horas() {
            CostCalculationResult r = service.calculate(100.0, 2, 30, 0.0, printerBase, filamentBase, ajustesDefault);
            assertEquals(2.5, r.getTiempoTotalHoras(), 0.001);
        }

        @Test
        @DisplayName("OK: margenError de 10% se aplica sobre costoFilamento")
        void margenError10_porcentaje_seAplica() {
            CostCalculationResult r = service.calculate(100.0, 1, 0, 0.0, printerBase, filamentBase, ajustesDefault);
            double costoErrorEsperado = r.getCostoFilamento() * 0.1;
            assertEquals(costoErrorEsperado, r.getCostoError(), 0.001);
            assertEquals(r.getSubtotal() + costoErrorEsperado, r.getCostoBase(), 0.001);
        }
    }

    @Nested
    @DisplayName("calculateForProducto")
    class CalculateForProducto {

        @Test
        @DisplayName("OK: producto sin partes devuelve costos en cero")
        void productoVacio_costosCero() {
            com.printrm.studio.domain.stock.Producto producto = com.printrm.studio.domain.stock.Producto.builder()
                    .nombre("Producto Vacío")
                    .build();
            CostCalculationResult r = service.calculateForProducto(producto, ajustesDefault);
            assertEquals(0.0, r.getCostoBase());
            assertEquals(0.0, r.getCostoFilamento());
            assertEquals(0.0, r.getCostoEnergia());
        }
    }

    @Nested
    @DisplayName("Parsing de tiempo")
    class TimeParsing {

        @Test
        @DisplayName("OK: parseHours con string nulo devuelve 0")
        void parseHours_nulo_retornaCero() {
            assertEquals(0, service.parseHours(null));
        }

        @Test
        @DisplayName("OK: parseHours con string inválido devuelve 0")
        void parseHours_invalido_retornaCero() {
            assertEquals(0, service.parseHours("no-es-una-hora"));
        }

        @Test
        @DisplayName("OK: parseMinutes con string sin 'h' devuelve 0")
        void parseMinutes_sinH_retornaCero() {
            assertEquals(0, service.parseMinutes("30m"));
        }

        @Test
        @DisplayName("OK: parseMinutes con string nulo devuelve 0")
        void parseMinutes_nulo_retornaCero() {
            assertEquals(0, service.parseMinutes(null));
        }
    }
}
