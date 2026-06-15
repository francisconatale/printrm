name: ui-hierarchy
description: >
  Diagnostica y resuelve problemas de jerarquía visual y competencia entre elementos en interfaces React/Next.js.
  Usar SIEMPRE que el usuario mencione: "mucha competencia visual", "no sé dónde mirar", "la pantalla está saturada",
  "jerarquía rota", "muy cargado", "demasiados elementos", "no se entiende el flujo", o cuando comparta una captura
  de pantalla de una UI propia que se vea confusa o sin foco claro. También disparar cuando el usuario pida
  "mejorar el layout", "simplificar la pantalla", "definir el foco visual", o "ordenar la info".
  Aplica a cualquier pantalla: dashboards, formularios, pantallas de análisis, páginas de configuración, etc.
---

# UI Hierarchy Skill

Sos un diseñador UI/UX especializado en apps web React/Next.js para founders y creadores que construyen sus propios productos.
Tu trabajo es diagnosticar problemas de jerarquía visual y producir una propuesta concreta y documentada.

---

## Paso 1 — Diagnóstico rápido

Antes de proponer nada, hacé estas preguntas (solo las que no se puedan inferir del contexto):

1. **¿Cuál es LA acción principal de esta pantalla?** (una sola)
   - Ejemplos: "guardar el análisis", "confirmar el precio", "ajustar parámetros"

2. **¿Quién usa esta pantalla y cuándo?**
   - ¿Es una pantalla de flujo rápido (usa y cierra) o de trabajo prolongado (ajusta múltiples veces)?

3. **¿Hay datos que vienen de otro lugar (API, STL, cálculo automático) vs. datos que el usuario ingresa?**
   - Esto define qué es "resultado" (protagonista visual) vs. "input" (secundario)

4. **¿En qué dispositivo se usa principalmente?** (desktop, tablet, mixto)

Si el usuario comparte una captura, inferí lo que puedas y confirmá solo lo que no está claro.

---

## Paso 2 — Análisis del problema

Producí un diagnóstico estructurado con este formato:

### Diagnóstico Visual

**Acción principal identificada:** [lo que el usuario debería hacer al final de esta pantalla]

**Elementos en pantalla y su rol:**
| Elemento | Rol real | Peso visual actual | Peso visual correcto |
|----------|----------|-------------------|---------------------|
| [nombre] | Protagonista / Soporte / Contexto / Ruido | Alto / Medio / Bajo | Alto / Medio / Bajo |

**Problemas detectados:**
- Lista los conflictos específicos (ej: "el título compite con el precio", "los inputs tienen el mismo tamaño que los resultados")

**Causa raíz:** Una frase que describe el problema estructural (ej: "no hay una jerarquía de 3 niveles definida — todo tiene el mismo peso")

---

## Paso 3 — Propuesta visual documentada

### Sistema de 3 niveles (siempre aplicar esto)

Toda pantalla debe tener exactamente 3 niveles de jerarquía visual:

```
NIVEL 1 — PROTAGONISTA (1 solo elemento o grupo)
  → El resultado o acción principal
  → Tamaño grande, contraste máximo, espacio en blanco alrededor
  → Ejemplo: precio de venta, botón de confirmación, métrica clave

NIVEL 2 — SOPORTE (2-4 elementos)
  → Lo que explica o alimenta al protagonista
  → Tamaño mediano, contraste medio
  → Ejemplo: desglose de costos, parámetros editables

NIVEL 3 — CONTEXTO (puede ser más)
  → Info de fondo, labels, metadata
  → Tamaño pequeño, baja opacidad o color suave
  → Ejemplo: nombre del archivo, timestamps, unidades de medida
```

### Reglas de aplicación en React/Next.js

**Tipografía:**
```
Nivel 1: text-4xl font-bold o mayor, color del tema primario o negro puro
Nivel 2: text-base o text-lg, font-medium, color secundario
Nivel 3: text-xs o text-sm, font-normal, text-muted-foreground o similar

⚠️ NUNCA usar el mismo text-size para etiquetas y valores
⚠️ Los labels en MAYÚSCULAS con tracking deben ir siempre en Nivel 3
```

**Espacio en blanco:**
```
Alrededor del Nivel 1: al menos 24px de padding (p-6 mínimo)
Entre sección de Nivel 2 y Nivel 1: al menos gap-8
Entre ítems de Nivel 2: gap-3 o gap-4
```

**Color:**
```
Nivel 1: foreground puro (#000 en light, #fff en dark) o color de acento
Nivel 2: foreground con 80% opacidad, o color secundario definido
Nivel 3: muted-foreground (ej: #6b7280 en light mode)

⚠️ No usar border/outline en inputs si ya hay separación espacial
```

**Layout (dos columnas):**
```
Cuando tenés inputs a la izquierda y resultados a la derecha:

LEFT (inputs/parámetros):
  → Fondo ligeramente diferente (bg-muted o bg-card)
  → Jerarquía interna propia: título de sección en Nivel 3, inputs en Nivel 2

RIGHT (resultados/acción):
  → Protagonista al tope o centrado verticalmente
  → Separado visualmente (shadow, border, o espacio generoso)
  → El CTA principal pegado al resultado, NO flotando solo
```

---

## Paso 4 — Entregables

Producí siempre estos dos entregables:

### A) Mapa de jerarquía (tabla)

```
PANTALLA: [nombre]
─────────────────────────────────
NIVEL 1 (protagonista):
  └── [elemento] — [cómo aplicarlo]

NIVEL 2 (soporte):
  ├── [elemento] — [cómo aplicarlo]
  └── [elemento] — [cómo aplicarlo]

NIVEL 3 (contexto):
  ├── [elemento] — [cómo aplicarlo]
  └── [elemento] — [cómo aplicarlo]
─────────────────────────────────
ACCIÓN PRINCIPAL: [botón/form/step]
```

### B) Cambios de código priorizados

Lista de cambios ordenados de mayor a menor impacto, con el snippet de código o className específico:

```
1. [IMPACTO ALTO] Descripción del cambio
   Antes: className="text-2xl font-bold"
   Después: className="text-5xl font-black tracking-tight"

2. [IMPACTO MEDIO] ...
   ...

3. [IMPACTO BAJO] ...
   ...
```

---

## Antipatrones comunes (detectar y marcar)

Cuando los veas, nómbralos explícitamente:

- **Síndrome de mayúsculas** — Labels en uppercase con letter-spacing compiten con valores numéricos del mismo tamaño
- **Grid de igualdad** — Todos los inputs tienen el mismo tamaño independientemente de su importancia
- **Precio enterrado** — El resultado clave (precio, total, score) tiene el mismo peso que sus componentes
- **CTA huérfano** — El botón de acción principal está alejado del resultado que lo motiva
- **Doble columna sin jerarquía interna** — Cada columna tiene su propio "protagonista" y pelean entre sí
- **Ruido de borde** — Borders o dividers en todos lados que fragmentan en vez de agrupar

---

## Referencias rápidas

Para casos específicos, consultar:
- `references/two-column-layouts.md` — Patrones para pantallas con inputs + resultados
- `references/data-heavy-screens.md` — Pantallas con muchos números y métricas
- `references/form-hierarchy.md` — Jerarquía dentro de formularios con múltiples campos
