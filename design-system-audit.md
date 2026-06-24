# Printrm Studio — Auditoría de Inconsistencias de Diseño

> Fecha: 2026-06-24
> Alcance: 10 páginas, 16 modales, 15+ componentes base, 3 capas de estilo

---

## Problema Raíz

El proyecto tiene **tres sistemas de estilo** compitiendo entre sí que **no se comunican**:

| Capa | Archivo | Primary Blue | Radius `lg` |
|---|---|---|---|
| **Documentación** | `design-system.md` | `#0066cc` | 18px |
| **shadcn CSS vars** | `index.css` `:root` | `#2563eb` | 16px |
| **Componente Button** | `button.tsx` | `#007AFF` | 12px |
| **Studio tokens** | `studio-theme.css` | `--studio-ink` (gris) | 18px |

Ninguno de estos sistemas coincide con los otros. El `button.tsx` ignora por completo todas las variables CSS y usa valores fijos de iOS. `AgendaProduccionView` y `RegistrarMermaProduccionModal` están escritos en un estilo Apple completamente aislado con ~40 valores hex hardcodeados.

---

## 🔴 Críticos (Prioridad 0 — Rompen el sistema)

| # | Problema | Dónde |
|---|---|---|
| C1 | **3 azules primarios distintos** `#0066cc` vs `#2563eb` vs `#007AFF` | `design-system.md`, `index.css:7`, `button.tsx` |
| C2 | **`--accent`/`--accent-foreground` no existen** pero se usan en dropdown-menu, searchable-select, profile-select | `index.css` falta definirlos |
| C3 | **Button.tsx 100% hardcodeado** — 0 variables CSS, 0 tokens | `button.tsx` completo |
| C4 | **AgendaProduccionView aislado** — 30+ hex hardcodeados, no usa ningún token | `AgendaProduccionView.tsx` |
| C5 | **RegistrarMermaProduccionModal hardcodeado** — hex values, sin dark mode | `RegistrarMermaProduccionModal.tsx` |

---

## 🟠 Altos (Prioridad 1 — Inconsistencias visibles)

| # | Problema | Dónde |
|---|---|---|
| A1 | **3 escalas de radius compitiendo** — Tailwind `lg:12px`, `--radius-lg:16px`, `--studio-rounded-lg:18px` | `tailwind.config.js`, `index.css`, `studio-theme.css` |
| A2 | **6 valores de border-radius diferentes** en la UI (16px, 18px, 24px, 32px, 48px, 9999px) | En todas las páginas y modales |
| A3 | **`--studio-body-on-dark` y `--studio-surface-black` referenciados pero no definidos** | `studio-theme.css:202,207` |
| A4 | **`border-dashed` usado en 13 lugares** pese a que el design system lo prohíbe | Empty states en 6 vistas |
| A5 | **`shadow-sm` en cards/tablas** pese a que el DS dice "No se usan sombras" | 8 de 10 vistas |
| A6 | **font-medium (500) usado** pese a que el DS dice "No se usa el peso 500" | `AgendaProduccionView` |
| A7 | **3 sistemas de animación de botón** — `active:opacity-60` (Button) vs `active:scale-[0.97]` (studio-button) vs `hover:scale-95` (RegistrarMermaProduccion) | Disperso |
| A8 | **`--radius-xl` colisión** — Tailwind dice 16px, `index.css` dice 24px | `tailwind.config.js` vs `index.css` |

---

## 🟡 Medios (Prioridad 2 — Limpieza y consistencia)

| # | Problema | Dónde |
|---|---|---|
| M1 | **ConfirmModal y EliminarPiezaModal no usan base Modal** — duplican overlay, portal, animación | Modales |
| M2 | **`focus:ring-black` vs `focus:ring-primary`** en inputs de modales | `CrearOrdenVinculadaModal`, `RegistrarPagoModal` |
| M3 | **`max-w` inconsistente** — 1200px vs 1400px | `PerfilesDashboardView`, `AgendaProduccionView` |
| M4 | **`space-y` inconsistente** — 8 vs 10 | 3 vistas |
| M5 | **`py-6` vs `py-10`** en padding de página | `CalculadoraView` |
| M6 | **`z-[200]` vs `z-[300]`** en overlays | `CalculationSuccessModal` |
| M7 | **3 valores de border-color** en footers de modales: `--studio-hairline`, `border-border`, `#e0e0e0` | Modales |
| M8 | **`!text-4xl` sobreescribe `studio-display-md`** en 6 vistas | Pages |
| M9 | **`font-bold` añadido a `studio-display-md`** (ya weight 600) | `FinanzasDashboardView`, `TransaccionesView` |
| M10 | **Props inválidas**: `icon` y `maxWidth` no existen en `ModalProps` | `EditarProductoModal`, `AgregarStockModal` |
| M11 | **Sidebar usa `--studio-parchment`** — único componente que usa tokens Studio directamente | `sidebar.tsx` |
| M12 | **`--studio-button-secondary-pill` definido 2 veces** en `index.css` y `studio-theme.css` | Ambos archivos |

---

## 🟢 Bajos (Prioridad 3 — Pulido)

