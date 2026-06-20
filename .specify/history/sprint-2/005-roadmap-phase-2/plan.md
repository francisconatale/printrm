# Implementation Plan: Roadmap Phase 2 - Organización Comercial

**Branch**: `005-roadmap-phase-2` | **Date**: 2026-06-16 | **Spec**: [.specify/specs/005-roadmap-phase-2/spec.md](.specify/specs/005-roadmap-phase-2/spec.md)

**Input**: Roadmap de Funcionalidades - Phase 2 & Beyond

## Summary

Transformar **printrm** de una calculadora de costos a una plataforma de gestión comercial. Este plan se enfoca en la **Organización Comercial**: Gestión de Clientes, Biblioteca de Modelos (con previsualización 3D), Agenda de Producción y Compartición de Presupuestos (WhatsApp). El enfoque técnico utiliza Spring Boot para la persistencia local en SQLite y React con React Three Fiber para la visualización de alta fidelidad.

## Technical Context

**Language/Version**: Java 17 (Spring Boot 3.3), TypeScript (React 18)

**Primary Dependencies**: Spring Data JPA, React, @react-three/fiber, @react-three/drei, TanStack Query v5, Lucide React, Zod

**Storage**: SQLite (persistente localmente vía JPA)

**Testing**: JUnit 5, Vitest

**Target Platform**: Desktop (Wrapper)

**Project Type**: Full-Stack (Backend API + Frontend SPA)

**Performance Goals**: <200ms latencia de cálculo, carga asíncrona de modelos 3D en galería para evitar jank.

**Constraints**: Offline-capable, portabilidad total (sin dependencias de cloud).

**Scale/Scope**: Fase 2 del Roadmap comercial.

## Constitution Check

- [x] **Product Protaganist**: El diseño se mantiene neutro, priorizando los datos de clientes y modelos.
- [x] **Monochromatic Accent**: Uso estricto de Ink (#1d1d1f) y escala de grises.
- [x] **Studio Typography**: 17px body, Inter, y JetBrains Mono para datos financieros.
- [x] **Minimalist Elevation**: Shadows solo en el Super-Card y sutil hover en STL Cards.
- [x] **Full-Stack Integrity**: Backend en Spring Boot para persistencia de clientes e historial.

## Project Structure

### Documentation (this feature)

```text
specs/005-roadmap-phase-2/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code

```text
backend/
├── src/main/java/com/printrm/studio/
│   ├── domain/
│   │   ├── biblioteca/    # Implementación STL Library
│   │   ├── clientes/      # Gestión de Clientes
│   │   └── agenda/        # Producción
│   └── scraper/           # (Anteriormente implementado)

frontend/
├── src/
│   ├── features/
│   │   ├── biblioteca/    # UI Galería + 3D
│   │   ├── clientes/      # UI CRM
│   │   └── exportacion/   # Lógica WhatsApp/CSV
```

**Structure Decision**: Aplicación de estructura orientada a dominios (feature-based) tanto en frontend como backend para mantener escalabilidad.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [None] | | |
