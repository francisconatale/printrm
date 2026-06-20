# Tasks: Plan de migración de colores

## Fase 1 — Tokens en `index.css`
- [ ] T001 Pegar el bloque de variables en `index.css`.
- [ ] T002 Verificar visualmente en light y dark.

## Fase 2 — Reemplazos globales
- [ ] T003 Reemplazar bg-white por bg-background.
- [ ] T004 Reemplazar bg-[#f5f5f7] y bg-[#f9fafb] por bg-muted.
- [ ] T005 Reemplazar text-[#7a7a7a] y gray-500/400 por text-muted-foreground.
- [ ] T006 Reemplazar border-[#e0e0e0], border-[#e5e7eb] y border-gray-200 por border-border.
- [ ] T007 Reemplazar text-indigo-500 por text-primary.
- [ ] T008 Reemplazar rounded-[2rem] por rounded-[var(--radius-xl)].

## Fase 3 — Componentes específicos
- [ ] T009 Actualizar colores de Toasts a semánticos según tipo (success, destructive, primary, warning).
- [ ] T010 Cambiar chip seleccionado en ComposicionProductoModal a bg-primary/10 border-primary text-primary.
- [ ] T011 Cambiar botón "Crear Producto" a rounded-[var(--radius-pill)].

## Fase 4 — Limpiar `studio-theme.css`
- [ ] T012 Convertir tokens Studio a alias de Shadcn en `studio-theme.css`.
- [ ] T013 Eliminar `.studio-button-primary` de `studio-theme.css`.
- [ ] T014 Agregar override `.dark` para `--studio-tile-dark-1` y `-2`.

## Fase 5 — Verificación final
- [ ] T015 Pruebas y verificación final en dev.
