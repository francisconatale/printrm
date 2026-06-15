# Design system — Printrm (Studio Edition)

Una interfaz "photography-first" que convierte el motor financiero en una galería de museo. Desktop-first, minimalista, basada en tiles de borde a borde y tipografía editorial.

---

## Principios visuales

- **Producto como protagonista.** La UI retrocede para que los datos y los productos hablen. No hay cromo decorativo ni elementos innecesarios.
- **Galería de museo.** Secciones de borde a borde (*tiles*) que alternan lienzos claros y oscuros. El cambio de color de fondo es el propio divisor.
- **Action Blue.** Un único color interactivo (#0066cc) para todos los elementos accionables. No existe un segundo color de marca.
- **Tipografía "Studio Tight".** Uso de SF Pro (o Inter) con espaciado entre letras negativo en titulares para una cadencia editorial compacta.
- **Sombra de firma.** Una única sombra proyectada en todo el sistema, reservada exclusivamente para renders de productos apoyados sobre una superficie.

---

## Paleta de color

### Brand & Accent

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#0066cc` | Action Blue. Links, botones pill, focus rings |
| `primary-focus`| `#0071e3` | Brillo marginal para focus rings de accesibilidad |
| `primary-dark` | `#2997ff` | Variante brillante para links sobre fondos oscuros |

### Surface & Tiles

| Token | Hex | Uso |
|---|---|---|
| `canvas` | `#ffffff` | Lienzo blanco puro. Tiles de producto y cards de utilidad |
| `parchment` | `#f5f5f7` | Off-white característico. Tiles alternos, footer y sidebar |
| `tile-dark-1` | `#272729` | Fondo principal para tiles oscuros |
| `tile-dark-2` | `#2a2a2c` | Variante micro-aclarada para separación de tiles |
| `surface-black` | `#000000` | Negro puro. Reservado para el header y vacío fotográfico |
| `hairline` | `#e0e0e0` | Borde de 1px para cards de utilidad y divisores suaves |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#1d1d1f` | Titulares y cuerpo de texto en superficies claras |
| `body-on-dark` | `#ffffff` | Todo el texto sobre tiles oscuros |
| `ink-muted-80` | `#333333` | Texto secundario en botones "pearl" y footer |
| `ink-muted-48` | `#7a7a7a` | Texto desactivado y letra pequeña legal |

---

## Tipografía

**Familia:** Inter (como sustituto de SF Pro)

### Jerarquía editorial

| Nombre | Tamaño | Peso | Tracking | Uso |
|---|---|---|---|---|
| `hero-display` | 56px | 600 | -0.025em | Titulares hero principales |
| `display-lg` | 40px | 600 | -0.01em | Titulares de tiles de producto |
| `display-md` | 34px | 600 | -0.011em | Títulos de sección y headers |
| `lead` | 28px | 400 | +0.007em | Sub-copia de productos |
| `body` | 17px | 400 | -0.022em | Cuerpo de texto general |
| `body-strong` | 17px | 600 | -0.022em | Énfasis inline |
| `caption` | 14px | 400 | -0.016em | Subtítulos y etiquetas |
| `nav-link` | 12px | 400 | -0.01em | Enlaces de navegación lateral |

**Reglas tipográficas:**
1. Los titulares (17px+) siempre llevan **tracking negativo**.
2. El cuerpo de texto es de **17px**, no 16px.
3. No se usa el peso **500**. La escala es 300 / 400 / 600 / 700.

---

## Espaciado

Sistema basado en 8px, con ajustes finos para tipografía.

| Token | Valor | Uso |
|---|---|---|
| `xxs` | 4px | Micro-ajustes |
| `xs` | 8px | Gap interno de componentes |
| `sm` | 12px | Espaciado entre grupos |
| `md` | 17px | Ritmo base (coincide con el font-size) |
| `lg` | 24px | Padding interno de cards |
| `xl` | 32px | Márgenes de bloque |
| `section` | 80px | Padding vertical de tiles de producto |

---

## Border radius

| Token | Valor | Uso |
|---|---|---|
| `radius-none` | 0px | Tiles full-bleed (no se redondean) |
| `radius-sm` | 8px | Botones de utilidad oscuros |
| `radius-lg` | 18px | Cards de utilidad y de la tienda |
| `radius-pill` | 9999px | Botones primarios, búsqueda, chips |

---

## Elevación y profundidad

- **UI Plana:** No se usan sombras en cards, botones o navegación.
- **Product Shadow:** `box-shadow: 3px 5px 30px 0px rgba(0,0,0,0.22)`. Reservado solo para renders de productos.
- **Glassmorphism:** `backdrop-filter: blur(20px)` en barras flotantes y sub-navs.

---

## Layout — Shell integrado

```
Sidebar (Parchment / #f5f5f7)
└── Main Content (Lienzo blanco)
    ├── Header (Integrado, búsqueda + toggle)
    └── Tiles Stack (Alternancia claro/oscuro)
```

### Sidebar
- Ancho: 80px (fijo).
- Fondo: `#f5f5f7`.
- Separación: Borde derecho de 1px `#e0e0e0`.
- Items: Botones `pill` de 48x48px. Activo en `#0066cc`.

### Main Content
- Los tiles de producto son de borde a borde dentro del área de contenido.
- El header vive dentro del scroll o fijo, con tipografía `display-md`.

---

## Componentes clave

### Botones
- **Primario:** Pill shape, azul `#0066cc`, texto blanco, escala 0.95 al pulsar.
- **Secundario:** Pill shape, borde azul 1px, fondo transparente.
- **Icono Circular:** 44x44px, fondo traslúcido `rgba(210, 210, 215, 0.64)`.

### Cards de tienda (Utility Cards)
- Fondo blanco puro, borde 1px `#e0e0e0`, radio 18px.
- Sin sombra. El producto dentro de la card puede llevar la sombra de firma.

## Anti-patrones de diseño (Lo que NO hacer)

Para mantener la estética de alta gama y evitar la fatiga visual, se prohíben los siguientes comportamientos:

- **La Exageración Visual:** Evitar indicadores de selección que utilicen bloques de color sólidos y vibrantes en elementos pequeños (como el sidebar). La selección debe ser sutil (cambios leves de fondo, indicadores de línea o variaciones de peso tipográfico).
- **Abuso del Color de Acento:** No usar colores saturados (como el azul anterior) de forma masiva. El color debe ser un recurso escaso y sofisticado, preferiblemente tendiendo a una paleta monocromática (Ink/Black/White).
- **Cromo Ruidoso:** Prohibido el uso de sombras en elementos de la interfaz (botones, cards, navs) y el uso de **bordes punteados o discontinuos** (dashed/dotted). La separación se logra mediante el espacio en blanco y bordes *hairline* de 1px sólidos.
- **Densidad de Marketing en Herramientas:** No mezclar layouts de "venta" (heros gigantes, frases aspiracionales) en áreas de trabajo o motores financieros. Las herramientas deben ser densas, funcionales y directas.

---

## Reglas de consistencia

1. **Acento Monocromático:** Cualquier elemento que pida un click o atención debe usar el tono `Ink` (#1d1d1f) o variaciones de opacidad del mismo. El color saturado queda descartado para evitar fatiga visual.
2. **Bordes Sólidos:** Todos los contenedores, zonas de carga y divisores deben usar líneas sólidas de 1px (`#e0e0e0`) o simplemente espacio en blanco. Nunca usar `border-dashed`.
3. **Ritmo de Tiles:** Nunca colocar dos tiles del mismo color seguidos (ej: Blanco → Parchment → Oscuro).
3. **Micro-interacción:** Todos los botones deben reaccionar con `transform: scale(0.95)` al ser presionados.
4. **Cifras financieras:** Usar fuente mono solo si es estrictamente necesario para alineación en tablas densas; de lo contrario, preferir `body-strong`.
5. **Sidebar visible:** El sidebar es la ancla de navegación; no se oculta ni se colapsa.

