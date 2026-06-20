# Specification: Stabilizing API and Backend Logic

**File**: `.specify/specs/009-correcciones-errores/spec.md`
**Status**: Draft

---

## 1. Exception Handling Architecture
We will introduce a robust global exception handling mechanism to prevent unhandled 500 Internal Server Errors for common user input errors, invalid UUID formats, and missing resource lookups.

### New Custom Exception: `ResourceNotFoundException`
- **Location**: `com.printrm.studio.exception.ResourceNotFoundException`
- **Details**: Extends `RuntimeException`. Annotated with `@ResponseStatus(HttpStatus.NOT_FOUND)`.
- **Use Case**: Thrown when a resource (e.g. `Pedido`, `Producto`, `PiezaSTL`) is not found by its ID in database lookup.

### Global Exception Handler: `GlobalExceptionHandler`
- **Location**: `com.printrm.studio.exception.GlobalExceptionHandler`
- **Details**: Annotated with `@ControllerAdvice` or `@RestControllerAdvice`.
- **Methods**:
  - `handleResourceNotFound(ResourceNotFoundException ex)` -> Returns `404 Not Found` with a clear message payload.
  - `handleIllegalArgumentException(IllegalArgumentException ex)` -> Returns `400 Bad Request` with description. Specifically intercepts invalid UUID string conversion errors.
  - `handleValidationExceptions(MethodArgumentNotValidException ex)` -> Returns `400 Bad Request` with a map of fields and their validation failure descriptions.
  - `handleGenericException(Exception ex)` -> Logs the stack trace and returns a standard JSON payload with a `500 Internal Server Error` status.

---

## 2. API Validation and Safety Checks

### Request Body Validation
Add `@Valid` annotation to every `@RequestBody` parameter in:
- `AjustesController.java`
- `PiezaSTLController.java`
- `ClienteController.java`
- `TransaccionController.java`
- `PedidoController.java`
- `FilamentProfileController.java`
- `PerfilController.java`
- `PrintProfileController.java`
- `OrdenProduccionController.java`
- `ProductoController.java`

### Null-Safety in Core Calculations and Services
1.  **`TransaccionService.java`**:
    *   Change the stream map to `mapToDouble(t -> t.getMonto() != null ? t.getMonto() : 0.0)` in `getBalance()`.
2.  **`PedidoService.java`**:
    *   Validate that `item.getCantidad()` is not null before using it in stock validation, updates, or transactions. If null, default to `0` or throw `IllegalArgumentException`.
3.  **`CostCalculationService.java`**:
    *   Add null checks for `ajustes` and `ajustes.getPreciokWh()`. If either is null, log a warning and fallback to a default price of `0.15` (or similar sensible default) or throw an error.

### UUID Validation Helper
- **Helper**: `com.printrm.studio.utils.UUIDUtils`
- **Method**: `public static UUID parseUUID(String str)`
- **Behavior**: Checks if the input is not null, matches a UUID regex pattern `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`. If valid, returns `UUID.fromString(str)`. If invalid or null, throws `IllegalArgumentException` with a descriptive message.
- **Usage**:
  - `ProductoService.java` line 55 (validating `parteIds` from request).
  - `OrdenProduccionController.java` line 31 (validating `itemPedidoId` or `productoId`).
  - Anywhere else that receives dynamic UUID strings.

---

## 3. Merge Updates, Enums, and Filesystem Logic

### Partial Updates (Conditional Setters)
- **Class**: `PerfilService.java` (updateEntity method)
- **Change**: Replace direct assignments with conditional checks: `if (dto.getCampo() != null) entity.setCampo(dto.getCampo())`.

### Enum Safe Conversion
- **Service**: `PedidoService.java` (cambiarEstado method)
- **Change**: Validate if `nuevoEstado` is a valid name in `Pedido.EstadoPedido` enum values before calling `valueOf(nuevoEstado)`. If invalid, throw `IllegalArgumentException`.

### Reliable STL Persistence
- **Service**: `PiezaSTLService.java`
- **Change**: Wrap `Files.move()` inside the try block, but if it throws an IOException, catch it and propagate/throw a proper server-error exception so the database transaction is rolled back and the record is not created.

### DB Fresh Fetch
- **Service**: `ProductoService.java` (save method)
- **Change**: Re-query the database for the saved entity before calling `mapToResponseDTO` if a stock update occurred.
