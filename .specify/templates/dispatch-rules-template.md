# Agent Context Dispatch Rules

**Purpose**: Define qué constitution/cargar cada subagente según el ámbito de la tarea, para minimizar el contexto innecesario.

## Scope Detection

Determinar el ámbito según el path del archivo a modificar:

| Scope     | Path pattern                          | Constitution a cargar              |
|-----------|---------------------------------------|------------------------------------|
| Frontend  | `frontend/src/`, `frontend/tests/`    | `constitution-frontend.md`         |
| Backend   | `backend/src/`, `backend/tests/`      | `constitution-backend.md` + `enterprise-architecture-rules.md` |
| Full-stack| Ambos patrones en la misma tarea      | Ambas constituciones + enterprise-architecture-rules.md |
| Infra     | `docker/`, `.github/`, `infra/`       | Ninguna (o constitution-base.md)   |
| Docs      | `docs/`, `specs/`, `*.md`            | Ninguna                            |

## Dispatch Rules (para el agente orquestador)

Cada vez que se lance un subagente para ejecutar una tarea:

1. Leer el/los paths involucrados en la task description
2. Determinar el scope según la tabla de Scope Detection
3. Cargar el contenido de la(s) constitution(s) correspondiente(s)
4. Pasar ese contenido como instrucción inicial al subagente

Ejemplo de invocación:

```bash
# Backend task: pasar constitution-backend.md como contexto inicial
Task: 
  prompt: "[constitution-backend.md content]\n\nImplementa el modelo User en backend/src/models/User.java..."
  subagent_type: general
```

## Conventions

- Las constituciones viven en `.specify/memory/constitution-{scope}.md`
- Las reglas de arquitectura viven en `.specify/memory/enterprise-architecture-rules.md`
- Si la tarea cruza scopes, cargar **ambas** constituciones
- Si no hay constitution para el scope, omitir
- El orquestador NUNCA debe pasar constituciones irrelevantes al subagente
- El backend SIEMPRE carga enterprise-architecture-rules.md (SOLID, Clean Arch)
- El frontend NUNCA carga enterprise-architecture-rules.md

## Adding New Scopes

Para agregar un nuevo ámbito (ej: `mobile`):

1. Crear `.specify/memory/constitution-mobile.md`
2. Agregar el path pattern y la regla en Scope Detection
3. Documentar acá

---

**Version**: 1.0.0 | **Created**: [DATE]
