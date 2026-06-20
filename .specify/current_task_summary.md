# Estado de Tarea: Corrección de Placeholder y Estilo en Selects

## Objetivo
Corregir la selección automática del primer elemento en los componentes de Select personalizados usando el fallback a `undefined` para mostrar el placeholder por defecto, y restaurar el contenedor premium para el selector de clientes.

## Tareas
- [ ] Modificar el selector de cliente para usar `value={clienteId || undefined}` y restaurar su contenedor estilizado.
- [ ] Modificar el selector de producto en la grilla para usar `value={item.productoId || undefined}`.
- [ ] Validar compilación y funcionamiento.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
