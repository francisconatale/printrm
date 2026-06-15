# Implementation Plan: Core App Shell y Layout

**Branch**: `004-core-app-shell` | **Date**: 2026-06-15 | **Constitution**: `.specify/constitution.md`

## Summary

Implementar la estructura visual fundacional de la aplicación: design system tokens en Tailwind, el Super-Card container, el Sidebar de navegación y el layout principal de dos columnas. Es el prerequisito de todos los demás features. Sin el shell, ninguna otra feature puede renderizarse correctamente.

---

## Casos de Uso

### CU-00 — Cargar la aplicación
**Actor:** Usuario | **Prioridad:** P0

**Flujo principal:**
1. El usuario abre la aplicación en el navegador
2. El sistema renderiza el layout base: fondo `#f5f5f7`, Super-Card centrado
3. El Sidebar muestra el logo y los ítems de navegación
4. La vista activa por defecto es "Calculadora" (el motor de cálculo)
5. El último perfil activo se carga automáticamente desde la API

**Flujo alternativo — Sin perfiles:**
Si no existe ningún perfil, el área de calculadora muestra el estado vacío ("Creá tu primer perfil") con acceso directo al formulario de creación.

---

### CU-00b — Navegar entre secciones
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario hace clic en un ítem del Sidebar (Calculadora / Historial / Perfiles)
2. El ítem activo cambia de estado (fondo blanco + border 0.5px)
3. El área principal renderiza la vista correspondiente sin recarga de página
4. El scroll del área principal se resetea al tope

---

## Objetivos del Módulo

**Objetivo principal:** Establecer el baseline visual y estructural de la aplicación: la "cáscara" sobre la que se montan todos los demás módulos.

**Objetivos específicos:**
- Implementar los design tokens de la Constitution en Tailwind (colores, tipografía, bordes, grid)
- Construir el Super-Card container y el Sidebar con sus estados de navegación
- Garantizar que el layout es estable (cero layout shifts) al navegar entre secciones

**Métricas de éxito:**
- 100% de los bordes del shell son exactamente 0.5px
- 100% de paddings y margins son múltiplos de 4 u 8px
- Distribución de color: 95% Parchment/Canvas, 4% Hairline/textos secundarios, 1% Ink
- Cero layout shifts al navegar entre vistas (CLS = 0)

---

## Technical Context

**Stack:**
- Frontend: React 18, TypeScript, Tailwind CSS 3.4, React Router v6
- Backend: N/A para este feature (solo estructura de UI)

**Testing:**
- Visual: audit manual contra checklist de Constitution
- Funcional: React Testing Library — verificar que la navegación cambia la vista activa y el estado del Sidebar

**Performance:** Renderizado inicial del shell ≤100ms. Cambio de vista ≤50ms (sin fetching de datos).

---

## Constitution Check

- [x] **Product Protagonist:** El shell es neutro. No compite con los datos financieros.
- [x] **Monochromatic Sophistication:** Solo Ink, Canvas, Parchment y Hairline en el shell. Sin colores saturados.
- [x] **Studio Tight Typography:** Inter configurada globalmente. Tracking negativo en headers de sección.
- [x] **Minimalist Elevation:** Única sombra de firma solo en el Super-Card. El Sidebar no tiene sombra.
- [x] **Hairline Borders:** Todos los bordes del shell en 0.5px. Configurado como utilidad custom en Tailwind.
- [x] **8pt Grid:** Todos los espaciados son múltiplos de 4 u 8. Documentado en `tailwind.config.js`.

---

## Project Structure

### Frontend
```text
frontend/
├── tailwind.config.js              # Tokens: colores, border-width 0.5, fuentes
├── src/
│   ├── index.css                   # Inter font, reset global, CSS vars
│   ├── main.tsx                    # Entry point, QueryClient, Router
│   ├── App.tsx                     # Rutas + AppShell wrapper
│   └── components/
│       └── layout/
│           ├── AppShell.tsx        # Super-Card container
│           ├── Sidebar.tsx         # Navegación fija 240px
│           ├── NavItem.tsx         # Ítem de nav con estado activo/hover
│           └── MainArea.tsx        # Área de contenido con scroll independiente
```

---

## Key Entities

```typescript
interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  isActive: boolean;
}

// Rutas de la aplicación
const ROUTES = {
  CALCULADORA: '/',
  HISTORIAL: '/historial',
  PERFILES: '/perfiles',
} as const;
```

