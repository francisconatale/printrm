# Implementation Plan: Historial y Exportación

**Branch**: `003-historial-exportacion` | **Date**: 2026-06-15 | **Constitution**: `.specify/constitution.md`

## Summary

Implementar el módulo de historial de cálculos y las funciones de exportación y compartición de resultados. El historial persiste en el backend (Spring Boot). La exportación CSV y el copiado al portapapeles son operaciones puramente del frontend. Depende de `002-motor-de-calculo` para los snapshots de cálculo.

---

## Casos de Uso

### CU-08 — Guardar y ver historial de cálculos
**Actor:** Usuario | **Prioridad:** P2

**Flujo principal:**
1. Al completar un cálculo, el usuario presiona "Guardar en historial"
2. El sistema emite `POST /api/v1/calculos` con el snapshot del resultado
3. El usuario navega a la sección "Historial"
4. El sistema lista los últimos 50 cálculos ordenados por fecha descendente
5. Cada entrada muestra: nombre del perfil, fecha, gramos, horas y precio de venta

**Flujo alternativo — Reutilizar un cálculo:**
El usuario selecciona una entrada del historial y el sistema carga sus inputs en el formulario de pieza para usarlos como punto de partida.

---

### CU-09 — Copiar resultado al portapapeles
**Actor:** Usuario | **Prioridad:** P1

**Flujo principal:**
1. El usuario presiona "Copiar resultado"
2. El sistema genera texto plano con el resumen:
   ```
   Calculadora 3D — [nombre del perfil]
   Tiempo: Xh Ymin | Filamento: Zg
   Costo base: $XX.XXX
   Precio de venta: $XX.XXX
   ```
3. El texto se copia al portapapeles vía `navigator.clipboard.writeText()`
4. El sistema muestra confirmación visual transitoria ("¡Copiado!" por 2 segundos)

---

### CU-10 — Compartir por WhatsApp
**Actor:** Usuario | **Prioridad:** P2

**Flujo principal:**
1. El usuario presiona "Compartir por WhatsApp"
2. El sistema genera la URL `https://wa.me/?text=<resumen_encoded>`
3. Se abre una nueva pestaña con WhatsApp Web y el texto pre-cargado

---

### CU-11 — Exportar cálculo a CSV
**Actor:** Usuario | **Prioridad:** P2

**Flujo principal:**
1. El usuario presiona "Exportar CSV"
2. El sistema genera un archivo CSV con el desglose completo:
   - Perfil, fecha, tiempo, gramos, insumos extra, multiplicador
   - Costo energía, filamento, desgaste, subtotal, costo base, precio venta
3. El navegador descarga el archivo: `calculo_[timestamp].csv`

---

### CU-12 — Limpiar historial
**Actor:** Usuario | **Prioridad:** P3

**Flujo principal:**
1. El usuario selecciona "Limpiar historial"
2. El sistema solicita confirmación modal
3. El usuario confirma
4. El sistema emite `DELETE /api/v1/calculos` y el historial queda vacío

---

## Objetivos del Módulo

**Objetivo principal:** Facilitar el uso del resultado del cálculo fuera de la aplicación: para presupuestar, compartir con clientes, archivar o revisar decisiones de precio pasadas.

**Objetivos específicos:**
- Que copiar un resultado para WhatsApp tome menos de 2 clics
- Proveer historial para comparar precios de piezas a lo largo del tiempo
- Ofrecer exportación CSV como herramienta de registro para microemprendedores

**Métricas de éxito:**
- El copiado al portapapeles funciona en Chrome, Firefox, Safari (desktop y mobile)
- El historial carga en ≤300ms para hasta 50 entradas
- El CSV generado se abre correctamente en Excel y Google Sheets

---

## Technical Context

**Stack:**
- Backend: Java 21, Spring Boot 3.x, Spring Data JPA, SQLite
- Frontend: React 18, TypeScript, Tailwind CSS 3.4, TanStack Query

**Testing:**
- Backend: JUnit 5 + MockMvc para endpoints de historial
- Frontend: Vitest para funciones de generación de texto y CSV; React Testing Library para componentes del historial
- Clipboard API: mock de `navigator.clipboard` en tests

**Performance:** Listado de historial ≤300ms. Generación de CSV en cliente es instantánea.

---

## Constitution Check

- [x] **Data-First:** El historial es una tabla compacta. Sin cards decorativas ni avatares.
- [x] **Hairline Borders:** Filas de la tabla separadas por `border-b 0.5px #e0e0e0`.
- [x] **Financial Figures en Mono:** Columnas de ARS en fuente monoespaciada.
- [x] **Full-Stack Integrity:** Historial persiste en backend. El frontend no guarda historial en localStorage.
- [x] **No Marketing Density:** El módulo de exportación es funcional. Sin ilustraciones.

---

## Project Structure

### Backend
```text
src/main/java/com/calc3d/domain/calculo/
├── Calculo.java                   # Entidad JPA
├── CalculoRepository.java         # findTop50ByOrderByTimestampDesc()
├── CalculoService.java
├── CalculoController.java
├── CalculoRequestDTO.java
└── CalculoResponseDTO.java
```

