# Data Model: Filtros de Fecha en Listas

No se agregan nuevas entidades ni columnas. Solo se extiende la lógica de consulta existente para filtrar por rango de fechas.

## Cambios en el backend

### TransaccionRepository

```java
// NUEVO: filtrar por rango de fechas
Page<Transaccion> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
Page<Transaccion> findByClienteIdAndFechaBetween(UUID clienteId, LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
```

### PedidoRepository

```java
// NUEVO: filtrar por rango de fechas
Page<Pedido> findByFechaCreacionBetween(LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
Page<Pedido> findByClienteIdAndFechaCreacionBetween(UUID clienteId, LocalDateTime desde, LocalDateTime hasta, Pageable pageable);
```

### Transaccion (entidad existente)

| Campo | Tipo | Uso |
|-------|------|-----|
| `fecha` | `LocalDateTime` | Filtro rango en Transacciones y Ventas |

### Pedido (entidad existente)

| Campo | Tipo | Uso |
|-------|------|-----|
| `fechaCreacion` | `LocalDateTime` | Filtro rango en Pedidos |

## API Contract (parámetros)

| Parámetro | Tipo | Requerido | Formato |
|-----------|------|-----------|---------|
| `fechaDesde` | `LocalDateTime` | No | `yyyy-MM-dd'T'HH:mm:ss` |
| `fechaHasta` | `LocalDateTime` | No | `yyyy-MM-dd'T'HH:mm:ss` |

Si no se envían, el comportamiento es el actual (sin filtro de fecha).
