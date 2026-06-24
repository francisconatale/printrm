# Tasks (Frontend): Filtros de Fecha en Listas

**Scope**: Frontend-only — solo tareas marcadas **[FE]** del master `tasks.md`

---

## Phase 2: Foundational

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 [P] Crear `DateRangePicker` component en `frontend/src/components/ui/date-range-picker.tsx`
      - Popup calendario grid con `date-fns` (formateo, navegación entre meses)
      - Inputs de fecha editables (formato DD/MM/YYYY)
      - Botones de atajo: Hoy, Esta Semana, Este Mes, Últimos 30 Días
      - Estilo siguiendo `frontend/design-system.md` (Action Blue, sin sombras, border-radius tokens)
      - Props: `value: { desde?: Date; hasta?: Date }`, `onChange: (range) => void`
      - Sin dependencia de `<input type="date">` nativo del navegador
- [ ] T002 [P] Crear hook `useDateRange` en `frontend/src/components/ui/date-range-picker.tsx`
      - State local `{ fechaDesde?: string, fechaHasta?: string }` en ISO-8601
      - Handlers para atajos
      - Reseteo de página a 0 al cambiar el filtro
- [ ] T003 Integrar `DateRangePicker` en el layout compartido de vistas de listas
      - Barra de filtros sobre la tabla, antes del paginador

---

## Phase 3: User Story 1 - Transacciones (P1) 🎯 MVP

- [ ] T009 [P] Agregar `fechaDesde` y `fechaHasta` a `useGetTransacciones()` en `frontend/src/features/finanzas/api/finanzas.api.ts`
      Contract: `{"params": {"fechaDesde": "string", "fechaHasta": "string"}, "response": "PaginatedResponse<Transaccion>"}`
- [ ] T010 Integrar `DateRangePicker` en `TransaccionesView` en `frontend/src/features/finanzas/components/TransaccionesView.tsx`
- [ ] T011 Integrar `DateRangePicker` en `LibroDiarioView` en `frontend/src/features/finanzas/components/LibroDiarioView.tsx`

---

## Phase 4: User Story 2 - Ventas (P1)

- [ ] T015 [P] Agregar `fechaDesde` y `fechaHasta` a `useGetVentas()` en `frontend/src/features/ventas/api/ventas.api.ts`
      Contract: `{"params": {"fechaDesde": "string", "fechaHasta": "string"}, "response": "VentaResponse[]"}`
- [ ] T016 Integrar `DateRangePicker` en `VentasListView` en `frontend/src/features/ventas/components/VentasListView.tsx`

---

## Phase 5: User Story 3 - Pedidos (P2)

- [ ] T022 [P] Agregar `fechaDesde` y `fechaHasta` a `useGetPedidos()` en `frontend/src/features/pedidos/api/pedidos.api.ts`
      Contract: `{"params": {"fechaDesde": "string", "fechaHasta": "string"}, "response": "PaginatedResponse<Pedido>"}`
- [ ] T023 Integrar `DateRangePicker` en `PedidosListView` en `frontend/src/features/pedidos/components/PedidosListView.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T024 [P] Agregar estado "filtro activo" visual (badge o indicador) en el DateRangePicker cuando hay un rango seleccionado
- [ ] T025 [P] Agregar botón "Limpiar filtro" en DateRangePicker
- [ ] T026 [P] Resetear página a 0 cuando cambia el filtro de fecha en todas las vistas
- [ ] T027 Visual Compliance Review: verificar que DateRangePicker sigue el design system (Action Blue, sin sombras, tipografía correcta)
