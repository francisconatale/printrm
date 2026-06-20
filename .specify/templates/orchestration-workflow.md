# Orchestration Workflow

**Purpose**: Define cómo el orquestador lanza subagentes FE/BE según el `scope` del proyecto, cargando solo el contexto necesario para cada uno.

---

## Vista General

```
                    ┌──────────────────────────────────────────┐
                    │           ORCHESTRATOR AGENT             │
                    │  Carga: orchestration-workflow.md        │
                    │  + .memory/enterprise-architecture-rules.md  │
                    │  + dispatch-rules.md                     │
                    │  + scope: full | backend-only | fe-only  │
                    │  Responsabilidad: orquestar, no codear   │
                    └──────────┬───────────────┬──────────────┘
                               │               │
                    ┌──────────▼──┐     ┌──────▼──────────┐
                    │  BACKEND    │     │   FRONTEND       │
                    │  SUBAGENT   │     │   SUBAGENT       │
                    │             │     │                  │
                    │  Carga:     │     │  Carga:          │
                    │  tasks-be.md│     │  tasks-fe.md     │
                    │  constitution│    │  constitution-   │
                    │  -backend.md│     │  frontend.md     │
                    │             │     │                  │
                    │  Diseño:    │     │  Diseño:         │
                    │  SOLID +    │     │  Studio Theme    │
                    │  Clean Arch │     │  UI Components   │
                    └─────────────┘     └──────────────────┘
                              │               │
                              └───────┬───────┘
                                      │
                           ┌──────────▼──────────┐
                           │    INTEGRACIÓN       │
                           │  Frontend apunta al  │
                           │  backend real. Si    │
                           │  ambos respetaron el │
                           │  contrato JSON, anda.│
                           └─────────────────────┘
```

---

## Scope: cómo cambia el flujo

### `scope: full` (default)

Flujo completo: spec → plan → tasks (con split FE/BE) → orquestador lanza AMBOS subagentes en paralelo → integración.

```
tasks.md  →  tasks-be.md  →  subagente backend
          →  tasks-fe.md  →  subagente frontend
                            →  integración
```

### `scope: backend-only`

No se generan tareas frontend. Solo existe `tasks-be.md`. El orquestador lanza UNICAMENTE el subagente backend.

```
tasks.md  →  tasks-be.md  →  subagente backend  (solo él)
          →  (no hay tasks-fe.md)
```

**Qué cambia**:
- `/speckit.tasks` genera solo `tasks.md` + `tasks-be.md`
- El orquestador omite el paso de integración
- No se carga `constitution-frontend.md`
- No se cargan reglas de UI/Studio Theme

### `scope: frontend-only`

No se generan tareas backend. Solo existe `tasks-fe.md`. El orquestador lanza UNICAMENTE el subagente frontend.

```
tasks.md  →  tasks-fe.md  →  subagente frontend  (solo él)
          →  (no hay tasks-be.md)
```

**Qué cambia**:
- `/speckit.tasks` genera solo `tasks.md` + `tasks-fe.md`
- El orquestador omite el paso de integración
- No se carga `constitution-backend.md`
- No se cargan reglas de SOLID/Clean Architecture
- Las tareas frontend pueden mockear datos sin esperar un backend real

---

## Flujo de Trabajo

### Paso 1: Definir el Feature (spec + plan)

```
Usuario → /speckit.specify → spec.md (user stories, prioridades)
       → /speckit.plan    → plan.md (tech stack, estructura)
```

### Paso 2: Generar tareas según scope

```
scope=full:         /speckit.tasks → tasks.md + tasks-be.md + tasks-fe.md
scope=backend-only: /speckit.tasks → tasks.md + tasks-be.md
scope=frontend-only:/speckit.tasks → tasks.md + tasks-fe.md
```

### Paso 3: Orquestador decide qué lanzar según scope

```
SI scope=full:
  → subagente backend  (carga tasks-be.md + constitution-backend.md)
  → subagente frontend (carga tasks-fe.md + constitution-frontend.md)
  → ambos en paralelo
  → integración al final

SI scope=backend-only:
  → subagente backend (carga tasks-be.md + constitution-backend.md)
  → NO hay frontend, NO hay integración

SI scope=frontend-only:
  → subagente frontend (carga tasks-fe.md + constitution-frontend.md)
  → NO hay backend, NO hay integración
```

