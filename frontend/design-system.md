# Printrm Design System — Studio Edition

Sistema de diseño unificado. Desktop-first, minimalista, basado en shadcn/ui CSS variables como única fuente de verdad.

---

## Principios visuales

- **Producto como protagonista.** La UI retrocede para que los datos hablen. Sin cromo decorativo.
- **Action Blue.** Un único color interactivo (`#0066cc`) para todos los elementos accionables.
- **Tipografía "Studio Tight".** Inter con tracking negativo en titulares.
- **UI Plana.** Sin sombras en cards, botones o navegación. Solo `backdrop-blur` en sub-navs flotantes.
- **Bordes sólidos.** Nunca `border-dashed` o `border-dotted`. La separación se logra con `border-border` de 1px sólido o whitespace.

---

## Paleta de color (CSS Variables)

Definidas en `:root` de `index.css`. Únicas fuente de verdad.

### Semánticas

| Variable | Hex | Uso |
|---|---|---|
| `--background` | `#ffffff` | Fondo de página |
| `--foreground` | `#111827` | Texto principal |
| `--muted` | `#f5f5f7` | Fondo secundario (tiles alternos, hover) |
| `--muted-foreground` | `#6b7280` | Texto secundario, hints |
| `--border` | `#e5e7eb` | Bordes de contenedores, divisores |
| `--border-subtle` | `#f0f0f0` | Borde ultra-suave (ej. toaster) |
| `--input` | `#e5e7eb` | Borde de inputs |
| `--ring` | `#2563eb` | Focus ring (accesibilidad) |
| `--card` | `#ffffff` | Fondo de cards |
| `--card-foreground` | `#111827` | Texto dentro de cards |

### De acción

| Variable | Hex | Uso |
|---|---|---|
| `--primary` | `#0066cc` | Action Blue. Botones, links, focus rings |
| `--primary-foreground` | `#ffffff` | Texto sobre primary |
| `--secondary` | `#f5f5f7` | Fondo de botones secundarios |
| `--secondary-foreground` | `#111827` | Texto sobre secondary |
| `--accent` | `#f5f5f7` | Hover de items en dropdowns/menús |
| `--accent-foreground` | `#1d1d1f` | Texto sobre accent |
| `--destructive` | `#ff3b30` | Acciones destructivas (eliminar, anular) |
| `--destructive-foreground` | `#ffffff` | Texto sobre destructive |
| `--success` | `#34c759` | Estados positivos (pagado, completado) |
| `--success-foreground` | `#ffffff` | Texto sobre success |
| `--warning` | `#ff9f0a` | Estados de advertencia (pendiente, faltante) |
| `--warning-foreground` | `#ffffff` | Texto sobre warning |

### Tipografía

| Variable | Valor | Uso |
|---|---|---|
| `--radius` | `0.5rem` (8px) | Radio base |
| `--radius-lg` | `0.75rem` (12px) | Cards de utilidad |
| `--radius-xl` | `1rem` (16px) | Contenedores principales, modales |
| `--radius-pill` | `9999px` | Botones pill, badges, chips |

---

## Tipografía

**Familia:** `Inter Variable` (variable font via `@fontsource-variable/inter`)

Uso via Tailwind: `font-sans` → `Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif`

### Clases utilitarias (definidas en `studio-theme.css`)

| Clase | font-size | weight | tracking | Uso |
|---|---|---|---|---|
| `studio-display-lg` | 40px | 600 | -0.01em | Títulos de sección principales |
| `studio-display-md` | 34px | 600 | -0.011em | Títulos de página (h1) |
| `studio-tagline` | 21px | 600 | — | Subtítulos de sección |
| `studio-body` | 17px | 400 | -0.022em | Cuerpo de texto general |
| `studio-body-strong` | 17px | 600 | -0.022em | Énfasis inline |
| `studio-caption` | 14px | 400 | -0.016em | Etiquetas y subtítulos |
| `studio-caption-strong` | 14px | 600 | -0.016em | Etiquetas en negrita |

### Reglas tipográficas

1. **Los títulos de página SIEMPRE usan `studio-display-md`** (34px, weight 600). No se sobreescribe con `!text-4xl` ni se agrega `font-bold` extra.
2. **No se usa weight 500 (`font-medium`).** La escala es 300 / 400 / 600 / 700.
3. **Tablas:** headers usan `text-xs uppercase tracking-widest font-bold`.
4. **Cifras financieras:** NO se usa `font-mono` por defecto. Usar `font-semibold` a menos que la tabla sea muy densa y necesite alineación vertical.
5. **El cuerpo de texto mínimo es 10px.** No usar valores menores.

