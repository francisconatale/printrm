package com.printrm.studio.domain.biblioteca;

import com.printrm.studio.domain.perfil.*;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("PiezaSTLService — Integration Tests")
class PiezaSTLServiceIntegrationTest {

    @Autowired
    private PiezaSTLService piezaSTLService;

    @Autowired
    private PiezaSTLRepository piezaSTLRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private FilamentProfileRepository filamentProfileRepository;

    @Autowired
    private PrintProfileRepository printProfileRepository;

    @Autowired
    private EntityManager entityManager;

    @BeforeEach
    void setUp() {
        piezaSTLRepository.deleteAll();
        perfilRepository.deleteAll();
        filamentProfileRepository.deleteAll();
        printProfileRepository.deleteAll();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private PiezaSTLRequestDTO buildMinimalRequest(String nombre) {
        PiezaSTLRequestDTO dto = new PiezaSTLRequestDTO();
        dto.setNombre(nombre);
        dto.setFilePath(nombre.toLowerCase().replace(" ", "_") + ".stl");
        return dto;
    }

    private Perfil createRealPerfil(String nombre) {
        return perfilRepository.save(Perfil.builder()
                .nombre(nombre).modeloImpresora("Prusa MK3S")
                .consumoW(100.0).vidaUtilHoras(1000.0).costoRepuestos(5000.0)
                .filamentoPorKg(15000.0).nozzleDiameter(0.4)
                .bedShape("0x0,250x0,250x210,0x210").maxPrintHeight(210.0)
                .build());
    }

    private FilamentProfile createRealFilament(String nombre) {
        return filamentProfileRepository.save(FilamentProfile.builder()
                .nombre(nombre).material("PLA").filamentoPorKg(15000.0)
                .density(1.24).diameter(1.75).colour("#FFFFFF")
                .build());
    }

    private PrintProfile createRealPrintProfile(String nombre) {
        return printProfileRepository.save(PrintProfile.builder()
                .nombre(nombre).layerHeight(0.2).perimeters(3)
                .fillDensity("15%").speedPrint(60.0)
                .build());
    }

    // ─── SAVE ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("save() persiste pieza mínima, popula creadoEn y deja perfiles nulos")
    void save_persistsMinimalPieza() {
        PiezaSTLRequestDTO req = buildMinimalRequest("cubo_prueba");
        req.setPesoGramos(25.0);
        req.setTiempoEstimado("1h 30m");

        PiezaSTLResponseDTO result = piezaSTLService.save(req);
        entityManager.flush();
        entityManager.clear();

        PiezaSTLResponseDTO reloaded = piezaSTLService.getAll().get(0);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("cubo_prueba");
        assertThat(reloaded.getCreadoEn()).isNotNull();
        assertThat(result.getPerfilImpresoraNombre()).isNull();
        assertThat(result.getPerfilFilamentoNombre()).isNull();
        assertThat(result.getPerfilImpresionNombre()).isNull();
    }

    @Test
    @DisplayName("save() asocia los 3 perfiles reales via FK y resuelve sus nombres en el DTO")
    void save_persistsPiezaWithAllProfiles_andResolvesNames() {
        Perfil perfil = createRealPerfil("Impresora Test");
        FilamentProfile filament = createRealFilament("PLA Blanco");
        PrintProfile print = createRealPrintProfile("Calidad Media");

        PiezaSTLRequestDTO req = buildMinimalRequest("vasija");
        req.setPerfilImpresoraId(perfil.getId().toString());
        req.setPerfilFilamentoId(filament.getId().toString());
        req.setPerfilImpresionId(print.getId().toString());

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getPerfilImpresoraNombre()).isEqualTo("Impresora Test");
        assertThat(result.getPerfilFilamentoNombre()).isEqualTo("PLA Blanco");
        assertThat(result.getPerfilImpresionNombre()).isEqualTo("Calidad Media");
    }

    @Test
    @DisplayName("save() con perfilImpresoraId de UUID inexistente guarda la pieza sin lanzar excepción (graceful null)")
    void save_withInvalidPerfilId_savedWithNullPerfil() {
        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_sin_perfil");
        req.setPerfilImpresoraId(java.util.UUID.randomUUID().toString());

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getPerfilImpresoraNombre()).isNull();
    }

    @Test
    @DisplayName("save() persiste y recupera imagenBase64 de gran tamaño íntegramente (campo TEXT)")
    void save_persistsAndRecoversLargeImagenBase64() {
        String imagenBase64 = "data:image/png;base64," + "A".repeat(4096);

        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_con_foto");
        req.setImagenBase64(imagenBase64);

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getImagenBase64()).isEqualTo(imagenBase64);
        assertThat(result.getImagenBase64()).hasSize(imagenBase64.length());
    }

    // ─── GET ALL ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAll() devuelve las piezas en orden DESC por creadoEn")
    void getAll_returnsItemsInDescendingOrder() throws InterruptedException {
        piezaSTLService.save(buildMinimalRequest("primera"));
        Thread.sleep(50);
        piezaSTLService.save(buildMinimalRequest("segunda"));

        List<PiezaSTLResponseDTO> result = piezaSTLService.getAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getNombre()).isEqualTo("segunda");
        assertThat(result.get(1).getNombre()).isEqualTo("primera");
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete() elimina la pieza de la base de datos")
    void delete_removesPiezaFromDB() {
        PiezaSTLResponseDTO saved = piezaSTLService.save(buildMinimalRequest("para_borrar"));

        piezaSTLService.delete(saved.getId());

        assertThat(piezaSTLRepository.existsById(saved.getId())).isFalse();
    }
}
