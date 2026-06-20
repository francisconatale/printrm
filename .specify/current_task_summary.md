# Tarea Actual: Implementar remediación UX/A11y en ClientesListView.tsx y PedidosListView.tsx (T024)

## Estado
- [ ] Implementar `QueryErrorView` para las consultas principales de Clientes y Pedidos (T024).
- [ ] Integrar `useMutationWithFeedback` para las mutaciones de Clientes y Pedidos en sus respectivas APIs (T024).
- [ ] Aplicar accesibilidad (A11y): `<label>` en inputs de búsqueda, `aria-label` en botones y `aria-hidden` en iconos (T024).
- [ ] Corregir jerarquía de encabezados (`<h2>` -> `<h1>`) (T024).
- [ ] Ajustar placeholders de selects y validación interactiva / jerarquía de botones en modales (T024).

## Archivos involucrados
- `frontend/src/features/clientes/api/clientes.api.ts`
- `frontend/src/features/pedidos/api/pedidos.api.ts`
- `frontend/src/features/clientes/components/ClientesListView.tsx`
- `frontend/src/features/pedidos/components/PedidosListView.tsx`
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
- `CHANGELOG.md`
