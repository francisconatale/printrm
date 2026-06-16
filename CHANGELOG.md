# CHANGELOG

## [2026-06-16] - Corrección de NoClassDefFoundError y Actualización de Workflow
### Descripción
- Se eliminó la anotación `@Builder` de los DTOs de solicitud para evitar errores de carga de clases por parte de Jackson (Lombok runtime issues).
- Se actualizaron las reglas de flujo de trabajo en `GEMINI.md` para incluir Resúmenes de Tarea y Registro de Cambios obligatorio.
- Se creó una plantilla para resúmenes de tarea.

### Archivos Involucrados
- `GEMINI.md`
- `CHANGELOG.md`
- `backend/src/main/java/com/printrm/studio/domain/perfil/FilamentProfileRequestDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/perfil/PrintProfileRequestDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/perfil/PerfilRequestDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/calculo/CalculoRequestDTO.java`
- `.specify/templates/task-summary-template.md`
