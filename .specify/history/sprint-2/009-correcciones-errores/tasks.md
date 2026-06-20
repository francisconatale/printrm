# Tasks: Stabilizing API and Backend Logic

**File**: `.specify/specs/009-correcciones-errores/tasks.md`
**Status**: Ready

---

## 📋 Task List

### Phase 1: Structural & Global Architecture
- [x] **T001**: Implement `ResourceNotFoundException` and `GlobalExceptionHandler`.
  - Add exception classes under `com.printrm.studio.exception`.
  - Inject `@Valid` annotations in all `@RequestBody` controller endpoints.
  - Refactor all Services to throw `ResourceNotFoundException` instead of generic `RuntimeException` when a resource is not found.
  - *Verification*: Verify API responses when lookup fails or model validation fails.

### Phase 2: Null-Safety & Validation
- [x] **T002**: Fix Null-Safety in Core Services.
  - Add null-check for `Transaccion::getMonto` in `TransaccionService.java`.
  - Validate and add null-checks for `item.getCantidad()` in `PedidoService.java`.
  - Validate `ajustes` and `ajustes.getPreciokWh()` in `CostCalculationService.java`.
  - *Verification*: Run unit tests to verify no NullPointerExceptions occur.

- [x] **T003**: Implement UUID safety checks.
  - Create utility class `com.printrm.studio.utils.UUIDUtils`.
  - Update `ProductoService.java` to validate component UUIDs.
  - Update `OrdenProduccionController.java` to validate product and order item IDs.
  - *Verification*: Test API endpoints with corrupted and null UUID formats.

### Phase 3: Updates, Enums, and DB Refresh
- [x] **T004**: Merges, enum safety, and DB refreshes.
  - Apply conditional update logic to `PerfilService.java` to prevent resetting fields to null during partial updates.
  - Validate status strings in `PedidoService.java` before calling `EstadoPedido.valueOf()`.
  - Force DB reload of product entity in `ProductoService.java:save` after updating stock to ensure lots are returned.
  - *Verification*: Perform PUT partial update on printer profile and check status modification on Pedido.

- [x] **T005**: File move propagation error handling.
  - Refactor `PiezaSTLService.java` to propagate IOExceptions when `Files.move()` fails, triggering database rollback.
  - *Verification*: Attempt to save STL piece with nonexistent upload path and verify database record is not created.

