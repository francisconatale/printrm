# Frontend Constitution

**Propósito**: Reglas específicas para el agente frontend. Complementa a `.specify/memory/constitution.md` (principios globales) y `.specify/memory/stack.md` (stack tecnológico).

---

## Frontend Agent Rules

Reglas de comportamiento para el agente frontend. Se aplican cuando el scope es `frontend-only` o cuando una tarea está marcada `[FE]`.

### Stack
Leer `.specify/memory/stack.md` para:
- Framework (React, Vue, etc.)
- Styling approach (Tailwind, CSS Modules, etc.)
- State management
- UI component library
- Testing tools
- Form handling
- Routing

### Design
Aplicar las reglas de UI Specification de esta constitution (paleta, tipografía, layout, bordes).

### Responsabilidades
1. **Componentes**: Colocar componentes específicos de página en `./components/` local. Componentes reutilizables en `components/` global. Seguir los patrones de archivos vecinos.
2. **Estado**: Usar lo que dicta `stack.md`. Mantener estado lo más local posible. Lógica compleja → custom hooks/composables.
3. **Estilo**: Seguir `stack.md` para la herramienta de styling y esta constitution para los tokens de diseño.
4. **Performance**: Code splitting, lazy loading, optimización de bundle según lo que provea el stack.
5. **Tipado**: Usar TypeScript si `stack.md` lo especifica. Interfaces explícitas. Evitar `any`.
6. **Testing**: Usar las herramientas que especifica `stack.md`. Testear comportamiento, no implementación.

### Before Coding
1. Leer `.specify/memory/stack.md` — entender el stack
2. Leer esta constitution — entender reglas de diseño
3. Leer archivos vecinos — entender patrones existentes

---

## UI Specification

### Palette
- **Primary Accent:** Ink (#1d1d1f)
- **Surfaces:** Canvas (#ffffff), Parchment (#f5f5f7)
- **Borders:** Hairline (#e0e0e0) — siempre 0.5px
- **Semantic:** Success (#22c55e), Warning (#f59e0b), Destructive (#ef4444)

### Typography Scale
- **Hero Display:** 56px / 600 / -0.025em tracking
- **Display Lg:** 40px / 600 / -0.01em tracking
- **Section Header:** 24px / 600 / -0.015em tracking
- **Body:** 17px / 400 / -0.022em tracking
- **Financial Figures:** Mono, 17–40px según contexto

### Layout
- **Sidebar:** 240px (Fixed)
- **Main Area:** Flex-1 (Scroll independiente)
- **Super-Card:** max-w-[1440px], centrado, bg-white, border-radius 16px, border 0.5px
- **Grid:** Sistema de 8pt (padding/margin siempre múltiplos de 4 u 8)

### API Contract (Frontend ↔ Backend)
- Base URL: `/api/v1`
- Autenticación: ninguna en v1
- Formato: JSON, `Content-Type: application/json`
- Errores: estructura `{ "error": "string", "code": "string" }`

---

## Anti-Patrones de Diseño (Frontend)

### La Exageración Visual
Prohibido el uso de bloques de color sólidos y vibrantes en elementos de navegación o formularios. Los colores semánticos solo aparecen en resultados críticos.

### Densidad de Marketing
Prohibido el uso de heros, frases aspiracionales o ilustraciones decorativas dentro del motor financiero.

### Estado Duplicado
Prohibido mantener el mismo dato en localStorage y en el backend simultáneamente. El backend es la única fuente de verdad para datos persistentes.

---

## Reglas de Negocio (Canónicas)

Estas fórmulas son la fuente de verdad. Viven en el frontend como funciones puras. Cualquier implementación debe producir resultados idénticos.

```
tiempo_total_h    = horas + (minutos / 60)
costo_energia     = (consumo_W / 1000) × tiempo_total_h × precio_kWh
costo_filamento   = (gramos / 1000) × precio_filamento_kg
costo_desgaste    = (costo_repuestos / vida_util_h) × tiempo_total_h
subtotal          = costo_energia + costo_filamento + costo_desgaste + insumos_extra
costo_base        = subtotal × (1 + margen_error / 100)
precio_venta      = costo_base × multiplicador
```

---

## Glosario de Dominio

| Término | Definición |
|---|---|
| **Perfil** | Conjunto de parámetros fijos de una impresora (filamento, energía, desgaste). |
| **Costo base** | Suma de todos los costos de producción con margen de error aplicado. Sin ganancia. |
| **Precio de venta** | Costo base multiplicado por el margen de ganancia. |
| **Multiplicador** | Factor de ganancia. Mayorista: 3×, Minorista: 4×, Llaveros: 5×. |
| **Margen de error** | Porcentaje buffer sobre el subtotal para absorber imprecisiones. |
| **Insumos extra** | Costos adicionales no energéticos ni de filamento (pintura, packaging, etc.). |
| **Super-Card** | Contenedor principal de la app: white, rounded-2xl, border 0.5px. |
