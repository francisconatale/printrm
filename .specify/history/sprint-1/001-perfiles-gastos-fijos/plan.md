# Implementation Plan: Perfiles y Gastos Fijos

**Branch**: `001-perfiles-gastos-fijos` | **Date**: 2026-06-15 | **Constitution**: `.specify/constitution.md`

## Summary

Implementar el módulo de gestión de perfiles de impresora. Cubre la entidad `Perfil` en el backend Spring Boot (REST + JPA), y el panel de configuración en el frontend React con selector de perfiles, formulario de gastos fijos y autocompletado de modelos de impresora. Es la entidad fundacional: sin perfiles no hay cálculo.

---

## Casos de Uso

### CU-01 — Crear un perfil de impresora
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario selecciona "+ Nuevo perfil" en el selector
2. El sistema presenta el formulario de gastos fijos vacío (con defaults sugeridos)
3. El usuario ingresa nombre y completa los campos
4. El usuario presiona "Guardar perfil"
5. El sistema emite `POST /api/v1/perfiles` y lo selecciona como activo

**Flujo alternativo A — Autocompletado por modelo:**
En el paso 3, si el usuario selecciona un modelo de la lista estática, el campo "Consumo (W)" se autocompleta. El valor es sobreescribible.

**Flujo alternativo B — Cancelar:**
Antes del paso 4, el usuario puede cancelar. No se crea ningún perfil.

---

### CU-02 — Cambiar de perfil activo
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario abre el dropdown de perfiles
2. Selecciona un perfil diferente al activo
3. El sistema carga los valores del nuevo perfil en todos los campos
4. Si hay datos de pieza ingresados, el motor recalcula automáticamente

**Flujo alternativo — Cambios sin guardar:**
Si el perfil actual tiene cambios no guardados, el sistema muestra advertencia: "¿Descartar cambios?" con opción de guardar o descartar antes de continuar.

---

### CU-03 — Editar un perfil existente
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario modifica uno o más campos del perfil activo
2. El sistema recalcula en tiempo real si hay datos de pieza
3. El usuario presiona "Guardar perfil"
4. El sistema emite `PUT /api/v1/perfiles/{id}`

---

### CU-04 — Eliminar un perfil
**Actor:** Usuario | **Prioridad:** P2

**Flujo principal:**
1. El usuario selecciona "Eliminar perfil"
2. El sistema solicita confirmación modal
3. El usuario confirma
4. El sistema emite `DELETE /api/v1/perfiles/{id}` y selecciona el siguiente perfil disponible

**Flujo alternativo — Único perfil:**
Si era el único perfil, el sistema muestra el estado vacío ("Creá tu primer perfil").

---

## Objetivos del Módulo

**Objetivo principal:** Permitir guardar y reutilizar configuraciones de costos fijos, eliminando la necesidad de reingresar datos entre sesiones.

**Objetivos específicos:**
- Reducir la fricción de onboarding con autocompletado de consumo W por modelo
- Soportar múltiples impresoras / configuraciones de precio por usuario
- Servir como contexto global para el motor de cálculo

**Métricas de éxito:**
- Perfil nuevo configurable en menos de 2 minutos
- Cambio de perfil activo en ≤100ms
- Guardado vía API en ≤500ms round-trip

---

## Technical Context

**Stack:**
- Backend: Java 21, Spring Boot 3.x, Spring Data JPA, SQLite, Lombok
- Frontend: React 18, TypeScript, Tailwind CSS 3.4, React Hook Form, Zod, TanStack Query

**Testing:**
- Backend: JUnit 5 + Mockito (service), MockMvc (controller)
- Frontend: Vitest + React Testing Library, MSW para mockeo de API

**Performance:** Cambio de perfil ≤100ms. Guardado API ≤500ms.

---

## Constitution Check

- [x] **Data-First:** Formulario denso y funcional. Sin decoración.
- [x] **Hairline Borders:** Todos los inputs usan `border 0.5px #e0e0e0`.
- [x] **Typography:** Labels 17px/400, headers 24px/600 con tracking negativo.
- [x] **Full-Stack Integrity:** Persistencia exclusivamente en backend. Sin localStorage para perfiles.
- [x] **No Marketing Density:** Sin ilustraciones ni frases aspiracionales en el panel.

---

## Project Structure

