package com.printrm.studio.domain.perfil;

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
                0.2,        // layerHeight
                3,          // perimeters
                "15%",      // fillDensity
                60.0        // speedPrint mm/s
        );
    }

    @BeforeEach
    void setUp() {
        printProfileRepository.deleteAll();
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create() persiste el perfil de impresión y devuelve DTO con ID")
    void create_persistsPrintProfileAndReturnsDTO() {
        PrintProfileResponseDTO result = printProfileService.create(buildValidRequest("Calidad Media"));

        assertThat(result.getId()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Calidad Media");
        assertThat(result.getLayerHeight()).isEqualTo(0.2);
        assertThat(result.getPerimeters()).isEqualTo(3);
        assertThat(result.getFillDensity()).isEqualTo("15%");
        assertThat(result.getSpeedPrint()).isEqualTo(60.0);
        assertThat(printProfileRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("create() asigna timestamps automáticamente")
    void create_setsTimestampsAutomatically() {
        PrintProfileResponseDTO created = printProfileService.create(buildValidRequest("Draft"));
        entityManager.flush();
        entityManager.clear();

        PrintProfileResponseDTO result = printProfileService.findById(created.getId());

        assertThat(result.getCreadoEn()).isNotNull();
        assertThat(result.getActualizadoEn()).isNotNull();
    }

    // ─── FIND ALL ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll() devuelve lista vacía cuando no hay datos")
    void findAll_returnsEmptyList_whenNoData() {
        assertThat(printProfileService.findAll()).isEmpty();
    }

    @Test
    @DisplayName("findAll() devuelve todos los perfiles de impresión")
    void findAll_returnsAllProfiles() {
        printProfileService.create(buildValidRequest("Draft"));
        printProfileService.create(buildValidRequest("Standard"));
        printProfileService.create(buildValidRequest("Fine"));

        List<PrintProfileResponseDTO> result = printProfileService.findAll();
        assertThat(result).hasSize(3);
    }

    // ─── FIND BY ID ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById() retorna el perfil correcto")
    void findById_returnsCorrectProfile() {
        PrintProfileResponseDTO created = printProfileService.create(buildValidRequest("Standard"));

        PrintProfileResponseDTO found = printProfileService.findById(created.getId());

        assertThat(found.getId()).isEqualTo(created.getId());
        assertThat(found.getNombre()).isEqualTo("Standard");
    }

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
                "Alta Calidad",
                0.1,  // layer height fino
                5,    // más perímetros
                "20%",
                40.0  // más lento = más calidad
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
