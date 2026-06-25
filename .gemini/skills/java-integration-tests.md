---
name: java-integration-tests
description: Guidance for writing integration tests in this Spring Boot + SQLite project (printly). Use when writing or reviewing tests for any service in the backend. Covers the real-DB pattern (@SpringBootTest without mocks), flush/clear lifecycle, Hibernate timestamp quirks, and what's worth testing vs what isn't.
---

# Integration Testing — printly Backend

## Stack

- **Spring Boot 3.3.0** + **Spring Data JPA**
- **SQLite** via `org.xerial:sqlite-jdbc` + `hibernate-community-dialects`
- **JUnit 5** + **AssertJ** (incluidos en `spring-boot-starter-test`)
- **Lombok** (entidades y DTOs usan `@Builder`)
- **Sin Mockito** en tests de integración — se usa la BD real

---

## Estructura de tests: integración real, no mocks

Todos los tests del backend son de integración Service → Repository → SQLite.
**No usar mocks para repositorios ni servicios**. El objetivo es verificar el contrato completo.

```java
@SpringBootTest          // levanta el contexto Spring completo
@ActiveProfiles("test")  // usa src/test/resources/application-test.properties
@Transactional           // rollback automático al final de cada test
@DisplayName("MiServicio — Integration Tests")
class MiServicioIntegrationTest {

    @Autowired
    private MiServicio miServicio;        // el servicio real

    @Autowired
    private MiRepository miRepository;   // repositorio real (para asserts directos en BD)

    @Autowired
    private EntityManager entityManager;  // necesario para flush/clear

    @BeforeEach
    void setUp() {
        miRepository.deleteAll(); // tabla limpia antes de cada test
    }
}
```

**¿Por qué `@Transactional` en el test?**  
Hace rollback automático al terminar cada test. No necesitás limpiar manualmente el estado al final. El `deleteAll()` en `@BeforeEach` limpia el estado inicial (que puede haber quedado de `@PostConstruct` o seeds).

---

## Configuración de test

`src/test/resources/application-test.properties`:

```properties
# SQLite archivo temporal — Windows no soporta jdbc:sqlite::memory:?cache=shared
spring.datasource.url=jdbc:sqlite:./build/test-studio.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=create-drop  # recrea el schema en cada run
spring.jpa.show-sql=false
studio.base-path=.
```

> ⚠️ **No usar** `jdbc:sqlite::memory:?cache=shared` en Windows — el `?` es interpretado como parte del nombre de archivo y falla el arranque del contexto.

---

## El patrón flush+clear para timestamps

`@CreationTimestamp` y `@UpdateTimestamp` de Hibernate se populan **en el flush**, no en el `save()`. El objeto Java devuelto por `repository.save()` dentro de una transacción sin flush tiene esos campos en `null`.

### ❌ Así NO funciona

```java
@Test
void create_setsTimestamp() {
    PerfilResponseDTO result = perfilService.create(buildRequest("Test"));

    // FALLA: creadoEn es null porque Hibernate todavía no hizo flush
    assertThat(result.getCreadoEn()).isNotNull();
}
```

### ✅ Así SÍ funciona

```java
@Test
void create_persistsWithAllFieldsAndTimestamp() {
    PerfilResponseDTO created = perfilService.create(buildRequest("Test"));

    // Forzar flush a BD y limpiar el primer nivel de caché
    entityManager.flush();
    entityManager.clear();

    // Re-leer desde BD — ahora sí tiene los timestamps
    PerfilResponseDTO reloaded = perfilService.findById(created.getId());

    assertThat(reloaded.getCreadoEn()).isNotNull();
    assertThat(reloaded.getActualizadoEn()).isNotNull();
}
```

**Regla:** si un test necesita verificar timestamps, siempre hacer `flush()` + `clear()` antes del assert.  
**Ventaja extra:** fusionar el test de persistencia de campos con el de timestamps — un solo test verifica ambas cosas.

---

## Qué tests tienen valor real

### ✅ Vale la pena testear

