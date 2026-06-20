# Estado de Tarea: Unificación de Productos Duplicados en Pedidos

## Objetivo
Evitar la creación de filas duplicadas en el modal de pedidos. Si un usuario selecciona un producto que ya existe en otra fila, la cantidad de la fila actual se sumará a la fila existente y se eliminará la fila actual redundante.

## Tareas
- [x] Modificar `handleItemChange` en `CrearPedidoModal.tsx` para detectar productos duplicados.
- [x] Implementar la suma de cantidades y eliminación de la fila duplicada actual.
- [x] Validar compilación.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
