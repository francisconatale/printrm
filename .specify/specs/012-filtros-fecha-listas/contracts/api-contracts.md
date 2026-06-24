# API Contracts: Filtros de Fecha

## Transacciones

### `GET /api/v1/transacciones`

**Params** (todos opcionales):

| Parámetro | Tipo | Ejemplo | Descripción |
|-----------|------|---------|-------------|
| `page` | int | `0` | Número de página |
| `size` | int | `20` | Tamaño de página |
| `clienteId` | UUID | `550e8400-e29b-41d4-a716-446655440000` | Filtrar por cliente |
| `fechaDesde` | string (ISO-8601) | `2026-01-01T00:00:00` | Límite inferior (inclusive) |
| `fechaHasta` | string (ISO-8601) | `2026-06-24T23:59:59` | Límite superior (inclusive) |

**Response**: `Page<Transaccion>` (existente, sin cambios)

**Comportamiento**:
- `fechaDesde` solo → filtra desde esa fecha en adelante
- `fechaHasta` solo → filtra hasta esa fecha
- Ambos → rango cerrado
- Ninguno → sin filtro de fecha (comportamiento actual)
- Combinable con `clienteId`

---

## Pedidos

### `GET /api/v1/pedidos`

**Params** (todos opcionales):

| Parámetro | Tipo | Ejemplo | Descripción |
|-----------|------|---------|-------------|
| `page` | int | `0` | Número de página |
| `size` | int | `20` | Tamaño de página |
| `clienteId` | UUID | `550e8400-e29b-41d4-a716-446655440000` | Filtrar por cliente |
| `fechaDesde` | string (ISO-8601) | `2026-01-01T00:00:00` | Límite inferior en `fechaCreacion` (inclusive) |
| `fechaHasta` | string (ISO-8601) | `2026-06-24T23:59:59` | Límite superior en `fechaCreacion` (inclusive) |

**Response**: `Page<PedidoResponseDTO>` (existente, sin cambios)

---

## Ventas

### `GET /api/v1/ventas`

**Params** (todos opcionales):

| Parámetro | Tipo | Ejemplo | Descripción |
|-----------|------|---------|-------------|
| `fechaDesde` | string (ISO-8601) | `2026-01-01T00:00:00` | Límite inferior en `fecha` de transacciones (inclusive) |
| `fechaHasta` | string (ISO-8601) | `2026-06-24T23:59:59` | Límite superior en `fecha` de transacciones (inclusive) |

**Response**: `List<VentaResponse>` (existente, sin cambios)

**Nota**: Las ventas se construyen agrupando transacciones con `tipo=INGRESO` y `categoria=VENTA`. El filtro de fecha se aplica ANTES del agrupamiento.
