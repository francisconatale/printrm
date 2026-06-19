# Backend — Relaciones entre componentes

## Visión general

El backend está organizado en **paquetes por dominio**. Cada dominio tiene una estructura típica: `Entity` → `Repository` → `Service` → `Controller` → DTOs. Los servicios se inyectan entre sí formando una cadena de dependencias.

```
AjustesService
    ↑
CostCalculationService
    ↑
ProductoService  ←→  PiezaSTLService
    ↑                    ↑
VentaService             |
    ↑                    |
PedidoService            |
    ↑                    |
OrdenProduccionService   |
    ↑
SlicerController (usa ConfigIniWriter + repos de perfiles)
```

---

## 1. AjustesService — el config central

**Depende de:** `AjustesRepository`

**Es dependido por (6 servicios):**

| Servicio | Para qué |
|---|---|
| `CostCalculationService` | Obtener `precioKWh` y `margenError` |
| `ProductoService` | Obtener `margenError` para costos dinámicos |
| `PiezaSTLService` | Obtener `margenError` para costo base de piezas |
| `OrdenProduccionService` | Obtener `precioKWh` y `margenError` para costos estimados |
| `CalculoService` | (indirecto, vía `CostCalculationService`) |
| `PedidoService` | (indirecto, vía `ProductoService`) |

**Regla de negocio:** Es un singleton forzado (id=1). Se inicializa con defaults (`precioKWh=50`, `margenError=10`) vía `@PostConstruct`.

---

## 2. CostCalculationService — el motor de costos

**Depende de:**

| Componente | Para qué |
|---|---|
| `AjustesService` | Obtener `precioKWh` y `margenError` |
| `PerfilRepository` | Obtener `consumoW` de la impresora |
| `FilamentProfileRepository` | Obtener `filamentoPorKg` (precio del filamento) |

**Es dependido por:**

| Servicio | Para qué |
|---|---|
| `PiezaSTLService` | Calcular `costoBase` al mapear DTOs de piezas |
| `ProductoService` | Calcular costo dinámico de productos compuestos por piezas |
| `OrdenProduccionService` | Calcular costo estimado de órdenes de producción |
| `CalculoController` | Endpoint `POST /api/v1/calculos/calculate` |
| `SlicerService` | (indirecto, no usa el service pero parsea metadata) |

**Fórmulas:**
```
costoEnergía = (consumoW / 1000) × tiempoTotalHoras × precioKWh
costoFilamento = (gramos / 1000) × precioPorKg
subtotal = costoEnergía + costoFilamento + insumosExtra
costoBase = subtotal × (1 + margenError / 100)
precioVenta = costoBase (con margen de beneficio si aplica)
```

---

## 3. ProductoService — inventario FIFO

**Depende de:**

| Componente | Para qué |
|---|---|
| `ProductoRepository` | CRUD de productos |
| `LoteRepository` | Gestión de lotes FIFO |
| `PiezaSTLRepository` | Obtener partes que componen un producto |
| `CostCalculationService` | Calcular costo dinámico de partes |
| `AjustesService` | Obtener `margenError` |

**Es dependido por:**

| Servicio | Para qué |
|---|---|
| `VentaService` | `registrarConsumoStock()` → `updateStock(delta negativo)` |
| `PedidoService` | `cambiarEstado(ENTREGADO)` → consume stock; `DEVUELTO` → restaura stock |
| `OrdenProduccionService` | `procesarFinalizacionOrden()` → `addStock()` |
| `ProductoController` | Endpoints REST |

**Reglas de negocio:**
- **FIFO**: `consumeStock()` siempre toma del lote más antiguo (`Lote.fechaCreacion` ASC)
- **Merge**: si un lote nuevo tiene el mismo costo que el último (±0.01), se fusionan en lugar de crear uno nuevo
- `Producto` tiene relación `@ManyToMany` con `PiezaSTL` (tabla `producto_partes`)
- `Producto` tiene `@OneToMany` con `Lote`

---

## 4. PiezaSTLService — biblioteca de piezas STL

**Depende de:**

| Componente | Para qué |
|---|---|
| `PiezaSTLRepository` | CRUD de piezas STL |
| `PerfilRepository` | FK a perfil de impresora |
| `FilamentProfileRepository` | FK a perfil de filamento |
| `PrintProfileRepository` | FK a perfil de impresión |
| `CostCalculationService` | Calcular costo base dinámico |
| `AjustesService` | Obtener margen de error |

**Es dependido por:**

| Servicio | Para qué |
|---|---|
| `ProductoService` | Obtener partes para cálculo de costos de producto |
| `PiezaSTLController` | Endpoints REST |

**Relaciones de entidad:**
```
PiezaSTL ──FK──→ Perfil (perfilImpresora)
PiezaSTL ──FK──→ FilamentProfile (perfilFilamento)
PiezaSTL ──FK──→ PrintProfile (perfilImpresion)
PiezaSTL ──MTM── Producto (tabla producto_partes)
```

---

## 5. PedidoService — máquina de estados de pedidos

**Depende de (8 dependencias directas):**

| Componente | Para qué |
|---|---|
| `PedidoRepository` | CRUD de pedidos |
| `ItemPedidoRepository` | CRUD de items del pedido |
| `ClienteRepository` | FK a cliente |
| `CalculoRepository` | FK a cálculo (cotización custom) |
| `TransaccionRepository` | Registrar pagos, gastos, reembolsos |
| `ProductoRepository` | Consultar productos en items |
| `OrdenProduccionRepository` | Consultar órdenes vinculadas |
| `VentaService` | Consumir stock al entregar |
| `ProductoService` | Restaurar stock al devolver |

**Es dependido por:**
- `PedidoController` — todos los endpoints de pedidos

