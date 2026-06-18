<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
.specify/specs/005-roadmap-phase-2/plan.md
<!-- SPECKIT END -->
## Reglas de Flujo (SpecKit)
- **Resumen de Tarea Obligatorio:** Antes de comenzar cualquier implementación, se debe crear o actualizar un archivo de "Estado de Tarea" (ej. `.specify/current_task_summary.md`) con un resumen minimalista.
- **Commit de Diseño (Pre-implementación):** Tras definir o actualizar los documentos de diseño (`plan.md`, `spec.md`, `tasks.md`), se debe realizar un commit con el prefijo `plan:` antes de iniciar la codificación.
- **Atomicidad por Tarea:** Cada tarea (ID de tarea ej. T001) debe tener su propio commit de implementación inmediatamente después de ser completada y validada. No se deben agrupar múltiples tareas en un solo commit.
- **Registro de Cambios (Changelog):** Después de cada cambio (o conjunto de cambios relacionados), se debe actualizar el archivo `CHANGELOG.md` en la raíz del proyecto. Cada entrada debe incluir:
    1. **Descripción:** Qué se cambió y por qué.
    2. **Archivos Involucrados:** Lista completa de rutas de archivos modificados, creados o eliminados.
    3. **Fecha:** Fecha del cambio.
<!-- SPECKIT END -->
