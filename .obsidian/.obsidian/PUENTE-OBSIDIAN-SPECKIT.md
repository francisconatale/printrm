# 🌉 Puente Obsidian ↔ Speckit

## El Concepto

Este directorio contiene el **puente bidireccional** entre tu forma natural de pensar/escribir en Obsidian y el sistema estructurado de Speckit (`.specify/`).

```
┌─────────────────────┐       ┌─────────────────────┐
│     📝 OBSIDIAN      │       │   ⚙️ SPECKIT         │
│  (lenguaje natural)  │ ◄──► │  (specs estructuradas)│
│                     │       │                     │
│  mis-specs/         │       │  .specify/specs/    │
│    ─ *.md           │       │    ─ spec.md        │
│                     │       │    ─ plan.md        │
│                     │       │    ─ tasks.md       │
└─────────────────────┘       └─────────────────────┘
```

---

## 🔄 Flujo Bidireccional

### A) Obsidian ➜ Speckit (de natural a estructurado)

1. Escribís una idea/spec en lenguaje natural en Obsidian
2. El agente (Gemini/openCode) toma ese texto y lo convierte al formato Speckit
3. Se genera la estructura: `spec.md` + `plan.md` + `tasks.md`

### B) Speckit ➜ Obsidian (de estructurado a natural)

1. Se crea/actualiza un spec en Speckit (`.specify/specs/XXX/`)
2. El agente genera automáticamente un resumen en lenguaje natural
3. Ese resumen se guarda como nota visible en Obsidian

---

## 📁 Estructura Propuesta

Para que TODO sea visible en Obsidian:

```
printrm/                        ← Tu vault de Obsidian
├── .specify/                   ← Speckit (estructurado)
│   ├── memory/
│   │   ├── constitution.md     ← Constitución de diseño
│   │   ├── stack.md            ← Stack tecnológico
│   │   ├── spec.md             ← Spec maestro
│   │   └── plan.md             ← Plan vigente
│   └── specs/
│       └── 007-reportes-pdf/
│           ├── spec.md         ← Spec formal
│           ├── plan.md         ← Plan de implementación
│           └── tasks.md        ← Tareas
│
├── mis-specs/                  ← Visible en Obsidian (lenguaje natural)
│   ├── CONOCIMIENTO.md         ← 📌 DOCUMENTO MAESTRO (todo el proyecto)
│   ├── README.md               ← Instrucciones de uso
│   └── 007-reportes-pdf.md     ← Feature X en tus palabras
│
├── .obsidian/.obsidian/        ← Ejemplos y configuración del puente
│   ├── PUENTE-OBSIDIAN-SPECKIT.md
│   └── ejemplo-spec-natural.md
```

---

## 📐 Mapeo Natural → Estructurado

| En tu nota de Obsidian | En Speckit |
|---|---|
| "Quiero que..." / "Necesito..." | → **User Story** (US1, US2...) |
| "Tiene que hacer X" | → **FR-00X** (Functional Requirement) |
| "Y si pasa tal cosa?" | → **Edge Case** |
| "Esto funciona si..." | → **Acceptance Scenario** (Given/When/Then) |
| "Medimos éxito con..." | → **Success Criterion** |
| "Asumo que..." | → **Assumption** |

---

## ⚙️ Cómo Funciona en la Práctica

### Cuando escribís una idea en Obsidian:

1. Creás un archivo en `mis-specs/` o donde quieras
2. El agente lo lee, lo estructura y genera los archivos en `.specify/specs/`
3. Después de pulir en Speckit, el spec actualizado se refleja de vuelta en tu nota

### Cuando se trabaja en Speckit:

1. Se actualiza `spec.md`, `plan.md`, etc.
2. El agente toma esos cambios y actualiza tu nota visible en Obsidian
3. Nunca perdés visibilidad de lo que está pasando

---

## 🚀 Próximos Pasos

1. Revisá el archivo `ejemplo-spec-natural.md` para ver un ejemplo concreto
2. Abrí `mis-specs/CONOCIMIENTO.md` — es el documento maestro con TODO el proyecto
3. Empezá a escribir tus ideas en `mis-specs/`
4. Pedile al agente que convierta tu nota a Speckit
