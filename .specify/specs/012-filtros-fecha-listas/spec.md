# Feature Specification: Filtros de Fecha en Listas

**Feature Branch**: `012-filtros-fecha-listas`

**Created**: 2026-06-24

**Status**: Draft

**Input**: User description: "Agregar filtros de fecha en las vistas de listas donde tenga sentido: transacciones, ventas, pedidos, libro diario y dashboard financiero."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtrar Transacciones por Rango de Fechas (Priority: P1)

Como usuario financiero, quiero poder filtrar las transacciones por un rango de fechas (desde/hasta) para analizar únicamente los movimientos de un período específico sin tener que revisar páginas enteras de datos históricos.

**Why this priority**: Es la funcionalidad base que desbloquea el valor de los filtros de fecha. Transacciones es el listado más usado del módulo financiero.

**Independent Test**: Abrir la vista de Transacciones, seleccionar un rango de fechas, y verificar que solo se muestren transacciones dentro de ese rango.

**Acceptance Scenarios**:

1. **Given** que estoy en la vista de Transacciones, **When** selecciono una fecha "desde" y una fecha "hasta", **Then** la tabla solo muestra transacciones dentro de ese rango.
2. **Given** que hay un filtro activo, **When** limpio el filtro de fecha, **Then** vuelvo a ver todas las transacciones sin filtro.
3. **Given** que selecciono un rango sin resultados, **When** aplico el filtro, **Then** veo un mensaje "No hay transacciones en este período".
4. **Given** que selecciono "desde" mayor a "hasta", **When** intento aplicar, **Then** el sistema muestra un error de validación o intercambia los valores automáticamente.

---

### User Story 2 - Filtrar Ventas por Rango de Fechas (Priority: P1)

Como usuario de ventas, quiero filtrar la lista de ventas por fecha para ver solo las ventas de un día, semana o mes específico y poder hacer cierres diarios.

**Why this priority**: Las ventas son el segundo listado más crítico y hoy no tienen paginación (traen 500 registros). El filtro de fecha reduce drásticamente la carga de datos.

**Independent Test**: Abrir Ventas, filtrar por fecha de hoy, ver solo las ventas de hoy.

**Acceptance Scenarios**:

1. **Given** que estoy en Ventas, **When** selecciono "hoy" como filtro rápido, **Then** veo solo las ventas de la fecha actual.
2. **Given** que hay un filtro activo, **When** cambio el rango, **Then** los datos se actualizan automáticamente.
3. **Given** que tengo 200 ventas en total, **When** filtro por un día específico, **Then** solo veo las ventas de ese día (ej. 5 ventas) con la paginación correspondiente.

---

### User Story 3 - Filtrar Pedidos por Rango de Fechas (Priority: P2)

Como usuario de producción/pedidos, quiero filtrar pedidos por su fecha de creación para enfocarme en los pedidos de una semana específica o encontrar pedidos antiguos más rápido.

**Why this priority**: Los pedidos ya tienen paginación y búsqueda, el filtro de fecha es un complemento de alta utilidad.

**Independent Test**: Abrir Pedidos, filtrar por "últimos 7 días", ver solo los pedidos de esa semana.

**Acceptance Scenarios**:

1. **Given** que estoy en Pedidos, **When** selecciono "últimos 30 días", **Then** veo solo pedidos creados en los últimos 30 días.
2. **Given** que tengo filtro activo, **When** combino con búsqueda por texto, **Then** ambos filtros se aplican simultáneamente.

---

### User Story 4 - Atajos de Período Comunes (Priority: P2)

Como usuario, quiero botones de acceso rápido ("Hoy", "Esta Semana", "Este Mes", "Últimos 30 Días") en los filtros de fecha para no tener que navegar el calendario manualmente cada vez.

**Why this priority**: Mejora la eficiencia del usuario en el 80% de los casos de uso (cierres diarios/semanales/mensuales).

**Independent Test**: Hacer clic en "Hoy" y ver que el filtro se ajusta automáticamente al día actual.

**Acceptance Scenarios**:

