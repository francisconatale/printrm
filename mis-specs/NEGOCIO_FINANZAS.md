# 🧮 Lógica de Negocio y Finanzas

Este documento describe con máxima precisión técnica y fórmulas reales cómo se procesan las finanzas, los pedidos y el inventario en **PrintRM**. Toda la información aquí expuesta está basada directamente en el comportamiento y flujo del código backend y frontend.

---

## 📦 1. Gestión de Stock: Inventario FIFO por Lotes

El sistema de inventario está diseñado bajo el esquema **FIFO (First In, First Out)** para asegurar una valuación real de los costos de los productos consumidos.

### Estructura de un Lote (`Lote.java`)
Un lote representa una entrada de stock para un producto específico, con su propio costo unitario e histórico:
*   `cantidadOriginal`: Cuántas unidades ingresaron.
*   `cantidadActual`: Cuántas unidades quedan libres para consumo.
*   `costoUnitario`: Costo exacto de fabricación o compra por unidad.
*   `fechaCreacion`: Timestamp automático para ordenar la antigüedad de los lotes.

### Reglas de Negocio en Stock:

1.  **Ingreso de Stock (`addStock`)**:
    *   **Fusión de Lotes (Cost-Tiered)**: Al ingresar nuevas unidades, el sistema busca el último lote activo del producto. Si el costo del lote nuevo difiere por menos de `0.01` respecto del costo del último lote, los lotes **se fusionan** sumando las cantidades originales y actuales para evitar saturación de la base de datos.
    *   Si no hay lotes activos o el costo es diferente, se crea un registro de `Lote` nuevo.
2.  **Cálculo Centralizado Dinámico (`CostCalculationService`)**:
    *   **Filosofía**: La Biblioteca STL es un repositorio estrictamente técnico (peso en gramos, tiempo estimado, perfiles). No almacena precios ni costos estáticos.
    *   **Fabricación ("En Vivo")**: Cuando el usuario incrementa el stock de un producto terminado (tocando `+`), el **Backend** calcula el costo de producción en ese exacto milisegundo utilizando el motor central (`CostCalculationService`). Suma los costos de filamento y energía de todas sus partes (`PiezaSTL`) aplicando las tarifas actuales de los **Ajustes Globales**. El nuevo `Lote` se sella con este precio de mercado actual.
3.  **Consumo de Stock (`consumeStock`)**:
    *   Al cambiar el estado de un pedido a `ENTREGADO`, el sistema recupera todos los lotes con `cantidadActual > 0` ordenados por `fechaCreacion` ascendente (el más viejo primero).
    *   Se consume la cantidad necesaria de forma secuencial (en cascada) disminuyendo la `cantidadActual` de cada lote hasta completar la demanda del pedido.
    *   Si la cantidad total del pedido excede el stock disponible, el sistema arroja una excepción para evitar inconsistencias financieras.

---

## 🛒 2. Ciclo de Vida de Pedidos y Flujos Financieros

Un `Pedido` representa una orden comercial que agrupa ítems (productos del catálogo o cotizaciones directas a partir de archivos STL).

### Estados de Pedido (`EstadoPedido`):
```
BORRADOR ➜ COTIZADO ➜ EN_PRODUCCION ➜ ENTREGADO ➜ DEVUELTO / CANCELADO
```

### Triggers Financieros y Lógica de Seguridad (Blindaje):

| Estado Destino | Acción / Trigger Financiero | Lógica Técnica de Seguridad |
| :--- | :--- | :--- |
| **EN_PRODUCCION** | Genera **EGRESO** por producción. | Se guardan transacciones separadas de categoría `MATERIAL` y `ENERGIA` en el libro diario basándose en los costos del slice. Se usa `existsByPedidoIdAndTipo` para evitar duplicar el gasto si el pedido vuelve a este estado. |
| **ENTREGADO** | Genera **INGRESO** por venta y descuenta stock FIFO. | El sistema calcula el `saldoPendiente` (`total - montoPagado`). Si es mayor a cero, autogenera una transacción de ingreso por el saldo restante con la descripción `"Cobro de saldo restante al entregar"` y actualiza el `montoPagado` para que sea igual al `total`. |
| **DEVUELTO** | Genera **REEMBOLSO** de dinero y reabastece stock. | **Blindaje de Señas**: El sistema verifica cuánto dinero pagó realmente el cliente (`montoPagado`). La transacción de `REEMBOLSO` se crea por `montoPagado * -1`, **nunca por el total teórico** del pedido. Esto evita reembolsar dinero que no ha ingresado. |

---

## 🛠️ 3. Gestión de Pagos Parciales (Señas)
El sistema soporta abonos a cuenta (señas) en cualquier momento del ciclo de vida del pedido antes de su entrega:
*   **Registrar Pago (`registrarPago`)**:
    *   Añade el `monto` especificado al campo `montoPagado` del `Pedido`.
    *   Genera un **INGRESO** de categoría `VENTA` en el Libro Diario con el monto abonado.
    *   `saldoPendiente` se actualiza dinámicamente como `total - montoPagado`.

---

## ⚠️ 4. Gestión de Mermas (Fallas de Producción)
Cuando se estropea una pieza a mitad del proceso de impresión, se puede registrar una merma por ítem.

### Lógica de Reclasificación de Merma:
Para evitar un doble descuento del balance (el filamento y energía ya fueron cobrados como egresos al iniciar la producción del pedido):
1.  El sistema calcula el costo de filamento y energía por unidad del ítem fallido.
2.  Genera un **EGRESO** extra de categoría `MATERIAL` por el valor de la pérdida.
3.  Genera un **EGRESO** de categoría `MERMA` con valor negativo (`costo * -1`) que neutraliza el impacto en el balance neto, pero deja registrada la estadística para auditoría de mermas.