| Escenario | Por qué |
|---|---|
| `create()` persiste todos los campos correctamente | Verifica el mapeo DTO → Entity → DTO completo |
| `update()` modifica los campos esperados | Verifica que el service escribe sobre el registro correcto |
| `findById()` / `delete()` lanzan excepción con ID inexistente | Verifica nuestra lógica de error, no JPA |
| Ordenamiento DESC en queries con `findTop50By...OrderBy...` | Verifica la query custom del repositorio |
| Límite de 50 en historial | Verifica el `findTop50` de Spring Data |
| Campos opcionales con default (null → 0) | Verifica lógica de negocio propia del servicio |
| Persistencia de `imagenBase64` (campo TEXT grande) | Verifica que SQLite no trunca el campo |
| FK entre entidades (resolución de nombres) | Verifica el join / lookup real entre tablas |
| Comportamiento graceful ante FK inválida | Verifica que el service no explota con ID de perfil inexistente |
| `initDefaultAjustes()` es idempotente | Verifica nuestra lógica de singleton |
| `getAjustes()` sin datos devuelve defaults (no lanza) | Verifica el fallback hardcoded del service |

### ❌ No vale la pena testear

| Escenario | Por qué no |
|---|---|
| `findAll()` devuelve lista vacía en tabla vacía | Comportamiento del framework JPA, no nuestro código |
| `deleteById()` no lanza cuando el ID no existe | Contrato de Spring Data, no lógica nuestra |
| `deleteAll()` sobre tabla vacía no lanza | Ídem |
| `delete(A)` no afecta a `B` | `DELETE WHERE id = ?` de SQL. Obvio. |
| `findById()` happy path cuando `create()` ya lo cubre | Duplicado — si create pasa y luego findById falla, hay algo muy raro |
| Testear `null` en campo si no hay transformación | Si no hay lógica, no hay nada que testear |

---

## Nomenclatura y estructura

```java
// Nombre: verbo_escenario_resultado
void create_persistsAllFieldsAndTimestamp() { ... }
void findById_throwsRuntimeException_whenNotFound() { ... }
void guardarCalculo_defaultsNullOptionalFieldsToZero() { ... }
void getHistorial_returnsAtMost50Items() { ... }
```

Estructura interna con comentarios de fase cuando el test tiene setup no trivial:

```java
@Test
void update_modifiesAllFields() {
    // given
    PerfilResponseDTO created = perfilService.create(buildRequest("Original"));

    // when
    PerfilResponseDTO updated = perfilService.update(created.getId(), buildRequest("Actualizado"));

    // then
    assertThat(updated.getNombre()).isEqualTo("Actualizado");
}
```

Para tests simples sin setup, los comentarios son opcionales — no agregar ruido innecesario.

---

## Helper builders en los tests

Usar métodos privados para construir datos de prueba. Si el test necesita crear entidades reales de entidades relacionadas (FK), hacerlo directamente via repositorio:

```java
// Para DTOs de entrada
private PerfilRequestDTO buildRequest(String nombre) {
    PerfilRequestDTO dto = new PerfilRequestDTO();
    dto.setNombre(nombre);
    dto.setModeloImpresora("Prusa MK3S");
    dto.setConsumoW(100.0);
    // ... resto de campos con valores plausibles
    return dto;
}

// Para entidades relacionadas (FK reales en BD)
private Perfil createRealPerfil(String nombre) {
    return perfilRepository.save(
        Perfil.builder()
            .nombre(nombre)
            .modeloImpresora("Prusa MK3S")
            .consumoW(100.0)
            // ... campos requeridos
            .build()
    );
}
```

**Regla:** usar valores plausibles y concretos, no "foo" / "bar" / "test". El nombre del perfil debe ser el de una impresora real.

---

## Casos completos de referencia

### Servicio con lógica propia (CalculoService)

```java
@Test
void guardarCalculo_persistsAllFieldsAndTimestamp() {
    calculoService.guardarCalculo(buildValidRequest("Prusa MK3S"));
    entityManager.flush();
    entityManager.clear();

    List<CalculoResponseDTO> historial = calculoService.getHistorial();
    assertThat(historial).hasSize(1);
    CalculoResponseDTO saved = historial.get(0);

    assertThat(saved.getId()).isNotNull();
    assertThat(saved.getTimestamp()).isNotNull();
    assertThat(saved.getPerfilNombre()).isEqualTo("Prusa MK3S");
    assertThat(saved.getCostoEnergia()).isEqualTo(45.0);
    assertThat(saved.getPrecioVenta()).isEqualTo(3283.5);
}

@Test
void guardarCalculo_defaultsNullOptionalFieldsToZero() {
    CalculoRequestDTO req = buildValidRequest("Test");
    req.setMinutosAdicionales(null);
    req.setInsumosExtra(null);

    CalculoResponseDTO result = calculoService.guardarCalculo(req);

    assertThat(result.getMinutosAdicionales()).isEqualTo(0);
    assertThat(result.getInsumosExtra()).isEqualTo(0.0);
}

@Test
void getHistorial_returnsItemsInDescendingOrder() throws InterruptedException {
    calculoService.guardarCalculo(buildValidRequest("Primer cálculo"));
    Thread.sleep(50); // timestamps distintos dentro de la misma transacción de test
    calculoService.guardarCalculo(buildValidRequest("Segundo cálculo"));

    List<CalculoResponseDTO> historial = calculoService.getHistorial();

    assertThat(historial.get(0).getPerfilNombre()).isEqualTo("Segundo cálculo");
    assertThat(historial.get(1).getPerfilNombre()).isEqualTo("Primer cálculo");
}
```

