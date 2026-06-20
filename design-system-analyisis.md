# Printrm Studio — Análisis del Design System

> Basado en la lectura de `index.css`, `studio-theme.css`, `tailwind.config.js` y `design-system.md`

---

## 1. Arquitectura: 3 capas superpuestas

El sistema tiene **tres fuentes de verdad** que compiten entre sí:

| Capa | Archivo | Propósito | Problema |
|---|---|---|---|
| **Shadcn/Tailwind** | `index.css` + `tailwind.config.js` | Variables `--background`, `--primary`, etc. + Tailwind classes | Es la capa que la mayoría de componentes usa (bien) |
| **Studio Tokens** | `studio-theme.css` | Variables `--studio-canvas`, `--studio-ink`, etc. | Duplican funcionalidad de Shadcn. Casi ningún componente las usa |
| **Hardcodeo directo** | En cada componente | `bg-white`, `border-[#e0e0e0]`, `text-[#7a7a7a]` | Ignora ambas capas. Es la fuente de todos los bugs de dark mode |

**Conclusión:** `studio-theme.css` es un sistema fantasma — bien intencionado, pero la mayoría del código lo ignora. Los componentes usan valores hardcodeados o Shadcn.

---

## 2. Color: Mapeo inconsistente

### 2A. Mismo color, nombre distinto

```css
--border:        #e0e0e0;   /* Shadcn */
--studio-hairline: #e0e0e0; /* Studio */
```

Son el mismo color (#e0e0e0) con dos nombres. Si un componente usa uno y otro usa el segundo, en dark mode ambos se overridean correctamente. Pero si un componente usa `border-[#e0e0e0]` directo, **no hereda ningún override**.

### 2B. Shadow mapping

| Variable | Light | Dark |
|---|---|---|
| `--studio-product-shadow` | `rgba(0,0,0,0.22)` | `rgba(0,0,0,0.55)` ✓ |

Bien mapeado. Pero ningún componente de UI debería usar esto (es solo para renders 3D).

### 2C. Missing dark overrides

| Variable | Definida en `:root` | Override en `.dark` | Impacto |
|---|---|---|---|
| `--studio-tile-dark-1` | `#272729` | ❌ No | Se mantiene `#272729`. En dark mode el canvas es `#1c1c1e`, entonces `.studio-tile-dark` es **más claro** que el fondo. La jerarquía se invierte |
| `--studio-tile-dark-2` | `#2a2a2c` | ❌ No | Mismo problema |
| `--studio-surface-black` | `#000000` | ❌ No | Intencional (negro es negro en ambos modos) |
| `--studio-primary-dark` | `#2997ff` | ❌ No | Poco riesgo: en dark `--studio-primary-action` ya es `#2997ff` |

### 2D. Inconsistencia de radius: 3 escalas distintas

```css
/* Shadcn (tailwind.config) */
sm: 4px, md: 8px, lg: 12px, xl: 16px

/* Studio (studio-theme.css) */
--studio-rounded-sm: 8px, --studio-rounded-md: 11px, --studio-rounded-lg: 18px

/* Modal real */
rounded-[2rem] → 32px
```

Tres escalas que no conversan. Un `rounded-lg` en Tailwind son 12px; un `--studio-rounded-lg` son 18px. El modal usa 32px que no está representado en ninguna variable.

---

## 3. Tipografía:única capa consistente

Las clases `.studio-*` tipográficas están bien definidas (hero, display, body, caption, nav). 17px de body es correcto. Inter tracking negativo está bien.

**Pero:** 
- `.studio-tagline` no existe en el design system original (el comentario en CSS lo admite: "alias de display-sm")
- `.mono` existe solo en `index.css`, no en `studio-theme.css`
- No hay clase para `font-weight: 300` (light) que el design-system.md menciona como parte de la escala

---

## 4. Componentes base: botones duplicados

`.studio-button-primary` está definido **dos veces**: una en `index.css` (línea 135, con `@apply`) y otra en `studio-theme.css` (línea 200, con CSS manual). Son funcionalmente idénticos pero la versión de `index.css` usa `@apply` y la de `studio-theme.css` usa propiedades CSS directas. 

Si alguien modifica uno y no el otro, se descuadran.

---

## 5. Problemas estructurales

| # | Problema | Riesgo | Solución |
|---|---|---|---|
| 1 | Dos sistemas de tokens paralelos (Shadcn + Studio) que describen lo mismo | Alto — confusión, duplicación, componentes que usan el "equivocado" | Elegir UNO (Shadcn, que es el que Tailwind entiende nativamente) y migrar Studio a ser un conjunto de clases utilitarias que referencien Shadcn |
| 2 | Valores hardcodeados en componentes en vez de variables CSS | Crítico — dark mode roto en ~20 archivos | Reemplazar sistemáticamente `bg-white` → `bg-background`, `border-[#e0e0e0]` → `border-border`, `text-[#7a7a7a]` → `text-muted-foreground` |
| 3 | `design-system.md` describe solo light mode | Medio — nuevos desarrolladores no saben qué valores usar en dark | Agregar tabla de dark mode al MD |
| 4 | `--studio-tile-dark-1` sin override en dark | Bajo — pero inverted hierarchy es feo | Agregar `--studio-tile-dark-1: #1a1a1c` en `.dark` (más oscuro que canvas) |
| 5 | Modal usa `rounded-[2rem]` que no existe como variable | Bajo — pero rompe consistencia si cambia el systema | Agregar `--radius-2xl: 2rem` o similar |
| 6 | LoadingScreen usa `indigo-500` (#6366f1) | Medio — brand color incorrecto, no es Action Blue | Cambiar a `text-primary` |

---

## 6. Resumen para acción inmediata

### Prioridad 1 (dark mode roto)
Reemplazar en TODOS los componentes:
```
bg-white                    → bg-background
border border-[#e0e0e0]    → border border-border
text-[#7a7a7a]             → text-muted-foreground
bg-[#f5f5f7]               → bg-muted
```

### Prioridad 2 (arquitectura)
Decidir: ¿Shadcn o Studio? Recomendación: **Shadcn como fuente de verdad**, Studio tokens como capa de compatibilidad. No mantener dos sistemas iguales.

### Prioridad 3 (consistencia)
Unificar las 3 escalas de border radius en una sola.

### Prioridad 4 (documentación)
Actualizar `design-system.md` con tabla completa de dark mode y la escala de radius unificada.
