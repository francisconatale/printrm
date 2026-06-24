# Tarea Actual: T003 - Desglose de Costo de Error en Transacciones y Calculadora

**Estado:** Completado

**Descripción:**
Desglosar el costo del margen de error como un campo separado (`costoError`) en el backend y frontend para evitar valores inconsistentes en el costo de material. El backend ya no incluye el error dentro de `costoFilamento`, sino que lo devuelve como `costoError`.

**Pasos:**
- [x] Backend: Agregar `costoError` a `CostCalculationResult` y `CalculoResponseDTO`.
- [x] Backend: Separar `costoError` en `CostCalculationService`.
- [x] Frontend: Agregar `costoError` a `calculo.types.ts`.
- [x] Frontend: Mostrar Margen de Error en `ResultadosBreakdown.tsx`.
- [x] Frontend: Incluir `costoError` en exportaciones (`export.utils.ts`).