### Backend
```text
src/main/java/com/calc3d/domain/perfil/
├── Perfil.java              # Entidad JPA
├── PerfilRepository.java    # Spring Data JPA
├── PerfilService.java       # Lógica de negocio
├── PerfilController.java    # REST Controller
├── PerfilRequestDTO.java    # DTO entrada (con validaciones @NotBlank, @Min)
└── PerfilResponseDTO.java   # DTO salida
```

### Frontend
```text
frontend/src/features/perfiles/
├── api/
│   └── perfiles.api.ts              # TanStack Query hooks
├── components/
│   ├── PerfilSelector.tsx           # Dropdown + "+ Nuevo"
│   ├── PerfilForm.tsx               # Formulario 7 campos
│   ├── ModeloImpresoraSelect.tsx    # Select con autocompletado W
│   └── DeletePerfilModal.tsx        # Modal confirmación
├── hooks/
│   └── usePerfilActivo.ts           # Estado global del perfil activo
├── data/
│   └── modelos-impresora.ts         # Lista estática de modelos + consumo W
└── types/
    └── perfil.types.ts              # Tipos TypeScript
```

---

## Key Entities

```typescript
interface Perfil {
  id: string;               // UUID — generado por backend
  nombre: string;           // max 50 chars
  creadoEn: string;         // ISO 8601
  actualizadoEn: string;
  filamentoPorKg: number;   // ARS
  preciokWh: number;        // ARS
  modeloImpresora: string;  // nombre del modelo o "personalizado"
  consumoW: number;         // Watts
  vidaUtilHoras: number;    // horas
  costoRepuestos: number;   // ARS
  margenError: number;      // porcentaje (ej: 5 → 5%)
}

interface ModeloImpresora {
  nombre: string;
  consumoW: number;
}
```

---

## API Endpoints (Spring Boot)

| Método | Endpoint | Descripción | Body |
|---|---|---|---|
| `GET` | `/api/v1/perfiles` | Listar todos los perfiles | — |
| `POST` | `/api/v1/perfiles` | Crear nuevo perfil | `PerfilRequestDTO` |
| `PUT` | `/api/v1/perfiles/{id}` | Actualizar perfil | `PerfilRequestDTO` |
| `DELETE` | `/api/v1/perfiles/{id}` | Eliminar perfil | — |

**Errores estándar:**
```json
{ "error": "Perfil no encontrado", "code": "PERFIL_NOT_FOUND" }
```

---

## Functional Requirements

| ID | Requisito |
|---|---|
| FR-001 | El sistema debe permitir crear perfiles con nombre (max 50 chars) |
| FR-002 | El sistema debe persistir perfiles vía `POST /api/v1/perfiles` |
| FR-003 | El sistema debe restaurar el último perfil activo al iniciar |
| FR-004 | El sistema debe proveer lista estática de modelos de impresora con W |
| FR-005 | Al seleccionar modelo, el campo consumo W debe autocompletarse |
| FR-006 | El campo autocompletado debe ser sobreescribible |
| FR-007 | El sistema debe advertir si hay cambios sin guardar al cambiar de perfil |
| FR-008 | El sistema debe pedir confirmación antes de eliminar un perfil |
| FR-009 | Los campos numéricos no deben aceptar valores negativos |
| FR-010 | Un campo numérico vacío se trata internamente como 0, sin error bloqueante |

---

## Complexity Tracking

| Decisión | Por qué | Alternativa rechazada |
|---|---|---|
| TanStack Query | Cache automático, invalidación post-mutación, loading/error states | fetch manual: más boilerplate sin beneficio |
| React Hook Form + Zod | Validación declarativa typesafe, integración nativa con TS | useState por campo: no escala con 7 campos |
| Lista de modelos estática en frontend | Sin overhead de API, actualizable via PR | Endpoint dedicado: overkill para datos que cambian raramente |
| SQLite | Zero config local, archivo único | H2/PostgreSQL: H2 es volátil por defecto y Postgres requiere instalación externa |

---

## Assumptions

- Sin autenticación en v1: todos los perfiles pertenecen a un único usuario implícito.
- La lista de modelos de impresora es estática y se mantiene en el frontend como array de constantes.
- Un solo perfil activo a la vez. No hay comparación side-by-side en v1.
- El `perfilActivoId` se mantiene en React Context (no en localStorage ni en backend).
