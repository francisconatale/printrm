# Estado de Tarea: Plan de Migración de Colores

## Objetivo
Implementar una sola fuente de verdad para colores utilizando Shadcn como base, eliminando valores hardcodeados para lograr un dark mode funcional en todo el proyecto.

## Tareas
- [ ] Fase 1: Actualizar `index.css` con nuevos tokens de color.
- [ ] Fase 2: Realizar reemplazos globales de colores, textos, bordes y radios en componentes.
- [ ] Fase 3: Ajustar componentes específicos (toasts, chips activos, botones).
- [ ] Fase 4: Limpiar `studio-theme.css` convirtiendo Studio tokens a alias de Shadcn y eliminando duplicados.
- [ ] Fase 5: Realizar verificación final y pruebas de compilación/Dark Mode.

## Archivos Involucrados
- `.specify/current_task_summary.md`
- `frontend/src/index.css`
- `frontend/src/components/layout/app-shell.tsx`
- `frontend/src/features/stock/components/ComposicionProductoModal.tsx`
- `frontend/src/features/calculo/components/ResultadoPanel.tsx`
- `frontend/src/features/stock/components/ProductoCard.tsx`
- (Otros archivos del frontend que requieran reemplazos)