### Entidad con FK reales (PiezaSTLService)

```java
@Test
void save_persistsPiezaWithAllProfiles_andResolvesNames() {
    // given — perfiles reales en BD
    Perfil perfil = createRealPerfil("Impresora Test");
    FilamentProfile filament = createRealFilament("PLA Blanco");
    PrintProfile print = createRealPrintProfile("Calidad Media");

    PiezaSTLRequestDTO req = buildMinimalRequest("vasija");
    req.setPerfilImpresoraId(perfil.getId().toString());
    req.setPerfilFilamentoId(filament.getId().toString());
    req.setPerfilImpresionId(print.getId().toString());

    // when
    PiezaSTLResponseDTO result = piezaSTLService.save(req);

    // then — el service resuelve los nombres via lookup real en BD
    assertThat(result.getPerfilImpresoraNombre()).isEqualTo("Impresora Test");
    assertThat(result.getPerfilFilamentoNombre()).isEqualTo("PLA Blanco");
    assertThat(result.getPerfilImpresionNombre()).isEqualTo("Calidad Media");
}

@Test
void save_withInvalidPerfilId_savedWithNullPerfil() {
    // El service hace lookup graceful — no debe explotar si el UUID no existe
    PiezaSTLRequestDTO req = buildMinimalRequest("pieza_sin_perfil");
    req.setPerfilImpresoraId(UUID.randomUUID().toString());

    PiezaSTLResponseDTO result = piezaSTLService.save(req);

    assertThat(result.getId()).isNotNull();
    assertThat(result.getPerfilImpresoraNombre()).isNull();
}
```

### Singleton con upsert (AjustesService)

```java
@Test
void initDefaultAjustes_isIdempotent() {
    ajustesService.initDefaultAjustes();
    ajustesService.initDefaultAjustes(); // doble llamada

    assertThat(ajustesRepository.count()).isEqualTo(1);
}

@Test
void updateAjustes_persistsNewValues() {
    ajustesService.initDefaultAjustes();

    ajustesService.updateAjustes(AjustesDTO.builder()
            .preciokWh(120.0)
            .margenError(15.0)
            .build());

    AjustesDTO persisted = ajustesService.getAjustes();
    assertThat(persisted.getPreciokWh()).isEqualTo(120.0);
    assertThat(persisted.getMargenError()).isEqualTo(15.0);
}
```

---

## Comandos

```powershell
# Correr todos los tests de integración
.\gradlew.bat test --tests "com.printly.studio.*"

# Correr solo una clase
.\gradlew.bat test --tests "com.printly.studio.domain.calculo.CalculoServiceIntegrationTest"

# Ver el reporte HTML detallado
start .\build\reports\tests\test\index.html
```

> ⚠️ PowerShell reporta exit code 1 si hay output en stderr (el warning de JVM sobre classpath). Ignorarlo si el output dice `BUILD SUCCESSFUL`.

---

## Checklist antes de escribir un test

1. ✅ ¿Hay lógica de negocio propia del servicio a cubrir, o es solo comportamiento JPA/SQL?
2. ✅ ¿El test requiere verificar timestamps? → Agregar `flush()` + `clear()` antes del assert.
3. ✅ ¿Necesitás entidades relacionadas (FK)? → Crearlas con `createReal*()` via repositorio.
4. ✅ ¿Estás testeando el mismo comportamiento que otro test pero con distinto nombre? → Eliminarlo.
5. ✅ ¿El `@BeforeEach` limpia la tabla que usás? → Si el servicio tiene `@PostConstruct`, limpiar explícitamente al inicio del test también.
6. ✅ Usás AssertJ (`assertThat`, `assertThatThrownBy`) en lugar de JUnit assertions.
7. ✅ El nombre del test describe escenario + resultado esperado en `lower_snake_case`.
