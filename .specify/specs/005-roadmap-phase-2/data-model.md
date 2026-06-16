# Data Model: Phase 2 Core Entities

## Entities

### Cliente (CRM)
- **id**: UUID (Primary Key)
- **nombre**: String (Max 100, Required)
- **email**: String (Optional, Email format)
- **telefono**: String (Optional)
- **notas**: Text (Optional)
- **fechaCreacion**: LocalDateTime (Automatic)

**Validation**:
- `nombre` is mandatory for searching.
- Unique index on `email` if provided.

### PiezaSTL (Enhanced Library)
- **id**: UUID (Primary Key)
- **nombre**: String (Max 50, Required)
- **filePath**: String (Path in storage)
- **volumenCm3**: Double (Optional)
- **pesoGramos**: Double (Optional)
- **tiempoEstimado**: String (Format: "Xh Ym")
- **perfilFilamentoId**: UUID (Foreign Key, Optional)
- **fechaCreacion**: LocalDateTime

**Relationships**:
- Many-to-One with `FilamentProfile`.

### CalculoHistorial (Unified History)
- **id**: UUID
- **clienteId**: UUID (Foreign Key, Optional)
- **piezaId**: UUID (Foreign Key, Optional)
- **dataJson**: Text (Snapshot of all calculation inputs/outputs)
- **fecha**: LocalDateTime

---

## State Transitions

### Calculation Flow
1. **DRAFT**: Input provided, result shown in real-time.
2. **PERSISTED**: User clicks "Guardar". Record created in `CalculoHistorial`.
3. **ASSIGNED**: Calculation linked to a `Cliente`.
