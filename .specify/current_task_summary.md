# Estado de Tarea: Estado Vacío de Ítems en Pedidos

## Objetivo
Permitir la eliminación completa de todos los productos en el modal (incluso el último) y mostrar un estado vacío (empty state) premium con un botón de llamada a la acción para agregar el primer producto cuando no haya ítems.

## Tareas
- [ ] Eliminar la restricción `disabled={items.length === 1}` del botón de borrado (tacho) de cada fila.
- [ ] Implementar un componente de estado vacío premium cuando `items.length === 0`.
- [ ] Ocultar los encabezados de grilla si no hay ítems agregados.
- [ ] Validar compilación.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
