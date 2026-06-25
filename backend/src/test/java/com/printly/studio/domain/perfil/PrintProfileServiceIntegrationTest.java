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
@DisplayName("PrintProfileService — Integration Tests")
class PrintProfileServiceIntegrationTest {

    @Autowired
    private PrintProfileService printProfileService;

    @Autowired
    private PrintProfileRepository printProfileRepository;

    @Autowired
    private EntityManager entityManager;

    private PrintProfileRequestDTO buildValidRequest(String nombre) {
        return new PrintProfileRequestDTO(
                nombre,
                0.2,    // layerHeight
                3,      // perimeters
                "15%",  // fillDensity
                60.0    // speedPrint mm/s
        );
    }

    @BeforeEach
    void setUp() {
        printProfileRepository.deleteAll();
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create() persiste el perfil de impresión con todos sus campos y asigna timestamps")
    void create_persistsPrintProfileWithAllFields() {
        PrintProfileResponseDTO created = printProfileService.create(buildValidRequest("Calidad Media"));
        entityManager.flush();
        entityManager.clear();

        PrintProfileResponseDTO reloaded = printProfileService.findById(created.getId());

        assertThat(reloaded.getId()).isNotNull();
        assertThat(reloaded.getNombre()).isEqualTo("Calidad Media");
        assertThat(reloaded.getLayerHeight()).isEqualTo(0.2);
        assertThat(reloaded.getPerimeters()).isEqualTo(3);
        assertThat(reloaded.getFillDensity()).isEqualTo("15%");
        assertThat(reloaded.getSpeedPrint()).isEqualTo(60.0);
        assertThat(reloaded.getCreadoEn()).isNotNull();
        assertThat(printProfileRepository.count()).isEqualTo(1);
    }

    // ─── FIND BY ID ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById() lanza RuntimeException si no existe")
    void findById_throwsException_whenNotFound() {
        assertThatThrownBy(() -> printProfileService.findById(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("update() modifica todos los campos correctamente")
    void update_modifiesAllFields() {
        PrintProfileResponseDTO created = printProfileService.create(buildValidRequest("Borrador"));

        PrintProfileRequestDTO updateReq = new PrintProfileRequestDTO(
                "Alta Calidad", 0.1, 5, "20%", 40.0
        );

        PrintProfileResponseDTO updated = printProfileService.update(created.getId(), updateReq);

        assertThat(updated.getNombre()).isEqualTo("Alta Calidad");
        assertThat(updated.getLayerHeight()).isEqualTo(0.1);
        assertThat(updated.getPerimeters()).isEqualTo(5);
        assertThat(updated.getSpeedPrint()).isEqualTo(40.0);
    }

    @Test
    @DisplayName("update() lanza RuntimeException si el ID no existe")
    void update_throwsException_whenNotFound() {
        assertThatThrownBy(() -> printProfileService.update(UUID.randomUUID(), buildValidRequest("X")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete() elimina el perfil de impresión correctamente")
    void delete_removesProfileFromDB() {
        PrintProfileResponseDTO created = printProfileService.create(buildValidRequest("Para borrar"));

        printProfileService.delete(created.getId());

        assertThat(printProfileRepository.existsById(created.getId())).isFalse();
    }

    @Test
    @DisplayName("delete() lanza RuntimeException al eliminar ID inexistente")
    void delete_throwsException_whenNotFound() {
        assertThatThrownBy(() -> printProfileService.delete(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }
}