**Máquina de estados y efectos financieros:**

```
BORRADOR ──→ COTIZADO ──→ CONFIRMADO ──→ EN_PRODUCCION
                                                │
                                                ↓
                                        LISTO_PARA_ENTREGAR
                                                │
                                                ↓
    ┌──→ ENTREGADO (consume stock FIFO, registra ingreso)
    │
    └──→ CANCELADO
    │
    └──→ DEVUELTO (restaura stock, registra reembolso)
```

**Transiciones con efectos secundarios:**

| Transición | Efecto |
|---|---|
| `→ EN_PRODUCCION` | Crea `Transaccion(EGRESO, MATERIAL)` y `Transaccion(EGRESO, ENERGIA)` |
| `→ ENTREGADO` | `VentaService.registrarVenta()` → consume stock FIFO + `Transaccion(INGRESO, VENTA)` por el saldo restante |
| `→ DEVUELTO` | `ProductoService.updateStock(delta positivo)` + `Transaccion(REEMBOLSO)` |

**Reglas de negocio:**
- `registrarGastoProduccion()` y `registrarReembolso()` son **idempotentes**: verifican si ya existe la transacción antes de crearla
- `registrarMerma()` reclasifica costos de MATERIAL a MERMA (asientos compensatorios)
- `registrarPago()` permite pagos parciales, actualizando `montoPagado`

---

## 6. VentaService — consumo de stock

**Depende de:**

| Componente | Para qué |
|---|---|
| `ProductoService` | `consumeStock()` — descontar lotes FIFO |
| `TransaccionRepository` | Crear `Transaccion(INGRESO, VENTA)` |
| `ProductoRepository` | Consultar productos |

**Es dependido por:**
- `PedidoService.cambiarEstado(ENTREGADO)` — consume inventario

---

## 7. OrdenProduccionService — órdenes de producción

**Depende de:**

| Componente | Para qué |
|---|---|
| `OrdenProduccionRepository` | CRUD de órdenes |
| `ItemPedidoRepository` | Vincular a item de pedido |
| `ProductoRepository` | Vincular a producto |
| `ProductoService` | `addStock()` al completar la orden |
| `TransaccionRepository` | Registrar costos como EGRESO |
| `AjustesService` | Obtener precio electricidad |
| `CostCalculationService` | Calcular costo estimado |

**Es dependido por:**
- `OrdenProduccionController` — endpoints REST

**Relaciones de entidad:**
```
OrdenProduccion ──FK (nullable)──→ ItemPedido
OrdenProduccion ──FK (nullable)──→ Producto
```

**Flujo de finalización (`procesarFinalizacionOrden`):**

| Tipo | Acción |
|---|---|
| `INTERNA` | 1. `ProductoService.addStock()` — incrementa inventario<br>2. Crea `Transaccion(EGRESO, MATERIAL)` por costo de filamento<br>3. Crea `Transaccion(EGRESO, ENERGIA)` por consumo eléctrico |
| `EXTERNA` | 1. `ProductoService.addStock()` — incrementa inventario<br>2. Crea `Transaccion(EGRESO, OTRO)` por costo del proveedor |

---

## 8. Servicios autocontenidos (CRUD simple)

No dependen de otros servicios ni son dependidos por otros servicios (solo por sus propios controllers):

### ClienteService
```
ClienteController → ClienteService → ClienteRepository → Cliente
```

### CalculoService
```
CalculoController → CalculoService → CalculoRepository → Calculo
```

### TransaccionService
```
TransaccionController → TransaccionService → TransaccionRepository → Transaccion
```

### PerfilService / FilamentProfileService / PrintProfileService
```
PerfilController → PerfilService → PerfilRepository → Perfil
                 → ConfigIniWriter (escribe archivos .ini en disco)
```

---

## 9. SlicerController — proceso de slicing

**Depende de:**

| Componente | Para qué |
|---|---|
| `SlicerService` | Ejecutar PrusaSlicer CLI y parsear G-code |
| `ConfigIniWriter` | Generar archivos .ini desde perfiles DB |
| `PerfilRepository` | Obtener perfil de impresora si se pasa UUID |
| `FilamentProfileRepository` | Obtener perfil de filamento si se pasa UUID |
| `PrintProfileRepository` | Obtener perfil de impresión si se pasa UUID |

**Flujo:**
```
POST /api/slice
  → ¿UUID de perfiles o ruta de .ini?
    → UUID: ConfigIniWriter genera .ini combinado en temp
    → .ini: se usan directamente
  → SlicerService.slice(stl, configs)
    → prusa-slicer-console --export-gcode --load <config> --output <gcode> <stl>
    → parseGcode() extrae: estimatedPrintingTime, filamentUsed[g], filamentUsed[cm3]
  → Devuelve SlicingResult
```

---

## 10. Resumen de dependencias entre servicios

```
AjustesService
  ↑        ↑          ↑               ↑
  │        │          │               │
  CostCalc Producto  PiezaSTL   OrdenProduccion
  Service  Service   Service    Service
     ↑        ↑                   ↑
     │        │                   │
     │   ┌────┴────┐              │
     │   │         │              │
     │ Venta   Pedido             │
     │ Service  Service           │
     │           ↑                │
     │           │                │
     └───────────┴────────────────┘
                 │
           (todos confluyen en
            PedidoService como
            orquestador principal)
```

**Regla general:** `AjustesService` está en la base de la pirámide. `CostCalculationService` es el motor financiero. `ProductoService` y `PiezaSTLService` manejan inventario y partes. `PedidoService` es el orquestador central que coordina ventas, stock, producción y finanzas. `OrdenProduccionService` cierra el ciclo productivo retroalimentando el stock.
