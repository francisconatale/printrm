# Feature Specification: UX, UI & Accessibility Audit Remediation

**Feature Branch**: `008-auditoria-ux`

**Created**: 2026-06-20

**Status**: Draft

**Input**: Reporte consolidado de Auditoría UX/UI & Accesibilidad con 41 observaciones críticas y 54 advertencias transversales.

---

## User Scenarios & Testing

### User Story 1 - Feedback Visual de Operaciones (Toasts) (Priority: P1)
Como usuario, quiero recibir confirmaciones claras de éxito o mensajes comprensibles de error al crear, actualizar o eliminar registros (Clientes, Productos, Pedidos, Transacciones), para tener certeza de que el sistema procesó mi acción.

**Independent Test**:
1. Intentar guardar un cliente sin conexión o forzando un error del servidor. Se debe mostrar un Toast de error con el detalle del problema.
2. Guardar un cliente correctamente. Se debe mostrar un Toast de éxito ("Cliente guardado correctamente") y cerrar el modal.

---

### User Story 2 - Resiliencia ante fallos en queries (Error Boundary / States) (Priority: P1)
Como usuario, si falla la carga de una lista o vista (por ejemplo, `ClientesListView` o `PedidosListView`), quiero ver un mensaje de error claro en pantalla con un botón de "Reintentar", en lugar de una pantalla vacía o un spinner de carga infinito.

**Independent Test**:
1. Provocar un fallo en el endpoint `GET /api/v1/clientes`.
2. La vista de clientes debe mostrar una sección con un mensaje descriptivo y un botón "Reintentar" que refresque la query de TanStack Query.

---

### User Story 3 - Accesibilidad (A11y) y Semántica HTML (Priority: P1)
Como usuario que utiliza lectores de pantalla o navegación por teclado, quiero poder navegar eficientemente por la interfaz (con etiquetas `<label>` correctas en inputs de búsqueda, `aria-label` en botones de iconos y `aria-hidden` en iconos decorativos), para garantizar una experiencia totalmente accesible.

**Independent Test**:
1. Pasar un validador de accesibilidad o revisar con el inspector de elementos que:
   - Todo input de búsqueda tenga un `<label>` asociado (visualmente oculto si es necesario mediante `sr-only`).
   - Los botones de edición/eliminación que solo contienen iconos tengan un atributo `aria-label` descriptivo.
   - Los iconos decorativos de Lucide tengan `aria-hidden="true"`.
   - Cada vista principal use `<h1>` como heading de primer nivel en lugar de comenzar con `<h2>`.

---

## Requirements

### Global Infrastructure
- **FR-001 - Toaster System**: Instalar e integrar `sonner` como sistema de notificaciones persistente y accesible en la raíz de la aplicación (`App.tsx`).
- **FR-002 - Mutation Feedback Hook**: Crear un helper o hook personalizado (ej. `useMutationWithFeedback` o extender las mutaciones con callbacks configurados) para centralizar la visualización de toasts automáticos en `onSuccess` y `onError`.
- **FR-003 - Query Error View**: Implementar un componente reutilizable `QueryErrorView` que reciba el error y una función `refetch` para mostrar el estado de error de forma consistente.

### Visual Compliance & A11y
- **FR-004 - HTML Semantics**: Asegurar que cada una de las 9 vistas principales analizadas utilice una etiqueta `<h1>` para su título principal, respetando la jerarquía.
- **FR-005 - Search Input Accessibility**: Asegurar que los inputs de búsqueda utilicen una etiqueta `<label>` asociada a través de `htmlFor` e `id`.
- **FR-006 - Accessible Buttons**: Añadir un `aria-label` explícito a todos los botones que solo renderizan un ícono sin texto visual.
- **FR-007 - Decorative Icons**: Añadir `aria-hidden="true"` a todos los componentes de iconos de `lucide-react` que actúan de forma puramente decorativa.

