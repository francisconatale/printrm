# Spec: Flujo Dinámico de Pedidos, Stock y Fabricación

Este documento detalla la especificación de diseño para la relación entre pedidos, stock (FIFO) y producción (para pedidos de clientes y reposición de stock propio), integrando de forma explícita el registro de transacciones contables (ingresos y egresos).

## 1. User Stories

### US1: Pedido Limpio y Dinámico (Prioridad: P1)
Como comerciante, quiero que el pedido represente únicamente la intención de compra (qué producto/cálculo y en qué cantidad se desea), sin almacenar valores volátiles de stock reservado para evitar de-sincronizaciones con el inventario físico.

### US2: Cálculo Dinámico de Faltantes (Prioridad: P1)
Como comerciante, quiero ver en tiempo real en la pantalla del pedido cuántas unidades de cada ítem están cubiertas por el stock actual y cuántas faltan fabricar, calculado de forma dinámica a partir de las existencias reales y las órdenes de producción en curso.

### US3: Generación de Órdenes de Producción a Demanda (Prioridad: P1)
Como comerciante, si veo que un pedido tiene faltantes, quiero poder mandar a fabricar las piezas faltantes con un solo clic, generando una orden de producción vinculada a dicho pedido.

### US4: Órdenes de Producción Propias (Para Stock) (Prioridad: P1)
Como comerciante, quiero poder crear órdenes de producción de forma independiente (sin estar vinculadas a ningún pedido de cliente) para fabricar stock de reposición propia y alimentar el inventario general.

### US5: Cierre de Producción, Impacto en Inventario y Registro de Gastos (Prioridad: P1)
Como comerciante, quiero que al completarse una orden de producción:
1. El stock físico del producto se incremente de forma automática (FIFO).
2. Se registren los egresos correspondientes en el libro diario de finanzas (el costo cobrado por el proveedor de outsourcing si es externa, o el desgaste estimado de filamento y energía si es interna).

### US6: Entrega de Pedido con Lógica de Venta Centralizada (Prioridad: P1)
Como comerciante, quiero que al confirmarse la entrega de un pedido (estado `ENTREGADO`), el sistema ejecute la lógica de venta de forma centralizada: valide el stock real disponible, lo descuente (FIFO), registre el ingreso contable por la venta en finanzas, y liquide el saldo cobrado al cliente.

---

## 2. Lógica de Negocio y Flujo

### A. Cálculo Dinámico del Faltante (En tiempo de ejecución)
Para cada `ItemPedido` de tipo `Producto`, se calcula dinámicamente en memoria:
* $Q_{\text{pedido}}$: Cantidad total solicitada en el ítem.
* $Q_{\text{stock}}$: Stock físico disponible actual del producto en el inventario.
* $Q_{\text{producida}}$: Cantidad de piezas ya completadas en las `OrdenProduccion` asociadas a este ítem.
* $Q_{\text{en\_produccion}}$: Cantidad de piezas actualmente en curso en las `OrdenProduccion` activas asociadas a este ítem.

$$\text{Faltante Neto a Producir} = \max(0, Q_{\text{pedido}} - Q_{\text{stock}} - Q_{\text{producida}} - Q_{\text{en\_produccion}})$$

### B. Vinculación Opcional en Producción
La entidad `OrdenProduccion` tiene un campo `itemPedido` opcional (nullable):
1. **Vinculada a Pedido (`itemPedido != null`):** Nace del detalle de un pedido de un cliente para cubrir un faltante. Al completarse, impacta en el stock y calcula los gastos de esa orden en el pedido original.
2. **Independiente (`itemPedido == null`):** Creada manualmente por el usuario desde el panel de producción para reabastecer stock propio.

### C. Entrega del Pedido y Transacción de Venta
Al marcar un pedido como `ENTREGADO`, la acción se asocia directamente a una venta real del negocio:
* Se verifica stock real del inventario.
* Se invoca el servicio de ventas para consumir el stock físico (FIFO) y registrar el cobro de ingresos en el balance contable.
* Se liquida cualquier saldo restante pendiente de pago del pedido.

---

## 3. Modelo de Datos

### Entidad `ItemPedido` (Sin cambios persistentes)
Se mantiene la estructura limpia original:
* `id`: UUID
* `pedido`: Pedido
* `producto`: Producto (opcional)
* `calculo`: Calculo (opcional)
* `cantidad`: Integer
* `cantidadMerma`: Integer
* `subtotal`: Double

### Entidad `OrdenProduccion` (Persistida)
* `id`: UUID
* `itemPedido`: Relación `@ManyToOne` (opcional/nullable) con `ItemPedido`.
* `producto`: Relación `@ManyToOne` con `Producto`.
* `cantidad`: Integer.
* `tipo`: `INTERNA` | `EXTERNA`.
* `proveedor`: String (nombre/ID del proveedor si es externa).
* `costoEstimado`: Double (precio cobrado por el proveedor si es externa).
* `estado`: `COLA` | `IMPRIMIENDO` | `COMPLETADO` | `ENVIADO_PROVEEDOR` | `RECIBIDO_PROVEEDOR` | `CANCELADO`.
* `fechaInicio`: LocalDateTime
* `fechaFin`: LocalDateTime