---

## Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      ink:       '#1d1d1f',
      canvas:    '#ffffff',
      parchment: '#f5f5f7',
      hairline:  '#e0e0e0',
    },
    borderWidth: {
      '0.5': '0.5px',         // utilidad: border-0.5
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    borderRadius: {
      'xl':  '16px',           // Super-Card
      'lg':  '12px',           // cards internas
      'md':  '8px',            // botones, inputs
    },
    boxShadow: {
      'signature': '3px 5px 30px 0px rgba(0,0,0,0.22)', // solo Super-Card
    },
  },
  // Restringir fontWeight a 400 y 600 únicamente
  fontWeight: {
    normal: '400',
    semibold: '600',
  },
}
```

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────┐
│  bg-parchment (#f5f5f7)  — viewport completo            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Super-Card  bg-canvas  rounded-xl  border-0.5    │  │
│  │  shadow-signature  max-w-[1440px]  min-h-[calc    │  │
│  │  (100vh-48px)]                                    │  │
│  │                                                   │  │
│  │  ┌──────────┐  ┌──────────────────────────────┐  │  │
│  │  │          │  │                              │  │  │
│  │  │ Sidebar  │  │    Main Area                 │  │  │
│  │  │  240px   │  │    flex-1                    │  │  │
│  │  │  fixed   │  │    scroll independiente      │  │  │
│  │  │          │  │    padding: 32px             │  │  │
│  │  │          │  │                              │  │  │
│  │  └──────────┘  └──────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Sidebar (240px)
- Logo area: 64px alto, padding 24px, ícono Ink sobre fondo Canvas
- Nav items: 44px alto, padding horizontal 16px, gap 4px entre items
- Estado activo: `bg-canvas border-0.5 border-hairline rounded-md`
- Estado hover: `bg-parchment` (transición 100ms)
- Estado default: sin fondo, sin borde

### Main Area
- Padding: 32px en todos los lados
- Scroll: `overflow-y-auto` con scroll independiente del Sidebar
- Sin sombras internas ni bordes adicionales

---

## Functional Requirements

| ID | Requisito |
|---|---|
| FR-031 | El sistema debe renderizar un fondo `#f5f5f7` cubriendo el viewport completo |
| FR-032 | El Super-Card debe tener `border-radius: 16px`, `border: 0.5px #e0e0e0`, `box-shadow: signature` |
| FR-033 | El Sidebar debe tener ancho fijo de 240px y altura completa del Super-Card |
| FR-034 | Los ítems de navegación deben tener estado activo (bg-canvas + border-0.5) y hover (bg-parchment) |
| FR-035 | La vista activa debe cambiar al hacer clic en un ítem del Sidebar sin recarga |
| FR-036 | El área principal debe tener scroll independiente del Sidebar |
| FR-037 | La fuente Inter debe aplicarse globalmente. Pesos permitidos: 400 y 600 únicamente |
| FR-038 | Los valores financieros deben usar fuente monoespaciada |
| FR-039 | El Super-Card debe tener `min-height: calc(100vh - 48px)` |
| FR-040 | La distribución de color debe cumplir aproximadamente la regla 95/4/1 |

---

## Complexity Tracking

| Decisión | Por qué | Alternativa rechazada |
|---|---|---|
| React Router v6 para navegación | SPA nativa, sin recargas, historial del navegador funcional | Estado en useState: sin deep-linking, sin botón atrás |
| `border-width: 0.5` como utilidad custom | El default de Tailwind es 1px mínimo. 0.5px es requerimiento de Constitution | CSS inline en cada elemento: inmantenible |
| `fontWeight` restringido en config | Previene uso accidental de pesos no autorizados por Constitution | Solo convención: fácil de violar sin enforcement |
| Sombra `signature` solo en Super-Card | Constitution prohíbe sombras en otros elementos. Centralizar en config previene uso incorrecto | Utilidad genérica: invita a reutilización prohibida |

---

## Assumptions

- La aplicación es desktop-first. Mobile responsiveness es secundario y no es requisito de esta fase.
- Los íconos del Sidebar provienen de Lucide React (ya en las dependencias del plan `001`).
- No existe autenticación en v1, por lo que no hay estados de login/logout en el Sidebar.
- El Super-Card tiene un margen vertical de 24px respecto al viewport (`py-6`).
