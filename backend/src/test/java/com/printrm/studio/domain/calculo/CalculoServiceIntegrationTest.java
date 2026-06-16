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
        dto.setCostoEnergia(45.0);
        dto.setCostoFilamento(750.0);
        dto.setSubtotal(995.0);
        dto.setCostoBase(1094.5);
        return dto;
    }

    @BeforeEach
    void setUp() {
        calculoRepository.deleteAll();
    }

    // ─── GUARDAR ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("guardarCalculo() persiste todos los campos incluido timestamp generado por BD")
    void guardarCalculo_persistsAllFieldsAndTimestamp() {
        calculoService.guardarCalculo(buildValidRequest("Prusa MK3S"));
        entityManager.flush();
        entityManager.clear();

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
        assertThat(saved.getSubtotal()).isEqualTo(995.0);
        assertThat(saved.getCostoBase()).isEqualTo(1094.5);
    }

    @Test
    @DisplayName("guardarCalculo() usa 0 como default para minutosAdicionales e insumosExtra nulos")
    void guardarCalculo_defaultsNullOptionalFieldsToZero() {
        CalculoRequestDTO req = buildValidRequest("Test");
        req.setMinutosAdicionales(null);
        req.setInsumosExtra(null);

        CalculoResponseDTO result = calculoService.guardarCalculo(req);

        assertThat(result.getMinutosAdicionales()).isEqualTo(0);
        assertThat(result.getInsumosExtra()).isEqualTo(0.0);
    }

    // ─── HISTORIAL ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getHistorial() devuelve los cálculos en orden DESC por timestamp")
    void getHistorial_returnsItemsInDescendingOrder() throws InterruptedException {
        calculoService.guardarCalculo(buildValidRequest("Primer cálculo"));
        Thread.sleep(50);
        calculoService.guardarCalculo(buildValidRequest("Segundo cálculo"));

        List<CalculoResponseDTO> historial = calculoService.getHistorial();

        assertThat(historial).hasSize(2);
        assertThat(historial.get(0).getPerfilNombre()).isEqualTo("Segundo cálculo");
        assertThat(historial.get(1).getPerfilNombre()).isEqualTo("Primer cálculo");
    }

    @Test
    @DisplayName("getHistorial() retorna máximo 50 elementos aunque haya más")
    void getHistorial_returnsAtMost50Items() {
        for (int i = 0; i < 60; i++) {
            calculoService.guardarCalculo(buildValidRequest("Cálculo " + i));
        }

        assertThat(calculoService.getHistorial()).hasSize(50);
    }

    // ─── ELIMINAR ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminarCalculo() elimina el registro por ID")
    void eliminarCalculo_deletesRecord() {
        CalculoResponseDTO saved = calculoService.guardarCalculo(buildValidRequest("A borrar"));

        calculoService.eliminarCalculo(saved.getId());

        assertThat(calculoRepository.existsById(saved.getId())).isFalse();
    }

    // ─── LIMPIAR HISTORIAL ────────────────────────────────────────────────────

    @Test
    @DisplayName("limpiarHistorial() elimina todos los registros")
    void limpiarHistorial_deletesAll() {
        calculoService.guardarCalculo(buildValidRequest("A"));
        calculoService.guardarCalculo(buildValidRequest("B"));
        calculoService.guardarCalculo(buildValidRequest("C"));

        calculoService.limpiarHistorial();

        assertThat(calculoRepository.count()).isEqualTo(0);
    }
}
