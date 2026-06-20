# Implementation Plan: UX, UI & Accessibility Remediation

**Branch**: `008-auditoria-ux` | **Date**: 2026-06-20 | **Spec**: [.specify/specs/008-auditoria-ux/spec.md](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/008-auditoria-ux/spec.md)

## Summary
Implementar mejoras transversales de accesibilidad (A11y), manejo de errores y confirmación visual de éxito a través del sistema. Resolveremos de forma sistemática los 41 puntos críticos y 54 advertencias identificados en la auditoría sobre las 9 vistas principales.

## Technical Context
- **Dependencies**: React 18, TanStack Query v5, `sonner` (sistema de toasts), Lucide React.
- **Rules**: Cumplimiento estricto de WCAG 2.1 (A y AA) para etiquetas, nombres accesibles y roles.

## Project Structure
```text
.specify/specs/008-auditoria-ux/
├── spec.md              # Especificaciones y casos de uso
├── plan.md              # Este archivo
└── tasks.md             # Tareas e hitos
```

## Implementation Phases

### Fase 1: Infraestructura Global y Utilidades (P1)
1. **Instalación de Sonner**:
   - Ejecutar `npm install sonner` en `frontend/`.
   - Registrar `<Toaster richColors position="top-right" closeButton />` en `App.tsx`.
2. **Componente QueryErrorView**:
   - Crear `frontend/src/components/ui/query-error-view.tsx` para renderizar un banner de error uniforme con un botón de "Reintentar" (`refetch`).
3. **Mapeo de Feedback de Mutación**:
   - Definir un wrapper o patrón claro para registrar toasts de éxito y error en las mutaciones sin redundancia.

### Fase 2: Corrección por Lotes de Vistas (P1-P2)

#### Lote A: Calculadora & Perfiles
*   [`CalculadoraView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/calculo/components/CalculadoraView.tsx):
    - Eliminar `alert()` y reemplazar con `toast.success` o `toast.error`.
    - Ajustar la jerarquía (`<h2>` -> `<h1>`).
    - Añadir `<label>` accesible al input de búsqueda.
*   [`PerfilesDashboardView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/perfiles/components/PerfilesDashboardView.tsx):
    - Manejar estados de carga/error en queries.
    - Asegurar accesibilidad en inputs de perfil y botones de acción.

#### Lote B: Clientes & Pedidos (Core Comercial)
*   [`ClientesListView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/clientes/components/ClientesListView.tsx):
    - Manejar `isError` y renderizar `QueryErrorView`.
    - Añadir feedback con toast a las mutaciones (`createCliente`, `updateCliente`, `deleteCliente`).
    - Accesibilidad de inputs y labels en el modal.
*   [`PedidosListView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidosListView.tsx) y [`PedidoDetalleView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidoDetalleView.tsx):
    - Añadir componente Breadcrumb a `PedidoDetalleView`.
    - Agregar control de error y estados de carga.
    - Inputs de búsqueda y botones de íconos accesibles.

#### Lote C: Piezas, Productos, Agenda y Finanzas
*   [`PiezasGalleryView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/PiezasGalleryView.tsx) y [`ProductosGalleryView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/ProductosGalleryView.tsx):
    - A11y en las tarjetas y botones (añadir `aria-label` a los botones de acción).
    - Toasts en mutaciones.
*   [`AgendaProduccionView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/produccion/components/AgendaProduccionView.tsx) y [`LibroDiarioView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/finanzas/components/LibroDiarioView.tsx):
    - Asegurar semántica HTML, headings `<h1>`.
    - Corrección de alertas en inputs de filtrado y búsqueda.

### Directrices de Diseño de Formularios e Interacción (Transversal)
Para asegurar consistencia en todas las vistas y componentes:
- **Placeholders de Selects**: Utilizar verbos de acción en lugar de "-- Seleccionar --" y marcar obligatorios con `*`.
- **Modales de Creación de Pedido/Composición**: Implementar headers explícitos (`Cant. | Precio unit. | Subtotal`) en filas de items con múltiples valores numéricos.
- **Trash Icons contextuales**: Ocultar o mantener en gris neutro los íconos de eliminar en filas nuevas/vacías; usar color danger sólo cuando se vayan a perder datos ingresados.
- **Validación Preventiva y Tooltips**: Deshabilitar botones de confirmación si no se cumplen campos mínimos y agregar tooltips explicativos en hover.
- **Diferenciación de Registros por Fecha**: En listados/tablas de transacciones o producción con la misma fecha, agregar un diferenciador secundario (hora exacta, ID de lote, o badge de orden).
- **Consistencia en Badges e Iconos**: Justificar la ausencia de badges en el mismo contexto y unificar íconos redundantes (o diferenciarlos vía tooltips).
- **Jerarquía en Botones de Modales**: Aplicar estilos Primario (sólido), Secundario (outline), Ghost/Link (Cerrar) y Danger (Rojo) con confirmación para eliminación.
- **Eliminación de Flechas `→`**: Reemplazar por operadores aritméticos explícitos o remover redundancias de flujo de datos numéricos.

