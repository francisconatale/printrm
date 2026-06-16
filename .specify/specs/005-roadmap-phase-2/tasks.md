# Tasks: Gestión de Clientes (CRM)

**Input**: Design documents from `.specify/specs/005-roadmap-phase-2/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 (Create), US2 (Library), US3 (Agenda), US4 (Share)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create project structure for clientes feature in backend and frontend
- [x] T002 Update build.gradle and package.json with needed dependencies (JPA, Three.js, etc.)

---

## Phase 2: Foundational (Blocking Prerequisites) 🏗️

**Purpose**: Core data infrastructure.

- [x] T003 [P] Implement `Cliente` JPA Entity in `backend/src/main/java/com/printrm/studio/domain/clientes/Cliente.java`
- [x] T004 Implement `ClienteRepository` in `backend/src/main/java/com/printrm/studio/domain/clientes/ClienteRepository.java`
- [x] T005 [P] Implement `ClienteRequestDTO` and `ClienteResponseDTO`
- [x] T006 Update `Calculo` entity in `backend/src/main/java/com/printrm/studio/domain/calculo/Calculo.java` to include `cliente_id` relationship

**Checkpoint**: Foundation ready - CRM logic can now begin.

---

## Phase 3: User Story 1 - Gestión de Clientes (Priority: P1) 🎯 MVP

**Goal**: CRUD completo de clientes para organizar la base comercial.

### Tests for User Story 1 ⚠️

- [ ] T007 [P] [US1] Integration test for Cliente CRUD in `backend/src/test/java/com/printrm/studio/domain/clientes/ClienteControllerTest.java`
- [ ] T008 [P] [US1] Unit tests for client validation in `frontend/src/features/clientes/utils/clientes.test.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Implement `ClienteService.java` with basic CRUD logic
- [ ] T010 [US1] Implement `ClienteController.java` with REST endpoints (`/api/v1/clientes`)
- [ ] T011 [P] [US1] Define `clientes.types.ts` and `clientes.api.ts` in `frontend/src/features/clientes/`
- [ ] T012 [US1] Create `ClientesListView.tsx` following Studio design (0.5px borders)
- [ ] T013 [US1] Implement `ClienteForm.tsx` modal for creation and editing
- [ ] T014 [US1] Add "Clientes" navigation item to `Sidebar.tsx`

**Checkpoint**: User Story 1 (CRM) fully functional.

---

## Phase 4: User Story 4 - Compartición de Presupuestos (Priority: P0)

**Goal**: Generar mensajes de WhatsApp profesionales desde el cotizador.

### Tests for User Story 4 ⚠️

- [ ] T015 [P] [US4] Unit tests for WhatsApp message formatting in `frontend/src/features/exportacion/utils/whatsapp.test.ts`

### Implementation for User Story 4

- [ ] T016 [P] [US4] Implement `whatsapp.utils.ts` for professional message formatting
- [ ] T017 [US4] Add "WhatsApp" button to `ResultadoPanel.tsx`
- [ ] T018 [US4] Integrate `Cliente` selection in `CalculadoraView.tsx` to include name in the message

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T016 [P] Visual Compliance Review: Verify hairline borders and monochromatic Ink accent in ClientesView
- [ ] T017 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

1. **Phase 2 (Foundational)** is CRITICAL and blocks CRM/Calculation integration.
2. **US1 (Clientes)** and **US4 (WhatsApp)** can be worked in parallel once Foundation is ready.
