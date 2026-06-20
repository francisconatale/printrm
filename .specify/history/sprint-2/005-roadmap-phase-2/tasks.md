# Tasks: Gestión Comercial, Stock & Finanzas

**Input**: Design documents from `.specify/specs/005-roadmap-phase-2/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md (v2)

## Phase 2: Foundational (Extended) 🏗️

- [x] T001 Implement `Cliente` Entity/Repo
- [x] T002 Implement `Pedido` & `ItemPedido` Entities/Repos
- [x] T003 Implement `Producto` Entity (Composed of `PiezaSTL`)
- [x] T004 Implement `Transaccion` Entity with `REEMBOLSO` support

---

## Phase 3: User Story 1 - Flujo de Pedidos & CRM (Priority: P1) 🎯 MVP

**Goal**: Crear pedidos vinculados a clientes y gestionar su ciclo de vida.

### Tests for User Story 1 ⚠️

- [x] T005 [US1] Integration test for Order Lifecycle (Passed)
- [x] T006 [US1] Integration test for Returns (DEVUELTO) and Balance consistency (Passed)

### Implementation for User Story 1

- [x] T007 [US1] PedidoService logic
- [x] T008 [US1] Implement automatic Financial Triggers in `PedidoService`
- [x] T008.1 [US1] Implement Idempotency Guard: Ensure Merma/Production expenses are only recorded once per item to avoid double-discounting.
- [x] T009 [US1] UI: `ClientesListView.tsx` and `ClienteForm.tsx`
- [x] T010 [US1] UI: `PedidosListView.tsx` and `PedidoDetalleView.tsx`

---

## Phase 4: User Story 2 - Biblioteca de Productos & Stock 📦

**Goal**: Gestionar piezas en estantería (Stock) y productos de varias partes.

- [x] T011 [US2] Backend: `ProductoController` and `ProductoService`
- [x] T012 [US2] UI: `ProductosGalleryView.tsx` with stock counters
- [x] T013 [US2] UI: `ComposicionProductoForm.tsx` (Select multiple STL parts)

---

## Phase 5: User Story 3 - Negocio & Libro Diario 💰

- [x] T014 [US3] UI: `FinanzasDashboard.tsx` (Balance, Revenue, ROI)
- [x] T015 [US3] UI: `RegistrarMermaModal.tsx` (Manually log failed prints)

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T018 [US3] Backend/Electron: Human-friendly backend logging filters and stack-trace truncation
- [x] T019 [US3] Bugfix SQLite CHECK constraint en transacciones para admitir REPUESTO


