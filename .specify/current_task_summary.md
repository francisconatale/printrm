# Estado de Tarea: Opciones de Deselección en Selects

## Objetivo
Agregar la opción de "Seleccionar" (opción vacía) como un elemento seleccionable dentro de los dropdowns personalizados (Radix UI) para permitir deseleccionar o iniciar el select con la opción por defecto visible en el listado.

## Tareas
- [x] Agregar `<SelectItem value="">Selecciona un cliente</SelectItem>` en el selector de clientes.
- [x] Agregar `<SelectItem value="">Selecciona un producto</SelectItem>` en el selector de productos.
- [x] Cambiar las propiedades `value` de los Select para recibir el valor nativo (`clienteId` y `item.productoId`).
- [x] Validar compilación.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
