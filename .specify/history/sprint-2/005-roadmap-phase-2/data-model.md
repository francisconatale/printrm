# Data Model: Phase 2 Core Entities

## Entities

### PiezaSTL (Parte)
- **id**: UUID
- **nombre**: String
- **dataJson**: Text (Metadatos de impresión)

### Producto (Venta)
- **id**: UUID
- **nombre**: String
- **descripcion**: Text
- **partes**: List<PiezaSTL> (Relación Many-to-Many o One-to-Many)
- **cantidadStock**: Integer (Unidades listas en estantería)
- **precioSugerido**: Double

### Pedido (Order)
- **id**: UUID
- **clienteId**: UUID (FK)
- **estado**: Enum (BORRADOR, COTIZADO, EN_PRODUCCION, ENTREGADO, CANCELADO, DEVUELTO)
- **total**: Double
- **montoPagado**: Double (Monto total abonado hasta el momento, inicializado en 0.0)
- **saldoPendiente**: Double (Campo calculado: `total - montoPagado`)

### Transaccion (Finanzas)
- **id**: UUID
- **tipo**: Enum (INGRESO, EGRESO, REEMBOLSO)
- **categoria**: Enum (MATERIAL, ENERGIA, VENTA, MERMA, OTRO)
- **monto**: Double (En REEMBOLSO, el monto resta del balance total)

---

## State Transitions & Financial Triggers

### 1. Producción para Stock
- **Acción**: El usuario marca "Imprimir para Stock".
- **Trigger**: Crea Egreso (MATERIAL + ENERGIA) e incrementa `Producto.cantidadStock`.

### 2. Venta Directa (de Stock)
- **Acción**: El usuario vende un producto ya impreso.
- **Trigger**: Crea Ingreso (VENTA) y decrementa `Producto.cantidadStock`. No genera egreso de material (ya se hizo al producirlo).

### 3. Devolución (Post-Venta)
- **Acción**: Pedido cambia a `DEVUELTO`.
- **Trigger**: Crea Transacción tipo REEMBOLSO (resta monto). El stock incrementa +1 si el producto es recuperable.

### 4. Merma (Fallo de Impresión)
- **Acción**: El usuario registra un fallo.
- **Trigger**: Crea Egreso (MERMA) por el material/luz perdidos. El stock NO incrementa.

