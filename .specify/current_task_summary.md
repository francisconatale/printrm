# Estado de Tarea Actual

**Tarea:** Ver pedidos y transacciones de un cliente directamente en la sección de clientes.

**Alcance:**
- Backend: agregar query por `clienteId` en `PedidoRepository`, `TransaccionRepository`, sus servicios y controladores.
- Frontend: panel lateral (drawer) que se abre al hacer clic en un cliente mostrando sus pedidos y transacciones.

**Archivos a modificar:**
- `PedidoRepository.java` — agregar `findByClienteId`
- `PedidoService.java` — agregar `getByCliente`
- `PedidoController.java` — agregar query param `clienteId`
- `TransaccionRepository.java` — agregar `findByPedido_ClienteId`
- `TransaccionService.java` — agregar `getByCliente`
- `TransaccionController.java` — agregar query param `clienteId`
- `clientes.api.ts` — agregar hooks para pedidos/transacciones por cliente
- `ClientesListView.tsx` — abrir drawer al hacer clic en cliente
- Nueva: `ClienteDetalleDrawer.tsx`