### Paso 4: Cada subagente implementa contra el contrato

```
Backend:  Implementa endpoints que devuelven exactamente el JSON del contrato
Frontend: Consume mock data o el backend real según el scope
```

### Paso 5: Integración (solo si scope=full)

```
Solo apuntar frontend al backend real. Si ambos respetan el contrato, funciona.
```

---

## Responsabilidades

### Orquestador (NO codea)

| Responsabilidad | Detalle |
|---|---|
| Leer spec.md + plan.md + tasks.md | Entender el alcance general |
| Respetar el `scope` | Solo lanzar los subagentes necesarios |
| Aplicar dispatch-rules.md | Determinar qué constitution carga cada subagente |
| Cargar reglas de diseño | `.specify/memory/enterprise-architecture-rules.md` (SOLID, Clean Arch) |
| Validar contratos | Que FE y BE usen el mismo JSON shape (solo full) |
| Integrar | Apuntar frontend a backend y verificar (solo full) |

### Subagente Backend

| Responsabilidad | Detalle |
|---|---|
| Cargar | `tasks-be.md` + `constitution-backend.md` |
| Principios | SOLID, Clean Architecture, Use Cases, DIP |
| Output | Models, Repositories, Use Cases, Controllers/Adapters |
| Prohibido | Controllers llamando controllers, lógica de negocio en repositorios |

### Subagente Frontend

| Responsabilidad | Detalle |
|---|---|
| Cargar | `tasks-fe.md` + `constitution-frontend.md` |
| Principios | Studio Theme, UI components, tipografía, bordes |
| Output | Components, Pages, Services (API consume), Styles |
| Prohibido | Sombras en UI, colores saturados, tipografía no-Inter |

---

## Archivos y su Propósito

```
.specify/
├── memory/
│   ├── constitution.md                      # Reglas globales del proyecto (ambos mundos)
│   ├── enterprise-architecture-rules.md     # SOLID, Clean Architecture, anti-patrones (backend)
│   ├── constitution-backend.md              # Reglas específicas de backend
│   ├── constitution-frontend.md             # Reglas específicas de frontend
│   └── dispatch-rules.md                    # Qué constitution cargar según el path
│
├── templates/
│   ├── orchestration-workflow.md        # ← ESTE ARCHIVO
│   ├── constitution-template.md         # Template para crear constituciones
│   ├── spec-template.md                 # Template para spec
│   ├── plan-template.md                 # Template para plan
│   ├── tasks-template.md                # Template para tasks (con contratos inline)
│   ├── checklist-template.md            # Template para checklists
│   ├── task-summary-template.md         # Template para resumen de tarea
│   └── dispatch-rules-template.md       # Template para reglas de dispatch

specs/[###-feature]/
├── spec.md                              # User stories, requisitos
├── plan.md                              # Approach técnico, estructura
├── tasks.md                             # Master tasks con contratos JSON
├── tasks-be.md                          # Solo tareas backend (si scope != frontend-only)
├── tasks-fe.md                          # Solo tareas frontend (si scope != backend-only)
├── research.md                          # Investigación técnica
├── data-model.md                        # Modelo de datos
└── quickstart.md                        # Guía rápida de inicio
```

---

## Reglas del Orquestador

1. **NUNCA codear** — el orquestador lanza agentes, no implementa
2. **Respetar el scope** — si es `backend-only`, no lances frontend ni al revés
3. **Siempre cargar** reglas de diseño empresarial (SOLID, Clean Architecture, anti-patrones)
4. **Siempre aplicar** `dispatch-rules.md` para determinar qué constitution pasa a cada subagente
5. **Verificar** que cada par `[BE]`/`[FE]` tenga el mismo contrato JSON (solo en scope=full)
6. **No pasar contexto irrelevante** — backend no necesita reglas de frontend ni viceversa
7. **Al integrar** (scope=full), validar que el JSON devuelto por backend coincida con el contrato

---

**Version**: 1.0.0 | **Created**: 2026-06-20
