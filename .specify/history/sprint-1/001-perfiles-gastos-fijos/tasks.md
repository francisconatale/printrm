# Tasks: Perfiles y Gastos Fijos

**Input**: Design documents from `.specify/specs/001-perfiles-gastos-fijos/`

**Prerequisites**: plan.md, spec.md, Studio Constitution v3.1.0

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 (Create), US2 (Switch), US3 (Edit), US4 (Delete)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Core backend and API infrastructure.

- [x] T001 Update `Perfil` JPA Entity in `src/main/java/com/calc3d/domain/perfil/` to include `printConfig`, `filamentConfig`, `printerConfig`.
- [x] T002 Implement `PerfilRepository` with basic CRUD support.
- [x] T003 Create `PerfilRequestDTO` and `PerfilResponseDTO` with new Slicer config fields.
- [x] T004 Setup `PerfilService` with business logic and logic to list available `.ini` files from `backend/configs/`.

---

## Phase 2: Foundational (API & Service Layer)

**Purpose**: Establish the communication bridge.

- [x] T005 Implement `PerfilController` with REST endpoints (`/api/v1/perfiles`).
- [x] T005.1 Add endpoint `GET /api/v1/perfiles/configs` to list available `.ini` files for Print, Filament, and Printer.
- [x] T006 [P] Add unit tests for `PerfilService` (Mocking repository).
- [x] T007 [P] Add integration tests for `PerfilController` (MockMvc)

---

## Phase 3: User Story 1 - Create Profile 🎯 MVP

**Goal**: Allow users to save their first printer configuration.

### Implementation
- [x] T008 [P] [US1] Define `perfiles.api.ts` with TanStack Query hooks (`useGetPerfiles`, `useCreatePerfil`, `useGetSlicerConfigs`).
- [x] T009 [P] [US1] Create static printer models data in `modelos-impresora.ts`.
- [x] T010 [US1] Implement `PerfilForm.tsx` using React Hook Form and Zod, including Slicer config dropdowns.
- [x] T011 [US1] Implement autocompletion logic in `ModeloImpresoraSelect.tsx`.
- [x] T012 [US1] Integrate "New Profile" modal into the sidebar or dashboard header

---

## Phase 4: User Story 2 & 3 - Manage Profiles

**Goal**: Switching between and editing configurations.

### Implementation
- [x] T013 [US2] Implement `PerfilSelector.tsx` dropdown in the dashboard header
- [x] T014 [US2] Create `usePerfilActivo` context hook to share state between modules
- [x] T015 [US3] Implement edit mode for `PerfilForm.tsx` with TanStack Query mutation
- [x] T016 [US3] Add unsaved changes warning before switching profiles

---

## Phase 5: User Story 4 - Delete Profile

**Goal**: Allow system cleanup.

### Implementation
- [x] T017 [US4] Implement `DeletePerfilModal.tsx` for confirmation
- [x] T018 [US4] Implement `useDeletePerfil` mutation and history cleanup logic
- [x] T019 [US4] Add "Empty State" view when no profiles exist

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Studio Edition visual alignment.

- [x] T020 [P] Visual Compliance Review: Verify 1px hairline borders and monochromatic Ink accent in PerfilForm
- [x] T021 [P] Ensure financial figures in form follow monochromatic rules (no blue icons)
- [x] T022 Documentation: Update `studio-design-system.md` with Profile component specs

---

## Dependencies & Execution Order

1. **Backend Phase 1 & 2** are critical prerequisites for frontend features.
2. **Phase 3 (Create)** is the MVP starting point.
3. **Phase 4** enables full operational control.
