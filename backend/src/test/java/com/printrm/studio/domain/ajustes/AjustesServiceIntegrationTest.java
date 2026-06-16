package com.printrm.studio.domain.ajustes;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("AjustesService — Integration Tests")
class AjustesServiceIntegrationTest {

    @Autowired
    private AjustesService ajustesService;

    @Autowired
    private AjustesRepository ajustesRepository;

    @BeforeEach
    void setUp() {
        ajustesRepository.deleteAll();
    }

    @Test
    @DisplayName("initDefaultAjustes() crea registro con valores por defecto cuando la tabla está vacía")
    void initDefaultAjustes_createsDefaultRecord_whenTableIsEmpty() {
        // El @PostConstruct ya habrá corrido; limpiamos y volvemos a llamar manualmente
        ajustesRepository.deleteAll();
        ajustesService.initDefaultAjustes();

        AjustesDTO result = ajustesService.getAjustes();

        assertThat(result).isNotNull();
        assertThat(result.getPreciokWh()).isEqualTo(50.0);
        assertThat(result.getMargenError()).isEqualTo(10.0);
    }

    @Test
    @DisplayName("initDefaultAjustes() NO duplica el registro si ya existe")
    void initDefaultAjustes_doesNotDuplicate_whenRecordAlreadyExists() {
        ajustesService.initDefaultAjustes();
        ajustesService.initDefaultAjustes(); // segunda llamada

        assertThat(ajustesRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("getAjustes() devuelve los valores guardados")
    void getAjustes_returnsPersistedValues() {
        ajustesService.initDefaultAjustes();

        AjustesDTO result = ajustesService.getAjustes();

        assertThat(result.getPreciokWh()).isEqualTo(50.0);
        assertThat(result.getMargenError()).isEqualTo(10.0);
    }

    @Test
    @DisplayName("getAjustes() devuelve defaults hardcoded cuando no hay ningún registro")
    void getAjustes_returnsFallbackDefaults_whenNoRecord() {
        // No llamamos a init, la tabla está vacía tras setUp
        AjustesDTO result = ajustesService.getAjustes();

        assertThat(result).isNotNull();
        assertThat(result.getPreciokWh()).isEqualTo(50.0);
        assertThat(result.getMargenError()).isEqualTo(10.0);
    }

    @Test
    @DisplayName("updateAjustes() persiste correctamente los nuevos valores")
    void updateAjustes_persistsNewValues() {
        ajustesService.initDefaultAjustes();

        AjustesDTO update = AjustesDTO.builder()
                .preciokWh(120.0)
                .margenError(15.0)
                .build();

        AjustesDTO result = ajustesService.updateAjustes(update);

        assertThat(result.getPreciokWh()).isEqualTo(120.0);
        assertThat(result.getMargenError()).isEqualTo(15.0);

        // Verificar que persiste leyendo de nuevo
        AjustesDTO persisted = ajustesService.getAjustes();
        assertThat(persisted.getPreciokWh()).isEqualTo(120.0);
        assertThat(persisted.getMargenError()).isEqualTo(15.0);
    }

    @Test
    @DisplayName("updateAjustes() crea registro si no existe (upsert implícito)")
    void updateAjustes_createsRecord_whenNotExists() {
        // tabla vacía — no hay registro previo
        AjustesDTO update = AjustesDTO.builder()
                .preciokWh(75.0)
                .margenError(5.0)
                .build();

        AjustesDTO result = ajustesService.updateAjustes(update);

        assertThat(result.getPreciokWh()).isEqualTo(75.0);
        assertThat(ajustesRepository.count()).isEqualTo(1);
    }
}
