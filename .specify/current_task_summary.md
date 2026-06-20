# Estado de Tarea: Ajustar borde de estado vacío en Pedidos

## Objetivo
Cambiar el borde dashed del estado vacío en `PedidosListView.tsx` de un color brillante a un tono más suave en modo oscuro (e.g., `border-zinc-200 dark:border-zinc-800`).

## Tareas
- [ ] Fase 1: Actualizar `index.css` con nuevos tokens de color.
- [ ] Fase 2: Realizar reemplazos globales de colores, textos, bordes y radios en componentes.
  - [x] Corregir fondo de previsualización de imagen en `STLCard.tsx` para Dark Mode.
  - [ ] Corregir fondo de `STLCard` para asegurar contraste adecuado.
- [ ] Fase 3: Ajustar componentes específicos (toasts, chips activos, botones).
- [ ] Fase 4: Limpiar `studio-theme.css` convirtiendo Studio tokens a alias de Shadcn y eliminando duplicados.
- [ ] Fase 5: Realizar verificación final y pruebas de compilación/Dark Mode.
- [ ] Modificar `frontend/src/features/pedidos/components/PedidosListView.tsx` cambiando `border-border/60` a `border-zinc-200 dark:border-zinc-800` o similar.
- [ ] Verificar la compilación del proyecto.

## Archivos Involucrados
- `.specify/current_task_summary.md`
- `frontend/src/features/pedidos/components/PedidosListView.tsx`