| # | Problema | Dónde |
|---|---|---|
| L1 | **`text-[9px]`** fuera de la escala tipográfica | `TransaccionesView` |
| L2 | **Search sin label accesible** | `VentasListView` |
| L3 | **`--success`/`--warning` definidos en CSS pero sin mapping en Tailwind** | `index.css` vs `tailwind.config.js` |
| L4 | **`border-border-subtle` no mapeado en Tailwind** | `query-error-view.tsx` |
| L5 | **Nombre de font-family mismatch** — `'Inter'` vs `"Inter Variable"` | `index.css` vs `tailwind.config.js` |
| L6 | **Sin dark mode implementado** — falta `.dark` class en CSS | Todo el proyecto |
| L7 | **Tokens Studio no usados** — `--studio-primary-on-dark`, `--studio-on-primary`, etc. | `studio-theme.css` |
| L8 | **Falta weight 300** pese a estar en la escala del DS | Todo |

---

## 🎯 Plan de Unificación

### Fase 0 — Elegir un Único Sistema (Decisión de Arquitectura)

No se pueden tener 3 sistemas. La decisión más pragmática es:

> **Eliminar `studio-theme.css` como capa independiente y migrar todo a shadcn CSS variables.**

Razones:
- shadcn ya está en uso y tiene un ecosistema probado
- `studio-theme.css` tiene variables undefined, duplicadas, y naming confuso (`--studio-primary` = text color)
- La sidebar es el único componente que usa `--studio-*` directamente

### Fase 1 — Unificar Tokens Fundamentales

```
Paso 1.1: Elegir el Primary Blue definitivo → #0066cc (documentado)
          Actualizar: index.css --primary, button.tsx, todos los bg-primary/text-primary

Paso 1.2: Definir --accent / --accent-foreground en index.css

Paso 1.3: Unificar la escala de radius
          - Mantener tailwind.config.js como fuente de verdad
          - Ajustar --radius-lg: 12px (tailwind default)
          - Ajustar --radius-xl: 16px (tailwind default)
          - Eliminar --studio-rounded-* duplicados
          - Reemplazar todos los rounded-[...] hardcodeados por rounded-lg, rounded-xl

Paso 1.4: Eliminar variables undefined
          - Definir o reemplazar --studio-body-on-dark, --studio-surface-black
          - Eliminar --studio-rounded-full (duplicado de --studio-rounded-pill)
```

### Fase 2 — Refactorizar Componentes Base

```
Paso 2.1: Re-escribir button.tsx usando CSS variables
          - primary: bg-primary text-primary-foreground
          - secondary: bg-secondary text-secondary-foreground
          - destructive: bg-destructive text-destructive-foreground
          - Active state: scale-[0.97] (unificado)

Paso 2.2: Unificar Modal y ConfirmModal
          - ConfirmModal debe usar base Modal
          - Mismo radius, misma sombra (o ninguna), misma duración
          - Añadir prop hideHeader al modal base

Paso 2.3: Eliminar EliminarPiezaModal y CalculationSuccessModal como portales independientes
          - Migrar a ConfirmModal o base Modal

Paso 2.4: Unificar estilo de inputs (focus:ring-primary en todos)
```

### Fase 3 — Refactorizar Vistas

```
Paso 3.1: Recablear AgendaProduccionView (crítico)
          - Reemplazar todos los bg/text/border hardcodeados por tokens
          - Usar studio-display-md en vez de text-[34px]...
          - Usar Button component en vez de <button> raw

Paso 3.2: Unificar layout de vistas
          - max-w-[1400px] en todas (o decidir 1200px)
          - space-y-10 en todas
          - py-10 en todas

Paso 3.3: Eliminar border-dashed de todos los empty states
          - Reemplazar con border-border sólido o sin borde

Paso 3.4: Eliminar shadow-sm de cards y tablas
          - Design system dice "UI Plana, sin sombras"
```

### Fase 4 — Refactorizar Modales

```
Paso 4.1: RegistrarMermaProduccionModal — refactor completo a tokens

Paso 4.2: Unificar footers de modales
          - border-t border-border
          - justify-end gap-3
          - Button component con variant="primary" | "outline"

Paso 4.3: Unificar z-index de overlays → z-[200]

Paso 4.4: Unificar focus rings → focus:ring-primary

Paso 4.5: Fix props inválidas en EditarProductoModal y AgregarStockModal
```

### Fase 5 — Limpieza

```
Paso 5.1: Mapear --success, --warning, --border-subtle en tailwind.config.js

Paso 5.2: Eliminar --studio-button-secondary-pill duplicado

Paso 5.3: Fix font-family a "Inter Variable" en index.css

Paso 5.4: Agregar label accesible a search de VentasListView

Paso 5.5: Evaluar si mantenemos studio-theme.css o lo fusionamos en index.css
```

---

### Esfuerzo Estimado

| Fase | Archivos a tocar | Riesgo | Tiempo estimado |
|---|---|---|---|
| Fase 0-1 (Tokens) | 4-5 archivos CSS/TS | Alto (cambia colores globales) | 2-3h |
| Fase 2 (Componentes base) | 6-8 archivos | Alto (Button afecta todo) | 3-4h |
| Fase 3 (Vistas) | 10 archivos | Medio (solo estilos) | 4-5h |
| Fase 4 (Modales) | 13-16 archivos | Medio | 3-4h |
| Fase 5 (Limpieza) | 5-8 archivos | Bajo | 1-2h |
| **Total** | **~35-40 archivos** | | **13-18h** |
