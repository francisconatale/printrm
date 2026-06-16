package com.printrm.studio.domain.calculo;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("CalculoService — Integration Tests")
class CalculoServiceIntegrationTest {

    @Autowired
    private CalculoService calculoService;

    @Autowired
    private CalculoRepository calculoRepository;

    @Autowired
    private EntityManager entityManager;

    private CalculoRequestDTO buildValidRequest(String perfilNombre) {
        CalculoRequestDTO dto = new CalculoRequestDTO();
        dto.setPerfilId(UUID.randomUUID());
        dto.setPerfilNombre(perfilNombre);
        dto.setHoras(2);
        dto.setMinutosAdicionales(30);
        dto.setGramos(50.0);
        dto.setInsumosExtra(100.0);
        dto.setMultiplicador(3.0);
        dto.setCostoEnergia(45.0);
        dto.setCostoFilamento(750.0);
        dto.setCostoDesgaste(200.0);
        dto.setSubtotal(995.0);
        dto.setCostoBase(1094.5);
        dto.setPrecioVenta(3283.5);
        return dto;
    }

    @BeforeEach
    void setUp() {
        calculoRepository.deleteAll();
    }

    // ─── GUARDAR ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("guardarCalculo() persiste el cálculo y devuelve DTO con ID y timestamp")
    void guardarCalculo_persistsAndReturnsDTO() {
        CalculoResponseDTO result = calculoService.guardarCalculo(buildValidRequest("Prusa MK3S"));
        entityManager.flush();
        entityManager.clear();

        // Re-leer desde historial para obtener valores de BD (incluyendo timestamp generado)
        List<CalculoResponseDTO> historial = calculoService.getHistorial();
        assertThat(historial).hasSize(1);
        CalculoResponseDTO saved = historial.get(0);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTimestamp()).isNotNull();
        assertThat(saved.getPerfilNombre()).isEqualTo("Prusa MK3S");
        assertThat(saved.getHoras()).isEqualTo(2);
        assertThat(saved.getMinutosAdicionales()).isEqualTo(30);
        assertThat(saved.getGramos()).isEqualTo(50.0);
        assertThat(saved.getCostoEnergia()).isEqualTo(45.0);
        assertThat(saved.getCostoFilamento()).isEqualTo(750.0);
        assertThat(saved.getCostoDesgaste()).isEqualTo(200.0);
        assertThat(saved.getSubtotal()).isEqualTo(995.0);
        assertThat(saved.getCostoBase()).isEqualTo(1094.5);
        assertThat(saved.getPrecioVenta()).isEqualTo(3283.5);
        assertThat(calculoRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("guardarCalculo() maneja minutosAdicionales null usando 0 como default")
    void guardarCalculo_defaultsNullMinutosToZero() {
        CalculoRequestDTO req = buildValidRequest("Test");
        req.setMinutosAdicionales(null);

        CalculoResponseDTO result = calculoService.guardarCalculo(req);

        assertThat(result.getMinutosAdicionales()).isEqualTo(0);
    }

    @Test
    @DisplayName("guardarCalculo() maneja insumosExtra null usando 0.0 como default")
    void guardarCalculo_defaultsNullInsumosToZero() {
        CalculoRequestDTO req = buildValidRequest("Test");
        req.setInsumosExtra(null);

        CalculoResponseDTO result = calculoService.guardarCalculo(req);

        assertThat(result.getInsumosExtra()).isEqualTo(0.0);
    }

    // ─── HISTORIAL ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getHistorial() devuelve lista vacía cuando no hay cálculos")
    void getHistorial_returnsEmpty_whenNoData() {
        assertThat(calculoService.getHistorial()).isEmpty();
    }

    @Test
    @DisplayName("getHistorial() devuelve los cálculos en orden DESC por timestamp")
    void getHistorial_returnsItemsInDescendingOrder() throws InterruptedException {
        calculoService.guardarCalculo(buildValidRequest("Primer cálculo"));
        Thread.sleep(50); // Pequeña pausa para asegurar timestamps distintos
        calculoService.guardarCalculo(buildValidRequest("Segundo cálculo"));

        List<CalculoResponseDTO> historial = calculoService.getHistorial();

        assertThat(historial).hasSize(2);
        // El más reciente debe estar primero
        assertThat(historial.get(0).getPerfilNombre()).isEqualTo("Segundo cálculo");
        assertThat(historial.get(1).getPerfilNombre()).isEqualTo("Primer cálculo");
    }

    @Test
    @DisplayName("getHistorial() retorna máximo 50 elementos aunque haya más")
    void getHistorial_returnsAtMost50Items() {
        for (int i = 0; i < 60; i++) {
            calculoService.guardarCalculo(buildValidRequest("Cálculo " + i));
        }

        List<CalculoResponseDTO> historial = calculoService.getHistorial();

        assertThat(historial).hasSize(50);
    }

    // ─── ELIMINAR ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminarCalculo() elimina el registro por ID")
    void eliminarCalculo_deletesRecord() {
        CalculoResponseDTO saved = calculoService.guardarCalculo(buildValidRequest("A borrar"));

        calculoService.eliminarCalculo(saved.getId());

        assertThat(calculoRepository.existsById(saved.getId())).isFalse();
        assertThat(calculoRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("eliminarCalculo() de uno no afecta los otros")
    void eliminarCalculo_doesNotAffectOthers() {
        CalculoResponseDTO a = calculoService.guardarCalculo(buildValidRequest("A"));
        CalculoResponseDTO b = calculoService.guardarCalculo(buildValidRequest("B"));

        calculoService.eliminarCalculo(a.getId());

        assertThat(calculoRepository.count()).isEqualTo(1);
        assertThat(calculoRepository.existsById(b.getId())).isTrue();
    }

    @Test
    @DisplayName("eliminarCalculo() con ID inexistente no lanza excepción (comportamiento JPA por defecto)")
    void eliminarCalculo_doesNotThrow_whenIdNotFound() {
        assertThatNoException().isThrownBy(
                () -> calculoService.eliminarCalculo(UUID.randomUUID())
        );
    }

    // ─── LIMPIAR HISTORIAL ────────────────────────────────────────────────────

    @Test
    @DisplayName("limpiarHistorial() elimina todos los registros")
    void limpiarHistorial_deletesAll() {
        calculoService.guardarCalculo(buildValidRequest("A"));
        calculoService.guardarCalculo(buildValidRequest("B"));
        calculoService.guardarCalculo(buildValidRequest("C"));
        assertThat(calculoRepository.count()).isEqualTo(3);

        calculoService.limpiarHistorial();

        assertThat(calculoRepository.count()).isEqualTo(0);
        assertThat(calculoService.getHistorial()).isEmpty();
    }

    @Test
    @DisplayName("limpiarHistorial() sobre tabla vacía no lanza excepción")
    void limpiarHistorial_doesNotThrow_whenAlreadyEmpty() {
        assertThatNoException().isThrownBy(() -> calculoService.limpiarHistorial());
    }
}
