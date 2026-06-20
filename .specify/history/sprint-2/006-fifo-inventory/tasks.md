# Tasks: Sistema de Lotes de Inventario FIFO

## Phase 1: Setup (Shared Infrastructure)
- [x] T001 Definir estructura de datos para Lotes en `backend/src/main/java/com/printrm/studio/domain/stock/Lote.java`

## Phase 2: Foundational (Blocking Prerequisites)
- [x] T002 Crear repositorio de Lotes `backend/src/main/java/com/printrm/studio/domain/stock/LoteRepository.java`
- [x] T003 Configurar relación entre Producto y Lote en el modelo de datos

## Phase 3: User Story 1 - Gestión de Lotes (Priority: P1)
**Goal**: Permitir la creación de lotes al añadir stock.

- [x] T004 [P] [US1] Implementar creación de lote en `ProductoService.addStock` en `backend/src/main/java/com/printrm/studio/domain/stock/ProductoService.java`
- [x] T005 [US1] Actualizar `ProductoController` para recibir costo unitario en `backend/src/main/java/com/printrm/studio/domain/stock/ProductoController.java`

## Phase 4: User Story 2 - Consumo FIFO (Priority: P1)
**Goal**: Implementar lógica de consumo FIFO.

- [x] T006 [US2] Implementar método de consumo por lotes en `ProductoService.updateStock` (negativo) en `backend/src/main/java/com/printrm/studio/domain/stock/ProductoService.java`
- [x] T007 [US2] Asegurar orden cronológico Ascendente por fecha de creación en la consulta de lotes disponibles.

## Phase 5: User Story 3 - Frontend (Priority: P2)
**Goal**: Actualizar la interfaz para reflejar los cambios.

- [x] T008 [P] [US3] Actualizar servicios de API en `frontend/src/features/stock/api/productos.api.ts` para soportar nuevos campos de stock.
- [x] T009 [US3] Refactorizar `ProductoCard.tsx` en `frontend/src/features/stock/components/ProductoCard.tsx` para mostrar información de stock actualizada.

## Phase 6: Polish
- [x] T010 Verificar integridad de datos en la base de datos H2/PostgreSQL.
- [x] T011 Realizar pruebas manuales de flujo completo (Alta stock -> Venta -> Verificación de lotes).
