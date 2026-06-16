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
                15000.0,  // filamentoPorKg
                1.24,     // density g/cm³
                1.75,     // diameter mm
                "#FF5733"
        );
    }

    @BeforeEach
    void setUp() {
        filamentProfileRepository.deleteAll();
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create() persiste el filamento y devuelve DTO con ID")
    void create_persistsFilamentAndReturnsDTO() {
        FilamentProfileResponseDTO result = filamentProfileService.create(buildValidRequest("PLA Generic"));

        assertThat(result.getId()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("PLA Generic");
        assertThat(result.getMaterial()).isEqualTo("PLA");
        assertThat(result.getDensity()).isEqualTo(1.24);
        assertThat(result.getDiameter()).isEqualTo(1.75);
        assertThat(result.getColour()).isEqualTo("#FF5733");
        assertThat(filamentProfileRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("create() asigna timestamps automáticamente")
    void create_setsTimestampsAutomatically() {
        FilamentProfileResponseDTO created = filamentProfileService.create(buildValidRequest("ABS Generic"));
        entityManager.flush();
        entityManager.clear();

        FilamentProfileResponseDTO result = filamentProfileService.findById(created.getId());

        assertThat(result.getCreadoEn()).isNotNull();
        assertThat(result.getActualizadoEn()).isNotNull();
    }

    // ─── FIND ALL ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll() devuelve lista vacía cuando no hay datos")
    void findAll_returnsEmptyList_whenNoData() {
        assertThat(filamentProfileService.findAll()).isEmpty();
    }

    @Test
    @DisplayName("findAll() devuelve todos los filamentos")
    void findAll_returnsAllFilaments() {
        filamentProfileService.create(buildValidRequest("PLA"));
        filamentProfileService.create(buildValidRequest("PETG"));
        filamentProfileService.create(buildValidRequest("ABS"));

        List<FilamentProfileResponseDTO> result = filamentProfileService.findAll();

        assertThat(result).hasSize(3);
    }

    // ─── FIND BY ID ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById() retorna el filamento correcto")
    void findById_returnsCorrectFilament() {
        FilamentProfileResponseDTO created = filamentProfileService.create(buildValidRequest("PETG"));

        FilamentProfileResponseDTO found = filamentProfileService.findById(created.getId());

        assertThat(found.getId()).isEqualTo(created.getId());
        assertThat(found.getNombre()).isEqualTo("PETG");
    }

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
                "Actualizado",
                "PETG",
                20000.0,
                1.27,
                1.75,
                "#00FF00"
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
