# Plan de Resolución de Errores: Fase de Estabilización (Ajustado)

**Plan / Spec**: `.specify/specs/009-correcciones-errores/plan.md`
**Fecha**: 2026-06-20
**Estado**: Planificación

---

## 🎯 Resumen del Plan

Este plan aborda la resolución de los problemas prioritarios identificados, omitiendo las características descartadas (historial de cálculos, notas de clientes y campos adicionales de configuración en DTOs que fueron removidos/ajustados en sprints anteriores). El objetivo es estabilizar el backend mediante el control estricto de excepciones, seguridad frente a valores nulos, soporte correcto para actualizaciones parciales y solución a fallos en la persistencia local de archivos.

---

## 📌 Detalle de Soluciones

### 1. Robustez Global (Excepciones y Validación)
*   **#15, #17, #4:** Creación de un `GlobalExceptionHandler` anotado con `@ControllerAdvice`.
    *   Manejará `ResourceNotFoundException` (nueva excepción personalizada anotada con `@ResponseStatus(HttpStatus.NOT_FOUND)`).
    *   Manejará `IllegalArgumentException` y responderá con `400 Bad Request` (previniendo errores 500 al enviar UUIDs inválidos).
    *   Manejará `MethodArgumentNotValidException` para responder con un detalle amigable de los errores de validación.
*   **#16:** Añadir la anotación `@Valid` a todos los parámetros `@RequestBody` de los controladores para activar la validación de DTOs.
*   **#4:** Reemplazar `new RuntimeException("... no encontrado")` por `new ResourceNotFoundException("...")` en todos los Services.

### 2. Control de Errores 500 Reales (Críticos)
*   **#1 (TransaccionService):** Añadir validación de nulos en `mapToDouble(t -> t.getMonto() != null ? t.getMonto() : 0.0)`.
*   **#2 (PedidoService):** Verificar si `item.getCantidad()` es null antes del unboxing. Si es null, tratarlo como `0` o lanzar una excepción de validación.
*   **#3 (CostCalculationService):** Asegurar que `ajustes` y `ajustes.getPreciokWh()` no sean null (si lo son, usar un valor predeterminado como `0.0` o lanzar excepción si es requerido).
*   **#5 (ProductoService) y #8 (OrdenProduccionController):** Crear un método utilitario estático para validar y parsear UUIDs (evitar excepciones en `UUID.fromString(null)` o strings corruptos).
*   **#6 (PerfilService):** Modificar el método de actualización para aplicar merge condicional (solo setear campos si no son null en el DTO).
*   **#7 (PedidoService):** Validar si el string coincide con los nombres del enum `EstadoPedido` antes de hacer `valueOf()`.

### 3. Correcciones de Lógica y Persistencia
*   **#10 (ProductoService):** Realizar un `repository.findById(saved.getId()).orElse(saved)` después de `updateStock` para retornar la entidad fresca con sus lotes poblados.
*   **#11 (PiezaSTLService):** Propagar adecuadamente los errores de `Files.move()` lanzando una excepción controlada para evitar que la entidad se guarde si el archivo físico falla al moverse.

---

## 📅 Cronograma de Implementación y Commits

1.  **Paso 1 (Estructural):** `GlobalExceptionHandler` + `ResourceNotFoundException` + `@Valid` en controladores.
    *   *Commit:* `feat: handler de excepciones global y validaciones api`
2.  **Paso 2 (Null-Safety & UUIDs):** Corrección en TransaccionService, PedidoService, CostCalculationService y utilitario UUID.
    *   *Commit:* `fix: validaciones de nulos y control de UUIDs en servicios`
3.  **Paso 3 (Merge Updates & Enums & Files.move):** Lógica de actualización parcial en PerfilService, validación de enums de estados y propagación de errores de archivos en PiezaSTLService.
    *   *Commit:* `fix: actualizacion parcial de perfiles, validacion de estados y control de stl filesystem`
