# Tasks: Historial y Exportación

**Input**: Design documents from `.specify/specs/003-historial-exportacion/`

**Prerequisites**: plan.md, spec.md, Studio Constitution v3.1.0, 002-motor-de-calculo (for data)

## Phase 1: Setup (Backend Persistence)

**Purpose**: Solidify history storage.

- [x] T001 Implement `CalculoRepository` with `findTop50ByOrderByTimestampDesc()` in Spring Boot
- [x] T002 Implement `DELETE /api/v1/calculos` (Clear History) and `DELETE /api/v1/calculos/{id}`
- [ ] T003 [P] Add integration tests for history endpoints

---

## Phase 2: User Story 9 & 10 - Fast Sharing 🎯 MVP

**Goal**: Enable immediate result utilization.

### Implementation
- [x] T004 [P] [US9] Implement `clipboard.utils.ts` (Simplified in `export.utils.ts`)
- [x] T005 [P] [US10] Implement `whatsapp.utils.ts` (Simplified in `export.utils.ts`)
- [x] T006 [US9] Create `AccionesResultado.tsx` (Integrated in `ResultadosBreakdown.tsx`)
- [x] T007 [US9] Create `CopiadoConfirmacion.tsx` (Transient Studio feedback in `ResultadosBreakdown.tsx`)

---

## Phase 3: User Story 8 - History Dashboard

**Goal**: Visual review of past calculations.

### Implementation
- [ ] T008 [P] [US8] Define `historial.api.ts` with TanStack Query hooks (`useGetHistorial`, `useDeleteHistory`)
- [ ] T009 [US8] Create `HistorialTable.tsx` using 1px Hairline separation and Mono fonts for ARS
- [ ] T010 [US8] Implement "Load Previous Calculation" logic to hydrate the motor from history

---

## Phase 4: User Story 11 & 12 - Export & Cleanup

**Goal**: Advanced data management.

### Implementation
- [x] T011 [P] [US11] Implement `csv.utils.ts` (Simplified in `export.utils.ts`)
- [x] T012 [US11] Add "Export CSV" action to UI
- [ ] T013 [US12] Implement `LimpiarHistorialModal.tsx` for confirmation
