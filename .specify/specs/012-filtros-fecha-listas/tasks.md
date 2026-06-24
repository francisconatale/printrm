# Tasks: Filtros de Fecha en Listas

**Input**: Design documents from `.specify/specs/012-filtros-fecha-listas/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Tests**: No se incluyen tareas de test a menos que se soliciten explícitamente.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] [FE/BE] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- **[FE]**: Frontend task | **[BE]**: Backend task
- Include exact file paths in descriptions

## File Splitting

| Archivo | Contenido |
|---------|-----------|
| `tasks.md` | Master: fases, dependencias, contratos, tareas compartidas |
| `tasks-be.md` | Solo tareas marcadas con **[BE]** |
| `tasks-fe.md` | Solo tareas marcadas con **[FE]** |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No se requiere setup de proyecto. El stack ya está configurado.

*Sin tareas en esta fase.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Componente DateRangePicker compartido y lógica base de filtros. DEBE completarse antes de cualquier user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 [P] [FE] Crear `DateRangePicker` component en `frontend/src/components/ui/date-range-picker.tsx`
      - Popup calendario grid con `date-fns` (formateo, navegación entre meses)
      - Inputs de fecha editables (formato DD/MM/YYYY)
      - Botones de atajo: Hoy, Esta Semana, Este Mes, Últimos 30 Días
      - Estilo siguiendo `frontend/design-system.md` (Action Blue, sin sombras, border-radius tokens)
      - Props: `value: { desde?: Date; hasta?: Date }`, `onChange: (range) => void`
      - Sin dependencia de `<input type="date">` nativo del navegador
- [ ] T002 [P] [FE] Crear hook `useDateRange` en `frontend/src/components/ui/date-range-picker.tsx`
      - State local `{ fechaDesde?: string, fechaHasta?: string }` en ISO-8601
      - Handlers para atajos
      - Reseteo de página a 0 al cambiar el filtro
- [ ] T003 [FE] Integrar `DateRangePicker` en el layout compartido de vistas de listas
      - Barra de filtros sobre la tabla, antes del paginador

**Checkpoint**: DateRangePicker funcional y listo para integrarse en vistas

---

## Phase 3: User Story 1 - Filtrar Transacciones por Rango de Fechas (P1) 🎯 MVP

**Goal**: Usuario puede filtrar transacciones por rango de fechas en TransaccionesView y LibroDiarioView.

**Independent Test**: Abrir Transacciones, seleccionar rango de fechas, verificar que solo se muestren transacciones en ese rango.

### Contract

```json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/transacciones",
      "params": { "fechaDesde": "string (ISO-8601, optional)", "fechaHasta": "string (ISO-8601, optional)", "page": "int", "size": "int", "clienteId": "UUID (optional)" },
      "response": "Page<Transaccion>",
      "errors": {}
    }
  ],
  "types": {
    "Transaccion": { "id": "UUID", "tipo": "enum", "categoria": "enum", "monto": "Double", "descripcion": "String", "fecha": "LocalDateTime", "pedidoId": "UUID", "grupoId": "UUID" }
  }
}
```

### Implementation for User Story 1

- [ ] T004 [P] [BE] Agregar método `findByFechaBetween` en `backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionRepository.java`
- [ ] T005 [P] [BE] Agregar método `findByClienteIdAndFechaBetween` en `TransaccionRepository.java`
- [ ] T006 [US1] [BE] Modificar `TransaccionService.getAll(Pageable, fechaDesde, fechaHasta)` en `backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionService.java` para aplicar filtro de fecha cuando se proporcionen los parámetros
- [ ] T007 [US1] [BE] Modificar `TransaccionService.getByCliente(UUID, Pageable, fechaDesde, fechaHasta)` en `TransaccionService.java` para aplicar filtro de fecha combinado con clienteId
- [ ] T008 [P] [US1] [BE] Agregar `@RequestParam(required = false) String fechaDesde, @RequestParam(required = false) String fechaHasta` en `TransaccionController.java`
      Contract: `{"params": {"fechaDesde": "ISO-8601", "fechaHasta": "ISO-8601"}, "response": "Page<Transaccion>"}`
- [ ] T009 [P] [US1] [FE] Agregar `fechaDesde` y `fechaHasta` a `useGetTransacciones()` en `frontend/src/features/finanzas/api/finanzas.api.ts`
      Contract: `{"params": {"fechaDesde": "string", "fechaHasta": "string"}, "response": "PaginatedResponse<Transaccion>"}`
- [ ] T010 [US1] [FE] Integrar `DateRangePicker` en `TransaccionesView` en `frontend/src/features/finanzas/components/TransaccionesView.tsx`
- [ ] T011 [US1] [FE] Integrar `DateRangePicker` en `LibroDiarioView` en `frontend/src/features/finanzas/components/LibroDiarioView.tsx`

**Checkpoint**: Transacciones y Libro Diario tienen filtro de fecha funcional

---

## Phase 4: User Story 2 - Filtrar Ventas por Rango de Fechas (P1)

**Goal**: Usuario puede filtrar ventas por rango de fechas en VentasListView.

**Independent Test**: Abrir Ventas, filtrar por fecha, ver solo ventas del período.

### Contract

```json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/ventas",
      "params": { "fechaDesde": "string (ISO-8601, optional)", "fechaHasta": "string (ISO-8601, optional)" },
      "response": "List<VentaResponse>",
      "errors": {}
    }
  ],
  "types": {
    "VentaResponse": { "grupoId": "String", "total": "Double", "fecha": "LocalDateTime", "items": "List<ItemVentaResponse>" }
  }
}
```

### Implementation for User Story 2

- [ ] T012 [P] [US2] [BE] Agregar método `findByTipoAndCategoriaAndFechaBetween` en `TransaccionRepository.java` (para filtrar INGRESO+VENTA por fecha antes de agrupar)
- [ ] T013 [US2] [BE] Modificar `VentaService.listar(fechaDesde, fechaHasta)` en `backend/src/main/java/com/printrm/studio/domain/venta/VentaService.java` para aceptar filtro de fecha y aplicarlo en la query
- [ ] T014 [P] [US2] [BE] Agregar `@RequestParam(required = false) String fechaDesde, @RequestParam(required = false) String fechaHasta` en `VentaController.java`
      Contract: `{"params": {"fechaDesde": "ISO-8601", "fechaHasta": "ISO-8601"}, "response": "List<VentaResponse>"}`
- [ ] T015 [P] [US2] [FE] Agregar `fechaDesde` y `fechaHasta` a `useGetVentas()` en `frontend/src/features/ventas/api/ventas.api.ts`
      Contract: `{"params": {"fechaDesde": "string", "fechaHasta": "string"}, "response": "VentaResponse[]"}`
- [ ] T016 [US2] [FE] Integrar `DateRangePicker` en `VentasListView` en `frontend/src/features/ventas/components/VentasListView.tsx`

**Checkpoint**: Ventas tiene filtro de fecha funcional

---

## Phase 5: User Story 3 - Filtrar Pedidos por Rango de Fechas (P2)

**Goal**: Usuario puede filtrar pedidos por fecha de creación en PedidosListView.

**Independent Test**: Abrir Pedidos, filtrar por "Últimos 30 días", ver solo pedidos del período.

### Contract

```json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/pedidos",
      "params": { "fechaDesde": "string (ISO-8601, optional)", "fechaHasta": "string (ISO-8601, optional)", "page": "int", "size": "int", "clienteId": "UUID (optional)" },
      "response": "Page<PedidoResponseDTO>",
      "errors": {}
    }
  ],
  "types": {
    "PedidoResponseDTO": { "id": "String", "clienteNombre": "String", "estado": "String", "total": "Double", "fechaCreacion": "LocalDateTime" }
  }
}
```

### Implementation for User Story 3

- [ ] T017 [P] [US3] [BE] Agregar método `findByFechaCreacionBetween` en `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoRepository.java`
- [ ] T018 [P] [US3] [BE] Agregar método `findByClienteIdAndFechaCreacionBetween` en `PedidoRepository.java`
- [ ] T019 [US3] [BE] Modificar `PedidoService.getAll(Pageable, fechaDesde, fechaHasta)` en `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java`
- [ ] T020 [US3] [BE] Modificar `PedidoService.getByCliente(UUID, Pageable, fechaDesde, fechaHasta)` en `PedidoService.java`
- [ ] T021 [P] [US3] [BE] Agregar `@RequestParam(required = false) String fechaDesde, @RequestParam(required = false) String fechaHasta` en `PedidoController.java`
      Contract: `{"params": {"fechaDesde": "ISO-8601", "fechaHasta": "ISO-8601"}, "response": "Page<PedidoResponseDTO>"}`
- [ ] T022 [P] [US3] [FE] Agregar `fechaDesde` y `fechaHasta` a `useGetPedidos()` en `frontend/src/features/pedidos/api/pedidos.api.ts`
      Contract: `{"params": {"fechaDesde": "string", "fechaHasta": "string"}, "response": "PaginatedResponse<Pedido>"}`
- [ ] T023 [US3] [FE] Integrar `DateRangePicker` en `PedidosListView` en `frontend/src/features/pedidos/components/PedidosListView.tsx`

**Checkpoint**: Pedidos tiene filtro de fecha funcional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan múltiples vistas y validación final.

- [ ] T024 [P] [FE] Agregar estado "filtro activo" visual (badge o indicador) en el DateRangePicker cuando hay un rango seleccionado
- [ ] T025 [P] [FE] Agregar botón "Limpiar filtro" en DateRangePicker
- [ ] T026 [P] [FE] Resetear página a 0 cuando cambia el filtro de fecha en todas las vistas
- [ ] T027 [FE] Visual Compliance Review: verificar que DateRangePicker sigue el design system (Action Blue, sin sombras, tipografía correcta)
- [ ] T028 Run quickstart.md validation: probar los 6 escenarios de validación

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies - puede empezar inmediatamente
- **US1 Transacciones (Phase 3)**: Depende de Phase 2 (DateRangePicker listo)
- **US2 Ventas (Phase 4)**: Depende de Phase 2 (DateRangePicker listo)
- **US3 Pedidos (Phase 5)**: Depende de Phase 2 (DateRangePicker listo)
- **Polish (Phase 6)**: Depende de todas las user stories completas

### Parallel Opportunities

| Tareas | Descripción |
|--------|-------------|
| T001, T002 | DateRangePicker + useDateRange hook (mismo archivo, secuencial) |
| T004, T005 | Métodos repository Transaccion (paralelo, diferentes métodos) |
| T008, T009 | Controller [BE] + API hook [FE] de Transacciones (paralelo, mismo contrato) |
| T012 | Repository query para Ventas (independiente) |
| T014, T015 | Controller [BE] + API hook [FE] de Ventas (paralelo, mismo contrato) |
| T017, T018 | Métodos repository Pedido (paralelo, diferentes métodos) |
| T021, T022 | Controller [BE] + API hook [FE] de Pedidos (paralelo, mismo contrato) |
| T010, T011, T016, T023 | Integración DateRangePicker en vistas (paralelo, diferentes archivos) |

### Implementation Strategy

1. **MVP (Phase 2 + Phase 3)**: DateRangePicker + filtro en Transacciones
2. **Incremental**: Agregar Ventas (Phase 4), luego Pedidos (Phase 5)
3. **Polish**: Ajustes finales y validación

### Total Tasks

- Master: 28 tasks
- Backend (`tasks-be.md`): 10 tasks
- Frontend (`tasks-fe.md`): 14 tasks
- Shared (modelos, setup): 4 tasks
