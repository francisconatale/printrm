# Dispatch Rules

**Purpose**: Define qué archivos carga cada agente según el scope de la tarea.

---

## Scope → Archivos a cargar

### `backend-only` o tarea `[BE]`

| Archivo | Ruta | Propósito |
|---------|------|-----------|
| tasks | `specs/[###-feature]/tasks-be.md` | Tareas específicas de backend |
| stack | `.specify/memory/stack.md` | Lenguaje, framework, BD, ORM |
| architecture | `.specify/memory/enterprise-architecture-rules.md` | SOLID, Clean Architecture, anti-patrones |
| constitution | `.specify/memory/constitution.md` | Reglas del proyecto + sección **Backend Agent Rules** |
| patterns | `.specify/memory/constitution-backend.md` | Design patterns reference (GoF + Spring) |

### `frontend-only` o tarea `[FE]`

| Archivo | Ruta | Propósito |
|---------|------|-----------|
| tasks | `specs/[###-feature]/tasks-fe.md` | Tareas específicas de frontend |
| stack | `.specify/memory/stack.md` | Framework, styling, estado, testing |
| constitution | `.specify/memory/constitution-frontend.md` | Reglas de UI, agent rules, anti-patrones, fórmulas |

### `full` (ambos scopes)

Cada subagente carga solo lo suyo según las tablas de arriba. El orquestador además carga `orchestration-workflow.md` y `dispatch-rules.md` para coordinar.

---

## Reglas

1. **NUNCA** pasar al backend archivos de frontend ni viceversa
2. **Siempre** pasar `stack.md` — cualquier stack, cualquier proyecto
3. **Frontend** carga `constitution-frontend.md` en lugar de `constitution.md`
4. **Backend** carga `constitution.md` (global) + `enterprise-architecture-rules.md` + `constitution-backend.md`
5. Si un archivo no existe, omitirlo silenciosamente

---

**Version**: 1.0.0 | **Created**: 2026-06-20