---

## Layout de páginas

Todas las páginas principales siguen este patrón:

```tsx
<main className="flex-1 px-4 md:px-8 py-10 overflow-y-auto">
  <div className="max-w-[1400px] mx-auto space-y-10">
    <h1 className="studio-display-md">Título</h1>
    ...
  </div>
</main>
```

| Propiedad | Valor |
|---|---|
| `max-w` | `[1400px]` |
| `space-y` (secciones) | `10` (40px) |
| `py` (padding vertical) | `10` (40px) |

---

## Componentes

### Button (`@/components/ui/button`)

Único sistema de botones. No usar `<button>` raw ni clases `.studio-button-*`.

| Variant | Classes | Uso |
|---|---|---|
| `primary` | `bg-primary text-primary-foreground` | Acción principal |
| `secondary` | `bg-secondary text-secondary-foreground` | Acción alternativa |
| `destructive` | `bg-destructive text-destructive-foreground` | Eliminar, anular |
| `outline` | `text-primary border-primary` | Cancelar, volver |
| `ghost` | `text-primary hover:bg-secondary` | Acción inline |
| `link` | `text-primary underline-offset-4` | Link estilizado |

| Propiedad | Valor |
|---|---|
| `rounded` | `full` (pill shape: 9999px) |
| `min-h` | `[44px]` (touch target) |
| `active` | `scale-[0.97]` |
| `disabled` | `opacity-50`, `cursor-not-allowed` |

### Modal (`@/components/ui/modal`)

| Propiedad | Valor |
|---|---|
| Overlay | `bg-black/40 backdrop-blur-md` |
| Container | `bg-background rounded-xl` |
| Padding header | `p-10 pb-0` |
| Padding body | `px-10 pb-12` |
| `z-index` overlay | `z-[200]` |
| Sin sombra en container | — |
| Con `hideHeader` | Oculta título + close button |

### ConfirmModal (`@/components/ui/confirm-modal`)

Usa `<Modal hideHeader>` internamente. Props: `isOpen, onClose, title, description, onConfirm, confirmLabel, cancelLabel, variant`.

### Tablas

| Elemento | Style |
|---|---|
| Header | `text-xs uppercase tracking-widest font-bold text-muted-foreground` |
| Header padding | `pb-3` |
| Cell padding | `py-4` |
| Divider | `divide-y divide-border/50` |
| Container | `bg-card rounded-xl border border-border` (sin shadow) |
| Empty state | `flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-xl border border-border/60` (sin `border-dashed`) |

### Formularios (Inputs, Selects)

| Propiedad | Valor |
|---|---|
| Border | `border border-border rounded-lg` |
| Padding | `px-3 py-2` |
| Focus ring | `focus:ring-2 focus:ring-primary` (o `focus-within:ring-2 focus-within:ring-primary`) |
| Background | `bg-background` |
| Label | `text-sm font-semibold text-foreground` |

### Badges / Estados

| Estado | Classes |
|---|---|
| Éxito / Pagado | `bg-success/10 text-success border-success/20` |
| Advertencia / Faltante | `bg-warning/10 text-warning border-warning/20` |
| Error / Fallas | `bg-destructive/10 text-destructive border-destructive/20` |
| Info / Fabricadas | `bg-primary/10 text-primary border-primary/20` |

---

## Anti-patrones (Lo que NO hacer)

1. **No usar `font-mono`** en cifras financieras a menos que sea estrictamente necesario para alineación en tablas densas.
2. **No usar `border-dashed` ni `border-dotted`** — usar `border-border` sólido.
3. **No usar sombras** (`shadow-sm`, `shadow-md`, etc.) en cards, botones, tablas o navegación.
4. **No hardcodear colores hex** — siempre usar CSS variables via Tailwind (`bg-primary`, `text-muted-foreground`, etc.).
5. **No usar `font-medium` (weight 500)** — la escala es 300/400/600/700.
6. **No sobreescribir `studio-display-md`** con `!text-4xl` o `font-bold`.
7. **No duplicar lógica de overlay/portal** — siempre usar `<Modal>` o `<ConfirmModal>` base.

---

## Convenciones de código

- **Imports:** Utilidades desde `@/lib/utils` (función `cn()`).
- **Iconos:** `lucide-react`. Preferir `size={16}` en botones, `size={14}` en iconos inline.
- **Transiciones:** `transition-colors` para hover states de color, `transition-all` solo cuando hay múltiples propiedades.
- **Border radius:** `rounded-lg` (12px) en cards pequeñas, `rounded-xl` (16px) en contenedores principales, `rounded-full` en botones pill.
