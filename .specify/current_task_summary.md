# Estado de Tarea: Corrección de Crash en Selects de Radix UI

## Objetivo
Resolver el crash al abrir el modal reemplazando el valor de string vacío (`""`) en `<SelectItem>` por un valor especial placeholder `"__empty__"` compatible con Radix UI.

## Tareas
- [ ] Cambiar el valor vacío `""` a `"__empty__"` en los `<SelectItem>` y en las propiedades `value` de los selectores.
- [ ] En los eventos `onValueChange`, interceptar el valor `"__empty__"` y setearlo en el estado como string vacío `""` para mantener la lógica de validación del formulario.
- [ ] Validar compilación.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