### Frontend
```text
frontend/src/features/historial/
├── api/
│   └── historial.api.ts           # TanStack Query hooks
├── components/
│   ├── HistorialTable.tsx          # Tabla de los últimos 50 cálculos
│   ├── HistorialRow.tsx            # Fila individual con acciones
│   └── LimpiarHistorialModal.tsx  # Confirmación de limpieza
└── types/
    └── historial.types.ts

frontend/src/features/exportacion/
├── components/
│   ├── AccionesResultado.tsx       # Botones: Copiar, WhatsApp, CSV
│   └── CopiadoConfirmacion.tsx    # Feedback visual transitorio
└── utils/
    ├── clipboard.utils.ts          # Generación de texto + writeText
    ├── csv.utils.ts                # Generación y descarga de CSV
    └── whatsapp.utils.ts           # Construcción de URL wa.me
```

---

## Key Entities

```typescript
// Snapshot persistido en backend
interface CalculoSnapshot {
  id: string;
  timestamp: string;            // ISO 8601
  perfilId: string;
  perfilNombre: string;         // snapshot — independiente del perfil actual
  input: {
    horas: number;
    minutosAdicionales: number;
    gramos: number;
    insumosExtra: number;
    multiplicador: number;
  };
  resultado: {
    costoEnergia: number;
    costoFilamento: number;
    costoDesgaste: number;
    subtotal: number;
    costoBase: number;
    precioVenta: number;
  };
}

// Fila en la tabla de historial
interface HistorialRow {
  id: string;
  fecha: string;                // formateada para display
  perfilNombre: string;
  horas: number;
  gramos: number;
  precioVenta: number;          // ARS
}
```

---

## API Endpoints (Spring Boot)

| Método | Endpoint | Descripción | Body |
|---|---|---|---|
| `GET` | `/api/v1/calculos` | Listar historial (top 50, desc por fecha) | — |
| `POST` | `/api/v1/calculos` | Guardar snapshot de cálculo | `CalculoRequestDTO` |
| `DELETE` | `/api/v1/calculos` | Limpiar historial completo | — |
| `DELETE` | `/api/v1/calculos/{id}` | Eliminar una entrada | — |

---

## Functional Requirements

| ID | Requisito |
|---|---|
| FR-021 | El sistema debe guardar snapshots de cálculo vía `POST /api/v1/calculos` |
| FR-022 | El historial debe mostrar los últimos 50 cálculos ordenados por fecha desc |
| FR-023 | Cada fila del historial debe mostrar: perfil, fecha, horas, gramos, precio venta |
| FR-024 | El usuario debe poder cargar los inputs de una entrada del historial en el formulario |
| FR-025 | El sistema debe generar texto plano copiable al portapapeles |
| FR-026 | El copiado debe mostrar confirmación visual transitoria de 2 segundos |
| FR-027 | El sistema debe generar URL de WhatsApp con el resumen pre-cargado |
| FR-028 | El sistema debe generar y descargar un archivo CSV con el desglose completo |
| FR-029 | El sistema debe solicitar confirmación antes de limpiar el historial |
| FR-030 | El CSV debe ser compatible con Excel y Google Sheets (separador coma, encoding UTF-8 BOM) |

---

## Formato de exportaciones

### Texto para portapapeles / WhatsApp
```
Calculadora 3D — [Nombre del perfil]
Tiempo: [X]h [Y]min | Filamento: [Z]g
─────────────────────────────
Energía:    $X.XXX
Filamento:  $X.XXX
Máquina:    $X.XXX
Insumos:    $X.XXX
Costo base: $X.XXX
─────────────────────────────
💰 Precio de venta: $XX.XXX (x[multiplicador])
```

### CSV (cabeceras)
```
fecha,perfil,horas,minutos,gramos,insumos_extra,multiplicador,
costo_energia,costo_filamento,costo_desgaste,subtotal,costo_base,precio_venta
```

---

## Complexity Tracking

| Decisión | Por qué | Alternativa rechazada |
|---|---|---|
| CSV generado en frontend | Sin dependencia de backend, descarga inmediata, sin latencia | Generar en backend: overhead de API para operación local |
| UTF-8 BOM en CSV | Excel en Windows no detecta UTF-8 sin BOM; caracteres como `$` y `ñ` se rompen | Sin BOM: mala UX para el target de usuarios (Windows + Excel) |
| `perfilNombre` como snapshot | El historial no se rompe si el perfil se renombra o elimina | FK al perfil: entradas huérfanas al eliminar el perfil |
| Guardado manual ("Guardar en historial") | El usuario decide qué cálculos conservar, evita ruido en historial | Autosave en cada cambio: historial lleno de cálculos intermedios |

---

## Assumptions

- La exportación PDF queda fuera de alcance en v1. Se implementará en v2 preferiblemente desde el backend.
- El historial es global (no filtrado por perfil) en v1. Filtro por perfil se agrega en v2.
- El texto de WhatsApp está en español argentino. No hay i18n en v1.
- La Clipboard API (`navigator.clipboard`) requiere contexto seguro (HTTPS). En desarrollo local (HTTP) se usa fallback con `document.execCommand('copy')`.
