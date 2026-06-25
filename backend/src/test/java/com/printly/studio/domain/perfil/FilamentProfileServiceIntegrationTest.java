package com.printly.studio.domain.perfil;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("FilamentProfileService — Integration Tests")
class FilamentProfileServiceIntegrationTest {

    @Autowired
    private FilamentProfileService filamentProfileService;

    @Autowired
    private FilamentProfileRepository filamentProfileRepository;

    @Autowired
    private EntityManager entityManager;

    private FilamentProfileRequestDTO buildValidRequest(String nombre) {
        return new FilamentProfileRequestDTO(
                nombre,
                "PLA",
                15000.0,
                1.24,
                1.75,
                "#FF5733"
        );
    }

    @BeforeEach
    void setUp() {
        filamentProfileRepository.deleteAll();
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create() persiste el filamento con todos sus campos y asigna timestamps")
    void create_persistsFilamentWithAllFields() {
        FilamentProfileResponseDTO created = filamentProfileService.create(buildValidRequest("PLA Generic"));
        entityManager.flush();
        entityManager.clear();

        FilamentProfileResponseDTO reloaded = filamentProfileService.findById(created.getId());

        assertThat(reloaded.getId()).isNotNull();
        assertThat(reloaded.getNombre()).isEqualTo("PLA Generic");
        assertThat(reloaded.getMaterial()).isEqualTo("PLA");
        assertThat(reloaded.getDensity()).isEqualTo(1.24);
        assertThat(reloaded.getDiameter()).isEqualTo(1.75);
        assertThat(reloaded.getColour()).isEqualTo("#FF5733");
        assertThat(reloaded.getCreadoEn()).isNotNull();
        assertThat(filamentProfileRepository.count()).isEqualTo(1);
    }

    // ─── FIND BY ID ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById() lanza RuntimeException si no existe")
    void findById_throwsException_whenNotFound() {
        assertThatThrownBy(() -> filamentProfileService.findById(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("update() modifica correctamente todos los campos")
    void update_modifiesAllFields() {
        FilamentProfileResponseDTO created = filamentProfileService.create(buildValidRequest("Original"));

        FilamentProfileRequestDTO updateReq = new FilamentProfileRequestDTO(
                "Actualizado", "PETG", 20000.0, 1.27, 1.75, "#00FF00"
        );

        FilamentProfileResponseDTO updated = filamentProfileService.update(created.getId(), updateReq);

        assertThat(updated.getNombre()).isEqualTo("Actualizado");
        assertThat(updated.getMaterial()).isEqualTo("PETG");
        assertThat(updated.getFilamentoPorKg()).isEqualTo(20000.0);
        assertThat(updated.getDensity()).isEqualTo(1.27);
        assertThat(updated.getColour()).isEqualTo("#00FF00");
    }

    @Test
    @DisplayName("update() lanza RuntimeException si el ID no existe")
    void update_throwsException_whenNotFound() {
        assertThatThrownBy(() -> filamentProfileService.update(UUID.randomUUID(), buildValidRequest("X")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete() elimina el filamento correctamente")
    void delete_removesFilamentFromDB() {
        FilamentProfileResponseDTO created = filamentProfileService.create(buildValidRequest("Para borrar"));

        filamentProfileService.delete(created.getId());

        assertThat(filamentProfileRepository.existsById(created.getId())).isFalse();
    }

    @Test
    @DisplayName("delete() lanza RuntimeException al eliminar ID inexistente")
    void delete_throwsException_whenNotFound() {
        assertThatThrownBy(() -> filamentProfileService.delete(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }
}
