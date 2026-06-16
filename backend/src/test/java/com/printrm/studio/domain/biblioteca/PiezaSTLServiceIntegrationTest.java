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

    // Repositorios para crear datos reales de perfiles
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

    // ─── Helper builders ─────────────────────────────────────────────────────

    private PiezaSTLRequestDTO buildMinimalRequest(String nombre) {
        PiezaSTLRequestDTO dto = new PiezaSTLRequestDTO();
        dto.setNombre(nombre);
        dto.setFilePath(nombre.toLowerCase().replace(" ", "_") + ".stl");
        return dto;
    }

    private Perfil createRealPerfil(String nombre) {
        Perfil perfil = Perfil.builder()
                .nombre(nombre)
                .modeloImpresora("Prusa MK3S")
                .consumoW(100.0)
                .vidaUtilHoras(1000.0)
                .costoRepuestos(5000.0)
                .filamentoPorKg(15000.0)
                .nozzleDiameter(0.4)
                .bedShape("0x0,250x0,250x210,0x210")
                .maxPrintHeight(210.0)
                .build();
        return perfilRepository.save(perfil);
    }

    private FilamentProfile createRealFilament(String nombre) {
        FilamentProfile filament = FilamentProfile.builder()
                .nombre(nombre)
                .material("PLA")
                .filamentoPorKg(15000.0)
                .density(1.24)
                .diameter(1.75)
                .colour("#FFFFFF")
                .build();
        return filamentProfileRepository.save(filament);
    }

    private PrintProfile createRealPrintProfile(String nombre) {
        PrintProfile print = PrintProfile.builder()
                .nombre(nombre)
                .layerHeight(0.2)
                .perimeters(3)
                .fillDensity("15%")
                .speedPrint(60.0)
                .build();
        return printProfileRepository.save(print);
    }

    // ─── SAVE sin perfiles ────────────────────────────────────────────────────

    @Test
    @DisplayName("save() persiste una pieza mínima sin perfiles asociados")
    void save_persistsMinimalPieza_withNoProfiles() {
        PiezaSTLRequestDTO req = buildMinimalRequest("cubo_prueba");
        req.setPesoGramos(25.0);
        req.setTiempoEstimado("1h 30m");

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("cubo_prueba");
        assertThat(result.getPesoGramos()).isEqualTo(25.0);
        assertThat(result.getTiempoEstimado()).isEqualTo("1h 30m");

        // Flush+clear para que Hibernate popule @CreationTimestamp en BD
        entityManager.flush();
        entityManager.clear();
        PiezaSTLResponseDTO reloaded = piezaSTLService.getAll().get(0);
        assertThat(reloaded.getCreadoEn()).isNotNull();

        // Nombres de perfiles nulos porque no hay asociaciones
        assertThat(result.getPerfilImpresoraNombre()).isNull();
        assertThat(result.getPerfilFilamentoNombre()).isNull();
        assertThat(result.getPerfilImpresionNombre()).isNull();

        assertThat(piezaSTLRepository.count()).isEqualTo(1);
    }

    // ─── SAVE con perfiles reales ─────────────────────────────────────────────

    @Test
    @DisplayName("save() persiste pieza con los 3 perfiles asociados y resuelve sus nombres")
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
    @DisplayName("save() con perfilImpresoraId inválido (UUID no existe) guarda la pieza con perfil null")
    void save_withInvalidPerfilId_savedWithNullPerfil() {
        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_sin_perfil");
        req.setPerfilImpresoraId(java.util.UUID.randomUUID().toString()); // ID que no existe en DB

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getId()).isNotNull();
        assertThat(result.getPerfilImpresoraNombre()).isNull(); // graceful null
    }

    // ─── SAVE con imagenBase64 ────────────────────────────────────────────────

    @Test
    @DisplayName("save() persiste y recupera correctamente imagenBase64 (campo TEXT grande)")
    void save_persistsAndRecoversImagenBase64() {
        // Simular una imagen base64 realista (~3KB de datos)
        String imagenBase64 = "data:image/png;base64," + "A".repeat(4096);

        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_con_foto");
        req.setImagenBase64(imagenBase64);

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getImagenBase64()).isEqualTo(imagenBase64);
        assertThat(result.getImagenBase64()).startsWith("data:image/png;base64,");
        assertThat(result.getImagenBase64()).hasSize(imagenBase64.length());
    }

    @Test
    @DisplayName("save() persiste correctamente una pieza sin imagenBase64 (campo opcional)")
    void save_withoutImagenBase64_setsFieldToNull() {
        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_sin_foto");
        req.setImagenBase64(null);

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getImagenBase64()).isNull();
    }

    // ─── GET ALL ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAll() devuelve lista vacía cuando no hay piezas")
    void getAll_returnsEmptyList_whenNoData() {
        assertThat(piezaSTLService.getAll()).isEmpty();
    }

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

    @Test
    @DisplayName("getAll() devuelve múltiples piezas correctamente")
    void getAll_returnsAllPiezas() {
        piezaSTLService.save(buildMinimalRequest("pieza_a"));
        piezaSTLService.save(buildMinimalRequest("pieza_b"));
        piezaSTLService.save(buildMinimalRequest("pieza_c"));

        assertThat(piezaSTLService.getAll()).hasSize(3);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete() elimina la pieza de la base de datos")
    void delete_removesPiezaFromDB() {
        PiezaSTLResponseDTO saved = piezaSTLService.save(buildMinimalRequest("para_borrar"));

        piezaSTLService.delete(saved.getId());

        assertThat(piezaSTLRepository.existsById(saved.getId())).isFalse();
        assertThat(piezaSTLRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("delete() de una pieza no afecta las demás")
    void delete_doesNotAffectOtherPiezas() {
        PiezaSTLResponseDTO a = piezaSTLService.save(buildMinimalRequest("pieza_a"));
        PiezaSTLResponseDTO b = piezaSTLService.save(buildMinimalRequest("pieza_b"));

        piezaSTLService.delete(a.getId());

        assertThat(piezaSTLRepository.count()).isEqualTo(1);
        assertThat(piezaSTLRepository.existsById(b.getId())).isTrue();
    }

    // ─── INTEGRIDAD REFERENCIAL ───────────────────────────────────────────────

    @Test
    @DisplayName("save() con solo perfilImpresora asociado resuelve solo ese nombre")
    void save_withOnlyPrinterProfile_resolvesOnlyPrinterName() {
        Perfil perfil = createRealPerfil("Solo Impresora");

        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_parcial");
        req.setPerfilImpresoraId(perfil.getId().toString());
        // filamento e impresión no se setean

        PiezaSTLResponseDTO result = piezaSTLService.save(req);

        assertThat(result.getPerfilImpresoraNombre()).isEqualTo("Solo Impresora");
        assertThat(result.getPerfilFilamentoNombre()).isNull();
        assertThat(result.getPerfilImpresionNombre()).isNull();
    }

    @Test
    @DisplayName("getAll() incluye los nombres de perfiles resueltos desde FK")
    void getAll_includesResolvedProfileNames() {
        Perfil perfil = createRealPerfil("Impresora FK Test");

        PiezaSTLRequestDTO req = buildMinimalRequest("pieza_fk");
        req.setPerfilImpresoraId(perfil.getId().toString());
        piezaSTLService.save(req);

        List<PiezaSTLResponseDTO> result = piezaSTLService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getPerfilImpresoraNombre()).isEqualTo("Impresora FK Test");
    }
}
