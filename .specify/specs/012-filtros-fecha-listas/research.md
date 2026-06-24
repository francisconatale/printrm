# Research: Filtros de Fecha en Listas

**Phase**: 0 — Technical Decision Record

---

## 1. Estrategia de filtrado en backend

**Decision**: Usar `@RequestParam` opcionales `fechaDesde` y `fechaHasta` en los controllers existentes, con queries `Between` en los repositories.

**Rationale**: Es el approach más simple y consistente con la arquitectura actual. Los controllers ya usan `@RequestParam(required = false)` para `clienteId`, por lo que el patrón es conocido. No se necesita una capa de Specifications completa.

**Alternatives considered**:
- **Spring Data JPA Specifications**: Más flexible pero overkill para dos parámetros.
- **Criteria API**: Muy verboso, no justificado para este alcance.
- **Filtro en memoria**: No escala, rompe paginación.

**Pattern**: Cada repository gana un método `findByFieldAndFechaBetween` o se modifica el `findAll(Pageable)` a `findAll(Specification, Pageable)` según convenga.

---

## 2. Componente DateRangePicker (frontend)

**Decision**: Componente custom con popup calendario grid usando `date-fns`, sin depender de `<input type="date">` nativo del navegador.

**Rationale**: El nativo de Chrome/Firefox no es estilizable con el design system. Un picker custom usando `date-fns` permite control total sobre look & feel, seguir los tokens del design system, y consistencia cross-browser.

**Implementation approach**:
- Popup calendario grid de 2 meses (mes actual + siguiente o mes anterior + actual)
- Botones de navegación entre meses usando `<` `>` con lucide-react
- Inputs de texto editables (formato DD/MM/YYYY) con parse manual
- Atajos: Hoy, Esta Semana, Este Mes, Últimos 30 Días
- `useDateRangePicker` hook que encapsula la lógica de selección

**Alternatives considered**:
- **React Datepicker**: Dependencia externa pesada, difícil de estilizar con el DS.
- **shadcn/ui Calendar**: Usa `react-day-picker`, posible alternativa pero más peso. Con `date-fns` solo ya cubrimos el grid.
- **Native `<input type="date">`**: No estilizable, inconsistencia cross-browser.

---

## 3. Manejo de Ventas (no es entidad propia)

**Decision**: Las ventas son transacciones agrupadas (INGRESO + VENTA). El filtro de fecha se aplica ANTES del agrupamiento.

**Rationale**: `VentaService.listar()` actualmente trae TODAS las transacciones y las agrupa en memoria. Para agregar paginación + filtro de fecha, necesitamos mover el filtro al query de base de datos.

**Alternatives considered**:
- **Filtrar en memoria después de agrupar**: Funciona pero no escala. Si hay 10k transacciones y filtramos por 1 día, igual traemos 10k registros.
- **Agrupar en SQL (GROUP BY grupoId)**: Más eficiente pero complica el paginado (cada página sería un grupo, no una transacción).

**Decision details**: Refactorizar `VentaService.listar()` para aceptar `fechaDesde`/`fechaHasta`, pasarlos al `TransaccionRepository` con filtro `Between` en `fecha` ANTES del agrupamiento.

---

## 4. Formato de fechas en API

**Decision**: ISO-8601 (`yyyy-MM-dd'T'HH:mm:ss`), mismo formato que ya usa el backend.

**Rationale**: El backend ya usa `@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")` en `PedidoResponseDTO.fechaCreacion`. Consistencia total.

**Frontend**: Los hooks pasan `fechaDesde` y `fechaHasta` como strings ISO-8601. El `DateRangePicker` emite un objeto `{ fechaDesde?: string, fechaHasta?: string }` con formato ISO.
