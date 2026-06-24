# Plan: Venta Directa POS

**Goal**: Implementar venta rápida a consumidor final desde el catálogo de stock.

## Fases del Plan

### Fase 1 — Backend: VentaDirectaController + Service
- Crear endpoint `POST /api/ventas-directas` que acepte `{ productoId, cantidad, precioUnitario, compradorNombre?, compradorEmail? }`
- Backend Service que: consume stock (FIFO), registra Transaccion (INGRESO/VENTA), opcionalmente crea Pedido mínimo
- Endpoint `GET /api/ventas-directas` con paginación para historial
- DTOs: `VentaDirectaRequest`, `VentaDirectaResponse`

### Fase 2 — Frontend: Modal de Venta Rápida
- Agregar botón "Vender" en `ProductoCard` (con icono de carrito/dólar)
- Crear `VentaDirectaModal` con: nombre producto, precio sugerido, selector cantidad, campo opcional comprador, confirmar/cancelar
- Llamar a `POST /api/ventas-directas` y actualizar stock en la UI

### Fase 3 — Frontend: Historial de Ventas Directas
- Agregar botón "Historial Ventas" en Catálogo Stock
- Modal o view con lista paginada de ventas directas

### Fase 4 — Integración Financiera
- Verificar que las transacciones aparezcan en Libro Diario
- Validar que el consumo FIFO funciona correctamente
