# Estado de Tarea: Estabilización Completada (17 Problemas)

## Objetivo
Resolver y verificar todos los problemas críticos (errores 500), de lógica y estructurales en el backend de printrm.

## Tareas
- [x] T001: Implementar `ResourceNotFoundException`, `GlobalExceptionHandler`, `@Valid` en controladores, y refactorizar servicios para usar la nueva excepción.
- [x] T002: Resolver fallos de seguridad frente a nulos en `TransaccionService`, `PedidoService` y `CostCalculationService`.
- [x] T003: Crear la clase de utilidad `UUIDUtils.java`, refactorizar `ProductoService.java` y `OrdenProduccionController.java` para validar UUIDs de forma segura.
- [x] T004: Implementar merge condicional en `PerfilService.java`, validación de enums de estado en `PedidoService.java` y recarga fresca de entidad en `ProductoService.java`.
- [x] T005: Propagar errores de archivos en `PiezaSTLService.java` para asegurar rollback ante fallos en el almacenamiento físico de STLs.

## Archivos Involucrados
- `.specify/specs/009-correcciones-errores/plan.md`
- `.specify/specs/009-correcciones-errores/spec.md`
- `.specify/specs/009-correcciones-errores/tasks.md`
- `.specify/current_task_summary.md`
- `.gitignore` (untracking build folders)
- `backend/src/main/java/com/printrm/studio/exception/ResourceNotFoundException.java`
- `backend/src/main/java/com/printrm/studio/exception/GlobalExceptionHandler.java`
- `backend/src/main/java/com/printrm/studio/utils/UUIDUtils.java`
- `backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLService.java`
