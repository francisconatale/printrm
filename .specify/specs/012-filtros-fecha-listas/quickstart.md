# Quickstart: Filtros de Fecha en Listas

## Prerrequisitos

- Backend corriendo en `http://localhost:8080`
- Frontend corriendo en `http://localhost:5173`

## Escenarios de validación

### 1. Backend — Transacciones con filtro de fecha

```bash
# Sin filtro (comportamiento actual)
curl "http://localhost:8080/api/v1/transacciones?page=0&size=5"

# Con rango de fechas
curl "http://localhost:8080/api/v1/transacciones?page=0&size=5&fechaDesde=2026-01-01T00:00:00&fechaHasta=2026-06-24T23:59:59"

# Solo fechaDesde
curl "http://localhost:8080/api/v1/transacciones?page=0&size=5&fechaDesde=2026-06-01T00:00:00"

# Combinado con clienteId
curl "http://localhost:8080/api/v1/transacciones?page=0&size=5&clienteId=...&fechaDesde=2026-01-01T00:00:00"
```

Expected: Cada request devuelve un `Page<Transaccion>` con los registros filtrados correctamente.

### 2. Backend — Pedidos con filtro de fecha

```bash
curl "http://localhost:8080/api/v1/pedidos?page=0&size=5&fechaDesde=2026-06-01T00:00:00&fechaHasta=2026-06-30T23:59:59"
```

Expected: `Page<PedidoResponseDTO>` con pedidos creados en junio 2026.

### 3. Backend — Ventas con filtro de fecha

```bash
curl "http://localhost:8080/api/v1/ventas?fechaDesde=2026-06-01T00:00:00&fechaHasta=2026-06-24T23:59:59"
```

Expected: `List<VentaResponse>` con ventas del período filtrado.

### 4. Frontend — DateRangePicker en Transacciones

1. Abrir `http://localhost:5173/finanzas/transacciones`
2. Hacer clic en el botón de filtro de fecha
3. Seleccionar "Últimos 30 Días"
4. Verificar que la tabla se actualiza con solo transacciones del último mes
5. Limpiar el filtro y verificar que vuelven todas

### 5. Frontend — Atajos de período

1. En cualquier vista con DateRangePicker, probar cada atajo:
   - **Hoy**: Filtra al día actual
   - **Esta Semana**: Lunes a domingo de la semana actual
   - **Este Mes**: 1° al último día del mes actual
   - **Últimos 30 Días**: Hoy - 30 días → hoy

### 6. Frontend — Combinación con búsqueda textual

1. En Pedidos, aplicar filtro de fecha "Este Mes"
2. En la barra de búsqueda, escribir "Cliente X"
3. Verificar que ambos filtros se aplican en conjunto

## Verificación de no regresión

- Sin enviar `fechaDesde`/`fechaHasta`, todas las vistas deben funcionar exactamente como antes
- La paginación debe seguir funcionando correctamente con filtros aplicados
- El balance en el dashboard debe mantenerse sin cambios
