package com.printly.studio.domain.perfil;

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
@DisplayName("PerfilService — Integration Tests")
class PerfilServiceIntegrationTest {

    @Autowired
    private PerfilService perfilService;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private EntityManager entityManager;

    private PerfilRequestDTO buildValidRequest(String nombre) {
        PerfilRequestDTO dto = new PerfilRequestDTO();
        dto.setNombre(nombre);
        dto.setModeloImpresora("Prusa MK3S");
        dto.setConsumoW(100.0);
        dto.setVidaUtilHoras(1000.0);
        dto.setCostoRepuestos(5000.0);
        dto.setFilamentoPorKg(15000.0);
        dto.setNozzleDiameter(0.4);
        dto.setBedShape("0x0,250x0,250x210,0x210");
        dto.setMaxPrintHeight(210.0);
        return dto;
    }

    @BeforeEach
    void setUp() {
        perfilRepository.deleteAll();
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create() persiste el perfil con todos sus campos y asigna timestamps")
    void create_persistsPerfilWithAllFields() {
        PerfilResponseDTO result = perfilService.create(buildValidRequest("Prusa MK3S"));
        entityManager.flush();
        entityManager.clear();

        PerfilResponseDTO reloaded = perfilService.findById(result.getId());

        assertThat(reloaded.getId()).isNotNull();
        assertThat(reloaded.getNombre()).isEqualTo("Prusa MK3S");
        assertThat(reloaded.getModeloImpresora()).isEqualTo("Prusa MK3S");
        assertThat(reloaded.getConsumoW()).isEqualTo(100.0);
        assertThat(reloaded.getCreadoEn()).isNotNull();
        assertThat(reloaded.getActualizadoEn()).isNotNull();
        assertThat(perfilRepository.count()).isEqualTo(1);
    }

    // ─── FIND ALL ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll() devuelve todos los perfiles creados")
    void findAll_returnsAllPerfiles() {
        perfilService.create(buildValidRequest("Perfil A"));
        perfilService.create(buildValidRequest("Perfil B"));

        List<PerfilResponseDTO> result = perfilService.findAll();
        assertThat(result).hasSize(2);
    }

    // ─── FIND BY ID ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById() lanza RuntimeException si el ID no existe")
    void findById_throwsRuntimeException_whenNotFound() {
        assertThatThrownBy(() -> perfilService.findById(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("update() modifica todos los campos correctamente")
    void update_modifiesAllFields() {
        PerfilResponseDTO created = perfilService.create(buildValidRequest("Original"));

        PerfilRequestDTO updateReq = buildValidRequest("Actualizado");
        updateReq.setConsumoW(200.0);
        updateReq.setVidaUtilHoras(2000.0);
        updateReq.setCostoRepuestos(9999.0);

        PerfilResponseDTO updated = perfilService.update(created.getId(), updateReq);

        assertThat(updated.getNombre()).isEqualTo("Actualizado");
        assertThat(updated.getConsumoW()).isEqualTo(200.0);
        assertThat(updated.getVidaUtilHoras()).isEqualTo(2000.0);
        assertThat(updated.getCostoRepuestos()).isEqualTo(9999.0);
    }

    @Test
    @DisplayName("update() lanza RuntimeException si el ID no existe")
    void update_throwsRuntimeException_whenNotFound() {
        assertThatThrownBy(() -> perfilService.update(UUID.randomUUID(), buildValidRequest("X")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete() elimina el perfil correctamente")
    void delete_removesPerfilFromDB() {
        PerfilResponseDTO created = perfilService.create(buildValidRequest("Para eliminar"));

        perfilService.delete(created.getId());

        assertThat(perfilRepository.existsById(created.getId())).isFalse();
    }

    @Test
    @DisplayName("delete() lanza RuntimeException al eliminar ID inexistente")
    void delete_throwsRuntimeException_whenNotFound() {
        assertThatThrownBy(() -> perfilService.delete(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }
}