1. **Given** que hay botones de período rápido, **When** hago clic en "Este Mes", **Then** el filtro se ajusta al primer y último día del mes actual.
2. **Given** que uso un atajo rápido, **When** se aplica, **Then** los datos se actualizan inmediatamente con el rango seleccionado.

---

### Edge Cases

- Fecha "desde" vacía = sin límite inferior (trae desde el inicio)
- Fecha "hasta" vacía = sin límite superior (trae hasta hoy)
- Rango inválido (desde > hasta): se intercambian automáticamente
- Fechas futuras: se permiten pero se muestra advertencia visual
- Zona horaria: todas las fechas se manejan en UTC y se muestran en locale del usuario

## Requirements *(mandatory)*

### Visual Compliance

- **Design System**: MUST strictly follow the principles defined in `.specify/memory/constitution.md` (Studio Edition).
- **Borders**: MUST use Hairline (#e0e0e0) 1px borders for separation.
- **Typography**: MUST use Inter with Studio Tight tracking for headlines and 17px for body.
- **Shadows**: MUST NOT use shadows on UI components (buttons, cards).
- **Full-Stack**: MUST consider the Spring Boot API integration and Wrapper constraints.

### Functional Requirements

- **FR-001**: El backend DEBE aceptar parámetros `fechaDesde` y `fechaHasta` (formato ISO-8601) en los endpoints GET de Transacciones, Pedidos y Ventas.
- **FR-002**: El backend DEBE filtrar los resultados por el rango de fechas cuando se proporcionen estos parámetros.
- **FR-003**: Si no se proporcionan `fechaDesde` o `fechaHasta`, el comportamiento DEBE ser el actual (sin filtro de fecha).
- **FR-004**: El frontend DEBE agregar un componente `DateRangePicker` único y reutilizable que integre la selección de rango (desde/hasta) y botones de atajo (Hoy, Esta Semana, Este Mes, Últimos 30 Días) en una sola unidad visual y funcional.
- **FR-005**: El frontend DEBE pasar `fechaDesde` y `fechaHasta` a los hooks de API correspondientes.
- **FR-006**: El frontend DEBE mostrar el filtro de fecha en: TransaccionesView, VentasListView, PedidosListView, LibroDiarioView.
- **FR-007**: Los filtros DEBEN ser independientes entre sí (cada vista tiene su propio estado de filtro).
- **FR-008**: Al cambiar el filtro, la página DEBE resetearse a la página 0.
- **FR-009**: El filtro de fecha DEBE combinarse con los filtros de búsqueda por texto existentes.
- **FR-010**: El `DateRangePicker` DEBE ser un componente custom sin depender de `<input type="date">` nativo del navegador, construido con los tokens de `frontend/design-system.md`.
- **FR-011**: El `DateRangePicker` DEBE incluir un popup de calendario grid con navegación entre meses usando `date-fns`.

### Key Entities

- **RangoFechas**: Objeto value con `fechaDesde: LocalDateTime` y `fechaHasta: LocalDateTime`.
- **DateRangePicker**: Componente UI único que encapsula la selección de rango de fechas + atajos de período, siguiendo los tokens del design system (`frontend/design-system.md`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuarios pueden completar un filtro por rango de fechas en menos de 5 segundos usando atajos.
- **SC-002**: Las vistas con filtro de fecha muestran los resultados correctos validados contra al menos 3 rangos distintos.
- **SC-003**: El 100% de los endpoints GET de listas (transacciones, pedidos, ventas) aceptan y procesan correctamente los parámetros de fecha.
- **SC-004**: Cero errores de validación cuando se proporcionan fechas inválidas (se manejan con gracia).
- **SC-005**: El componente DateRangePicker es reutilizable en al menos 4 vistas diferentes.

## Assumptions

- Las fechas se almacenan como `LocalDateTime` en el backend (UTC).
- Los endpoints GET actuales usan `@RequestParam` y son compatibles con parámetros opcionales adicionales.
- El frontend usa `date-fns` para manipulación de fechas (ya está en el proyecto).
- El `DateRangePicker` es un componente custom construido siguiendo `frontend/design-system.md`: sin `<input type="date">` nativo del navegador, usando los tokens de color, tipografía y border-radius del design system.
- El popup del picker usa `date-fns` para el calendario grid y navegación entre meses.
