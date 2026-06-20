# Estado de Tarea: Control de doble entrega de Pedido (Idempotencia en Entrega)

## Objetivo
Evitar que un pedido que ya ha sido marcado como `ENTREGADO` o `DEVUELTO` se vuelva a entregar o devolver, previniendo el descuento/reposición doble de stock e ingresos duplicados.

## Tareas
- [x] Validar en `PedidoService.cambiarEstado` que si `anterior == ENTREGADO`, no se pueda volver a entregar.
- [x] Validar en `PedidoService.cambiarEstado` que si `anterior == DEVUELTO`, no se pueda volver a devolver.
- [x] Opcionalmente validar otros cambios de estado inválidos (por ejemplo, si ya está devuelto no debería entregarse de nuevo, o si está entregado no debería volver a producirse, etc., pero al menos la idempotencia de los estados finales).
- [x] Añadir o actualizar pruebas de integración para asegurar que se lanza excepción al intentar cambiar el estado por segunda vez.
- [x] Controlar la cantidad de productos entregados a nivel de ítem (`cantidadEntregada`).
- [x] Actualizar dinámicamente el **Faltante Neto** restando las unidades entregadas de la cantidad del pedido.
- [x] Adaptar el frontend para mostrar las unidades entregadas y deshabilitar los botones de acción para estados finales.

## Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedido.java`
- `backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java`
- `backend/src/test/java/com/printrm/studio/domain/pedidos/PedidoIntegrationTest.java`
- `frontend/src/features/pedidos/types/pedidos.types.ts`
- `frontend/src/features/pedidos/components/PedidoDetalleView.tsx`
