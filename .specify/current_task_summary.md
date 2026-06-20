# Estado de Tarea: Ajustes Visuales en Agenda de Producción

## Objetivo
- Suavizar los bordes de los contenedores de columnas Kanban en modo oscuro (actualmente `border-border/30`) en `AgendaProduccionView.tsx`.
- Corregir/mejorar la alineación vertical del checkbox toggle 'Ver Canceladas' en la barra de herramientas.

## Tareas
- [x] Modificar `frontend/src/features/pedidos/components/PedidosListView.tsx` cambiando `border-border/60` a `border-zinc-200 dark:border-zinc-800` o similar.
- [ ] Modificar `frontend/src/features/produccion/components/AgendaProduccionView.tsx` suavizando los bordes de las columnas en modo oscuro (e.g. agregando `dark:border-border/10` o similar).
- [ ] Alinear verticalmente el checkbox toggle 'Ver Canceladas' con el resto de elementos/botones de la barra de herramientas.
- [ ] Verificar compilación y visualización.

## Archivos Involucrados
- `.specify/current_task_summary.md`
- `frontend/src/features/produccion/components/AgendaProduccionView.tsx`
