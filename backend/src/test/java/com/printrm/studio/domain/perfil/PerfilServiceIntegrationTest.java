package com.printrm.studio.domain.perfil;

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
    @DisplayName("create() persiste el perfil y devuelve DTO con ID generado")
    void create_persistsPerfilAndReturnsDTO() {
        PerfilResponseDTO result = perfilService.create(buildValidRequest("Prusa MK3S"));

        assertThat(result.getId()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Prusa MK3S");
        assertThat(result.getModeloImpresora()).isEqualTo("Prusa MK3S");
        assertThat(result.getConsumoW()).isEqualTo(100.0);
        assertThat(perfilRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("create() asigna timestamps automáticamente")
    void create_setsTimestampsAutomatically() {
        PerfilResponseDTO result = perfilService.create(buildValidRequest("Ender 3"));

        assertThat(result.getCreadoEn()).isNotNull();
        assertThat(result.getActualizadoEn()).isNotNull();
    }

    // ─── FIND ALL ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll() devuelve lista vacía cuando no hay perfiles")
    void findAll_returnsEmptyList_whenNoData() {
        List<PerfilResponseDTO> result = perfilService.findAll();
        assertThat(result).isEmpty();
    }

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
    @DisplayName("findById() retorna el perfil correcto")
    void findById_returnsCorrectPerfil() {
        PerfilResponseDTO created = perfilService.create(buildValidRequest("Bambu X1"));

        PerfilResponseDTO found = perfilService.findById(created.getId());

        assertThat(found.getId()).isEqualTo(created.getId());
        assertThat(found.getNombre()).isEqualTo("Bambu X1");
    }

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
        assertThat(perfilRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("delete() lanza RuntimeException al eliminar ID inexistente")
    void delete_throwsRuntimeException_whenNotFound() {
        assertThatThrownBy(() -> perfilService.delete(UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("no encontrado");
    }

    @Test
    @DisplayName("delete() de uno solo no afecta los demás")
    void delete_doesNotAffectOtherPerfiles() {
        PerfilResponseDTO a = perfilService.create(buildValidRequest("A"));
        PerfilResponseDTO b = perfilService.create(buildValidRequest("B"));

        perfilService.delete(a.getId());

        assertThat(perfilRepository.count()).isEqualTo(1);
        assertThat(perfilRepository.existsById(b.getId())).isTrue();
    }
}
