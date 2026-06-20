# Estado de Tarea: Ancho de Dropdown y Encapsulamiento de Lógica

## Objetivo
Hacer que el menú desplegable (SelectContent) tome el 100% del ancho del SelectTrigger usando variables de Radix, y encapsular la lógica del placeholder vacío (`""` a `"__empty__"`) directamente dentro de `select.tsx` para simplificar la API de los componentes del proyecto.

## Tareas
- [x] En `select.tsx`, agregar `w-[var(--radix-select-trigger-width)]` en la clase de popper de `<SelectContent>`.
- [x] En `select.tsx`, encapsular el mapeo del valor vacío en los componentes `<Select>` y `<SelectItem>`.
- [x] En `CrearPedidoModal.tsx`, simplificar los componentes para usar `value={clienteId}` y `SelectItem value=""` sin mapeo manual.
- [x] Validar compilación.

## Archivos Involucrados
- `frontend/src/components/ui/select.tsx`
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
