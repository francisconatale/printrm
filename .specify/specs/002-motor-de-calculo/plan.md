# Implementation Plan: Motor de Cálculo (Backend-Powered)

**Branch**: `002-motor-de-calculo` | **Date**: 2026-06-15 | **Constitution**: `.specify/constitution.md`

## Domain Separation: Slicing Profiles

Para garantizar que PrusaSlicer genere resultados precisos, el dominio se divide en tres tipos de configuraciones independientes que se combinan al momento de slicear:

1.  **Impresora (Printer):** Dimensiones de la cama, diámetro de boquilla, límites cinemáticos.
2.  **Filamento (Filament):** Densidad (g/cm³), costo por kg, temperaturas.
3.  **Ajustes de Impresión (Print):** Altura de capa, relleno (infill), velocidad, soportes.

El backend almacenará estas configuraciones como archivos `.ini` independientes o entradas en la base de datos que se exportarán a `.ini` antes de invocar el CLI de PrusaSlicer.

---

## Casos de Uso Actualizados

### CU-05b — Seleccionar configuración de Slicing
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario selecciona un STL.
2. Selecciona un **Perfil de Impresora**, un **Perfil de Filamento** y un **Perfil de Impresión**.
3. El sistema envía los tres identificadores al backend.
4. El backend invoca a PrusaSlicer cargando los tres perfiles: `prusa-slicer --load print.ini --load filament.ini --load printer.ini`.
5. El resultado (tiempo/gramos) se asocia a la combinación seleccionada.

---

## Technical Context (Updated)

**Stack:**
- **Storage:** Los perfiles se guardan en `backend/configs/` organizados por carpetas: `print/`, `filament/`, `printer/`.

---

## Project Structure (Updated)

### Backend
```text
backend/configs/
├── print/
│   └── estandar.ini
├── filament/
│   └── pla_generico.ini
└── printer/
    └── ender_3.ini
```

### Frontend
```text
frontend/src/features/calculo/
├── components/
│   ├── SlicingConfigSelector.tsx  # Selectores para los 3 perfiles
...
```


### CU-06 — Cambiar el multiplicador de ganancia
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario modifica el multiplicador (default: 3).
2. El precio de venta se actualiza instantáneamente en el panel de resultados.
3. Se muestran referencias rápidas (3x, 4x, 5x) para facilitar la decisión.

---

## Objetivos del Módulo

**Objetivo principal:** Automatizar la obtención de métricas técnicas (tiempo/gramos) mediante integración con PrusaSlicer para garantizar la precisión del costo base.

**Objetivos específicos:**
- Integrar el endpoint `/api/slice` del backend wrapper.
- Implementar un flujo de carga de STL intuitivo.
- Mantener el cálculo financiero reactivo en el frontend.

---

## Technical Context

**Stack:**
- **Backend:** Spring Boot (PrusaSlicer Wrapper). Proporciona `/api/slice` para obtener metadatos de impresión.
- **Frontend:** React + TanStack Query para la comunicación con el backend. React Hook Form para la gestión de los inputs técnicos y financieros.

**Testing:**
- **Unit Tests (Vitest):** Validación de las fórmulas financieras en `calculos.utils.ts`.
- **E2E/Integration:** Verificación del flujo completo desde la carga del STL hasta la obtención de resultados.

---

## Constitution Check

- [x] **Backend Authority for Technicals:** Tiempo y gramos provienen del motor de slicing.
- [x] **Financial Real-Time:** Los cambios en multiplicador o insumos extra se reflejan sin latencia.
- [x] **Mono Font for ARS:** Todos los valores monetarios cumplen con la guía de estilo Studio.

---

## Project Structure

### Frontend
```text
frontend/src/features/calculo/
├── api/
│   └── slicer.api.ts              # Integración con Backend /api/slice
├── components/
│   ├── STLUpload.tsx              # Componente de carga de archivos
│   ├── PiezaForm.tsx              # Inputs técnicos (auto-filled) + financieros
│   └── ResultadoPanel.tsx         # Desglose y Precio Final
├── hooks/
│   └── useCalculo.ts              # Orquesta lógica de API y fórmulas
└── utils/
    └── calculos.utils.ts          # Fórmulas financieras puras
```

### Backend (PrusaSlicer Wrapper)
```text
src/main/java/com/prusaslicer/wrapper/
├── controller/SlicerController.java # API REST
└── service/SlicerService.java       # Lógica de ejecución de CLI
```

---

## Fórmulas Canónicas

El backend proporciona `estimatedTime` (string/H:M:S) y `filamentUsedG` (double).
El frontend transforma y aplica:

```typescript
// Costo Energía = (Consumo W / 1000) * Horas * Precio kWh
// Costo Filamento = (Gramos / 1000) * Precio Kg Filamento
// Precio Venta = Costo Base * Multiplicador
```

---

## Complexity Tracking

| Decisión | Por qué |
|---|---|
| Slicing en Backend | Precisión absoluta basada en perfiles de impresión reales (.ini). |
| Financiero en Frontend | Reactividad inmediata ante cambios de multiplicador o insumos. |
