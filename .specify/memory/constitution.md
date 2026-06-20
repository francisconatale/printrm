<!--
Sync Impact Report:
- Version change: 1.0.0
- Core principles defined from SRS v1.0 + design system inherited
- Stack: Spring Boot (backend) + React 18 (frontend)
- Templates initialized:
  - .specify/specs/001-perfiles-gastos-fijos/
  - .specify/specs/002-motor-de-calculo/
  - .specify/specs/003-historial-exportacion/
  - .specify/specs/004-core-app-shell/
- Follow-up TODOs: N/A
-->

# Calculadora 3D — Constitution

**Agent Loading**: Cada agente carga los archivos que le corresponden según `.specify/memory/dispatch-rules.md`. El orquestador es quien lee ese archivo y distribuye el contexto a cada subagente. Ningún agente decide por sí mismo qué cargar — el orquestador se lo asigna.

## Core Principles

### I. Product Protagonist (Data-First)
La interfaz debe retroceder para que los datos financieros sean los protagonistas. Se prohíbe el uso de cromo decorativo, gradientes innecesarios o marcos que compitan con las métricas de costo y precio. Cada elemento visual debe justificarse por su aporte informativo.

### II. Monochromatic Sophistication
Se utiliza una paleta neutra basada en el tono `Ink` (#1d1d1f). El uso de colores saturados queda restringido únicamente a datos semánticos críticos (precio de venta, alertas). Se prohíbe la "Exageración Visual": los indicadores de selección deben ser sutiles (cambios de fondo leves o líneas hairline).

### III. Studio Tight Typography
Se utiliza la fuente Inter con un sistema de jerarquía editorial estricto. Los titulares de más de 17px deben llevar un tracking negativo ("Studio Tight"). El cuerpo de texto estándar es de 17px. Los valores financieros usan fuente monoespaciada. Se prohíbe el uso del peso tipográfico 500 en elementos decorativos.

### IV. Minimalist Elevation & Shadow
La interfaz debe ser mayoritariamente plana. Se permite una única sombra de firma (`3px 5px 30px 0px rgba(0,0,0,0.22)`) reservada exclusivamente para el Super-Card principal. Los botones y tarjetas se separan mediante whitespace y bordes hairline de 0.5px.

### V. Functional Density & Full-Stack Integrity
La aplicación utiliza **Spring Boot** como backend y **React 18** como frontend. Toda persistencia de datos (Perfiles, Historial, Cálculos) es responsabilidad del backend a través de una API REST. El frontend actúa como vista de alta fidelidad: no persiste estado crítico en localStorage salvo preferencias de UI. Las herramientas deben ser densas y directas; se prohíbe mezclar layouts de marketing en áreas del motor financiero.

### VI. Real-Time Calculation Contract
Todo cambio en cualquier input del formulario debe disparar un recálculo inmediato sin intervención del usuario. No existe botón "Calcular". La latencia máxima aceptable entre input y resultado visible es de 200ms. Los cálculos se ejecutan en el frontend; el backend es fuente de verdad para persistencia, no para cálculo.

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
- **DTOs Unificados**: Si los campos de entrada y salida son idénticos (salvo por el `id`), usar un DTO único (ej. `ClienteDTO`) con el `id` opcional/anulable. Se prohíbe crear clases duplicadas `Request` y `Response` innecesariamente.

## Arquitectura de Entrega

### Stack
- **Backend:** Spring Boot 3.x, Java 21, SQLite (liviano, portable, sin dependencias externas)
- **Frontend:** React 18, TypeScript, Tailwind CSS 3.4, Vite

### Integración
El frontend consume la API REST del backend. No existe lógica de negocio duplicada: las fórmulas de cálculo viven exclusivamente en el frontend como funciones puras testeables. El backend no recalcula; almacena los resultados tal como los envía el frontend.

## Reglas de Negocio (Canónicas)

Estas fórmulas son la fuente de verdad. Cualquier implementación debe producir resultados idénticos.

```
tiempo_total_h    = horas + (minutos / 60)
costo_energia     = (consumo_W / 1000) × tiempo_total_h × precio_kWh
costo_filamento   = (gramos / 1000) × precio_filamento_kg
costo_desgaste    = (costo_repuestos / vida_util_h) × tiempo_total_h
subtotal          = costo_energia + costo_filamento + costo_desgaste + insumos_extra
costo_base        = subtotal × (1 + margen_error / 100)
precio_venta      = costo_base × multiplicador
```

## Anti-Patrones de Diseño

### La Exageración Visual
Prohibido el uso de bloques de color sólidos y vibrantes en elementos de navegación o formularios. Los colores semánticos solo aparecen en resultados críticos.

### Densidad de Marketing
Prohibido el uso de heros, frases aspiracionales o ilustraciones decorativas dentro del motor financiero.

### Estado Duplicado
Prohibido mantener el mismo dato en localStorage y en el backend simultáneamente. El backend es la única fuente de verdad para datos persistentes.

### Cálculo en Backend
Prohibido enviar inputs al backend para obtener resultados calculados. Las fórmulas son funciones puras del frontend.

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

## Backend Agent Rules

Reglas de comportamiento para el agente backend. Se aplican cuando el scope es `backend-only` o cuando una tarea está marcada `[BE]`.

### Stack
Leer `.specify/memory/stack.md` para:
- Lenguaje / Runtime (Java, Node.js, Python, etc.)
- Framework (Spring Boot, Express, FastAPI, etc.)
- Base de datos (SQLite, PostgreSQL, MongoDB, etc.)
- ORM / Acceso a datos (JPA, Prisma, SQLAlchemy, etc.)
- Build tool (Gradle, Maven, npm, etc.)
- Testing tools

### Arquitectura
Leer `.specify/memory/enterprise-architecture-rules.md` y aplicar:
- SOLID (SRP, OCP, LSP, ISP, DIP)
- Capas: Presentation → Application → Data
- Use Cases como única fuente de verdad para lógica de negocio
- Dependency Injection vía interfaces

### Responsabilidades
1. **API Design**: Controllers/Adapters delgados — validar input, llamar use cases, devolver respuesta. NUNCA llamar otros controllers.
2. **Business Logic**: En Use Cases / Services. Lógica pura, sin HTTP, sin detalles de base de datos. Cada use case tiene UNA responsabilidad.
3. **Data Access**: Repositories detrás de interfaces (DIP). La lógica de negocio NUNCA está en repositories.
4. **Errores**: Estructurados. Usar el formato que define esta constitution (`{ "error": "string", "code": "string" }`).
5. **Testing**: Unit test a use cases (mock repositories). Integration test a repositories (BD real). Controller test solo para HTTP.

### Before Coding
1. Leer `.specify/memory/stack.md` — entender el stack
2. Leer `.specify/memory/enterprise-architecture-rules.md` — entender principios de arquitectura
3. Leer esta constitution — entender convenciones del proyecto
4. Leer archivos vecinos — entender patrones existentes

### Prohibido
- Controllers llamando controllers
- Lógica de negocio en repositories
- Services conociendo HTTP
- Lógica dispersa por múltiples capas
- Violar SOLID sin justificación en el plan

---

## Governance

Esta constitución es la ley fundamental del proyecto. Cualquier implementación que viole estos principios debe justificarse en el Plan de Implementación correspondiente.

### Amendment Procedure
1. Proponer cambios vía PR de Enmienda Constitucional.
2. Actualizar versión (MAJOR para cambios de principios, MINOR para adiciones).
3. Sincronizar todos los templates de specs.

**Version**: 2.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-20
