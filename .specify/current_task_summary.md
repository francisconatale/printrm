# Estado de Tarea: Implementación de T001 y T003

## Objetivo
Implementar el manejo global de excepciones, validaciones de API request body con `@Valid` y validación de UUIDs según T001 y T003.

## Tareas
- [x] T001: Implementar `ResourceNotFoundException`, `GlobalExceptionHandler`, `@Valid` en controladores, y refactorizar servicios para usar la nueva excepción.
- [x] T003: Crear la clase de utilidad `UUIDUtils.java`, refactorizar `ProductoService.java` y `OrdenProduccionController.java` para validar UUIDs de forma segura.

## Archivos Involucrados
- `.specify/current_task_summary.md`
- `backend/src/main/java/com/printrm/studio/exception/ResourceNotFoundException.java`
- `backend/src/main/java/com/printrm/studio/exception/GlobalExceptionHandler.java`
- `backend/src/main/java/com/printrm/studio/utils/UUIDUtils.java`
- Varios controladores bajo `backend/src/main/java/com/printrm/studio/domain/`
- Varios servicios bajo `backend/src/main/java/com/printrm/studio/domain/`