### UX Details & Refinements
- **FR-008 - Tap Targets**: Incrementar el padding/tamaño de botones pequeños de acción (editar, eliminar) en las tablas y galerías para que midan al menos 44px de área interactiva (o tengan suficiente espacio interactivo circundante).
- **FR-009 - Empty States**: Diferenciar visualmente los estados de:
  - "No hay datos registrados aún" (botón para crear el primero).
  - "No se encontraron resultados para la búsqueda" (sugerencia de limpiar filtros).

### Form Design & Interaction Guidelines
- **FR-010 - Actionable Select Placeholders**: Nunca usar placeholders genéricos estilo `-- Seleccionar X --`. Emplear verbos activos orientados a la acción (ej. `"Elegí un cliente"`, `"Buscar producto..."`). Si el campo es obligatorio, marcarlo visualmente con un asterisco (`*`).
- **FR-011 - Grid Headers for Numeric Rows**: En modales/tablas con filas de ítems con más de un valor numérico (ej. `CrearPedidoModal`), incluir encabezados encima de las columnas (`Cant. | Precio unit. | Subtotal`). El campo editable debe distinguirse visualmente de forma clara respecto a los campos calculados.
- **FR-012 - Contextual Trash Icon styling**: En filas de tablas de edición dinámica que estén vacías u omitidas por el usuario, no mostrar el ícono de eliminar (trash) en color rojo/danger por defecto (mantenerlo gris neutro u ocultarlo). Aplicar color rojo/danger únicamente cuando contenga datos que vayan a perderse tras hacer click.
- **FR-013 - Preventive Button Validation**: Los botones de acción principal (Crear/Confirmar/Guardar) deben estar deshabilitados si no se han completado los campos requeridos mínimos. Mostrar un tooltip en estado hover (ej. `"Seleccioná un cliente antes de confirmar"`) en lugar de esperar a que ocurra el evento submit para reportar los campos vacíos.
- **FR-014 - Identical Date Records Differentiator**: Cuando existan múltiples registros/transacciones cargados con la misma fecha en una vista, añadir un diferenciador secundario visual (ej. hora exacta, número de lote `#001` / `#002`, o un badge de orden como `"Próximo en salir"`) para evitar filas indistinguibles.
- **FR-015 - Consistent Badges Justification**: Si un badge de estado o prioridad se utiliza en algunos registros y no en otros dentro del mismo contexto visual, dicha ausencia debe estar plenamente justificada o documentarse su lógica (ej. si uno tiene badge FIFO, otros necesitan su badge correspondiente o indicar la razón de no poseerlo).
- **FR-016 - Semantic Icons Consistency**: Los íconos usados para la misma entidad en un contexto deben ser idénticos. Si se utilizan íconos distintos, la diferencia semántica debe ser real y explicarse explícitamente mediante tooltips descriptivos.
- **FR-017 - Explicit Mathematical Operators**: Eliminar el uso de flechas `→` redundantes para relacionar valores numéricos si la operación aritmética es obvia (ej. si `precio × cantidad = subtotal`). Si se desea ilustrar la relación, usar operadores matemáticos explícitos (`×` e `=`).
- **FR-018 - Modal Button Hierarchy**: Asegurar la jerarquía visual de los botones de los modales en todas las vistas:
  | Acción | Estilo |
  |--------|--------|
  | Crear / Confirmar / Guardar | Primario (sólido, color principal) |
  | Cancelar / Volver | Secundario (outline) |
  | Cerrar sin guardar | Ghost o Link simple |
  | Eliminar | Danger (rojo) + diálogo/confirmación preventiva |

---


## Success Criteria
- **SC-001**: Cero alertas críticas de accesibilidad en los elementos modificados según la auditoría.
- **SC-002**: Cobertura del 100% de las mutaciones con feedback de toast en éxito y error.
- **SC-003**: Todas las queries principales de las 9 vistas deben manejar explícitamente `isError` / `error` y mostrar la UI correspondiente en lugar de un spinner infinito.
