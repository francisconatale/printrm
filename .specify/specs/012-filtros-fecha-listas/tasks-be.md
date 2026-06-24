# Tasks (Backend): Filtros de Fecha en Listas

**Scope**: Backend-only — solo tareas marcadas **[BE]** del master `tasks.md`

---

## Phase 2: Foundational

*Sin tareas [BE] en esta fase.*

---

## Phase 3: User Story 1 - Transacciones (P1) 🎯 MVP

- [ ] T004 [P] Agregar método `findByFechaBetween` en `backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionRepository.java`
- [ ] T005 [P] Agregar método `findByClienteIdAndFechaBetween` en `TransaccionRepository.java`
- [ ] T006 Modificar `TransaccionService.getAll(Pageable, fechaDesde, fechaHasta)` en `backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionService.java`
- [ ] T007 Modificar `TransaccionService.getByCliente(UUID, Pageable, fechaDesde, fechaHasta)` en `TransaccionService.java`
- [ ] T008 [P] Agregar `@RequestParam(required = false) String fechaDesde, @RequestParam(required = false) String fechaHasta` en `TransaccionController.java`
      Contract: `{"params": {"fechaDesde": "ISO-8601", "fechaHasta": "ISO-8601"}, "response": "Page<Transaccion>"}`

---

## Phase 4: User Story 2 - Ventas (P1)

- [ ] T012 [P] Agregar método `findByTipoAndCategoriaAndFechaBetween` en `TransaccionRepository.java`
- [ ] T013 Modificar `VentaService.listar(fechaDesde, fechaHasta)` en `backend/src/main/java/com/printrm/studio/domain/venta/VentaService.java`
- [ ] T014 [P] Agregar `@RequestParam(required = false) String fechaDesde, @RequestParam(required = false) String fechaHasta` en `VentaController.java`
      Contract: `{"params": {"fechaDesde": "ISO-8601", "fechaHasta": "ISO-8601"}, "response": "List<VentaResponse>"}`

---

## Phase 5: User Story 3 - Pedidos (P2)

- [ ] T017 [P] Agregar método `findByFechaCreacionBetween` en `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoRepository.java`
- [ ] T018 [P] Agregar método `findByClienteIdAndFechaCreacionBetween` en `PedidoRepository.java`
- [ ] T019 Modificar `PedidoService.getAll(Pageable, fechaDesde, fechaHasta)` en `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java`
- [ ] T020 Modificar `PedidoService.getByCliente(UUID, Pageable, fechaDesde, fechaHasta)` en `PedidoService.java`
- [ ] T021 [P] Agregar `@RequestParam(required = false) String fechaDesde, @RequestParam(required = false) String fechaHasta` en `PedidoController.java`
      Contract: `{"params": {"fechaDesde": "ISO-8601", "fechaHasta": "ISO-8601"}, "response": "Page<PedidoResponseDTO>"}`
