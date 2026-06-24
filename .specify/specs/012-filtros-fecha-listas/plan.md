# Implementation Plan: Filtros de Fecha en Listas

**Branch**: `012-filtros-fecha-listas` | **Date**: 2026-06-24 | **Spec**: `.specify/specs/012-filtros-fecha-listas/spec.md`

## Summary

Agregar filtros de fecha (rango desde/hasta) en las vistas de listas de Transacciones, Ventas, Pedidos y Libro Diario. Incluye un componente `DateRangePicker` custom (sin `<input type="date">` nativo), cambios en hooks del frontend para pasar parámetros de fecha, y modificaciones en controllers/repositories del backend para filtrar por rango en endpoints GET paginados.

## Technical Context

**Language/Version**: Java 21 (Spring Boot 3.x), TypeScript 5 (React 18)

**Primary Dependencies**: Spring Data JPA, TanStack Query, date-fns, lucide-react, Tailwind CSS 3.4

**Storage**: SQLite via JPA/Hibernate

**Testing**: JUnit 5 (backend), Vitest (frontend)

**Target Platform**: Desktop via Wrapper

**Frontend Stack**: React 18, Vite, Tailwind CSS 3.4, shadcn/ui CSS variables

**Performance Goals**: API response <200ms con filtros de fecha aplicados

**Constraints**: Las fechas viajan como ISO-8601 string entre frontend y backend. Backend almacena como `LocalDateTime` (UTC).

**Scale/Scope**: 4 vistas impactadas. Los endpoints ya están paginados. El filtro de fecha se suma como parámetro opcional.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Product Protaganist**: Sí — los filtros son discretos, no compiten con los datos
- [x] **Monochromatic Accent**: Sí — Action Blue solo en elementos interactivos del picker
- [x] **Studio Typography**: Sí — tipografía Inter, tracking negativo en labels
- [x] **Minimalist Elevation**: Sí — sin sombras, bordes sólidos
- [x] **Full-Stack Integrity**: Sí — cambios planeados en backend (controllers/repositories) y frontend (hooks/componentes)

## Project Structure

```
specs/012-filtros-fecha-listas/
├── plan.md              # Este archivo
├── research.md          # Decisiones técnicas
├── data-model.md        # Modelo de datos (cambios)
├── quickstart.md        # Guía de validación
├── contracts/           # Contratos API
└── tasks.md             # (/speckit.tasks)

frontend/src/
├── components/ui/
│   └── date-range-picker.tsx    # NUEVO
├── features/finanzas/
│   └── api/finanzas.api.ts      # MODIFICADO
├── features/pedidos/
│   └── api/pedidos.api.ts       # MODIFICADO
├── features/ventas/
│   └── api/ventas.api.ts        # MODIFICADO

backend/src/main/java/com/printrm/studio/domain/
├── finanzas/
│   ├── TransaccionController.java    # MODIFICADO
│   ├── TransaccionService.java       # MODIFICADO
│   └── TransaccionRepository.java    # MODIFICADO
├── pedidos/
│   ├── PedidoController.java         # MODIFICADO
│   ├── PedidoService.java            # MODIFICADO
│   └── PedidoRepository.java         # MODIFICADO
└── venta/
    ├── VentaController.java          # MODIFICADO
    └── VentaService.java             # MODIFICADO
```

**Structure Decision**: Full-stack web application — backend Spring Boot con capas Controller → Service → Repository. Frontend React con custom hooks + TanStack Query.

## Complexity Tracking

No constitution violations detected.
