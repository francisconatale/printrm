package com.printly.studio.domain.ajustes;

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
    @DisplayName("initDefaultAjustes() es idempotente: doble llamada no duplica el registro")
    void initDefaultAjustes_isIdempotent() {
        ajustesService.initDefaultAjustes();
        ajustesService.initDefaultAjustes();

        assertThat(ajustesRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("getAjustes() devuelve defaults hardcoded cuando la tabla está vacía (sin lanzar excepción)")
    void getAjustes_returnsFallbackDefaults_whenNoRecord() {
        AjustesDTO result = ajustesService.getAjustes();

        assertThat(result).isNotNull();
        assertThat(result.getPreciokWh()).isEqualTo(50.0);
        assertThat(result.getMargenError()).isEqualTo(10.0);
    }

    @Test
    @DisplayName("updateAjustes() persiste nuevos valores y los devuelve en el siguiente get")
    void updateAjustes_persistsNewValues() {
        ajustesService.initDefaultAjustes();

        AjustesDTO update = AjustesDTO.builder()
                .preciokWh(120.0)
                .margenError(15.0)
                .build();

        ajustesService.updateAjustes(update);

        AjustesDTO persisted = ajustesService.getAjustes();
        assertThat(persisted.getPreciokWh()).isEqualTo(120.0);
        assertThat(persisted.getMargenError()).isEqualTo(15.0);
    }

    @Test
    @DisplayName("updateAjustes() crea registro si no existe (upsert implícito en tabla vacía)")
    void updateAjustes_createsRecord_whenNotExists() {
        AjustesDTO update = AjustesDTO.builder()
                .preciokWh(75.0)
                .margenError(5.0)
                .build();

        ajustesService.updateAjustes(update);

        assertThat(ajustesRepository.count()).isEqualTo(1);
        assertThat(ajustesService.getAjustes().getPreciokWh()).isEqualTo(75.0);
    }
}
