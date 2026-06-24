# Feature Specification: Venta Directa POS

**Feature Branch**: `011-venta-directa-pos`

**Created**: 2026-06-24

**Status**: Draft

**Input**: User description: "Agregar venta directa a consumidor final desde el catálogo de stock, sin pasar por el flujo completo de pedidos."

## User Scenarios & Testing

### User Story 1 - Venta Rápida desde Catálogo (Priority: P1)

Como usuario, quiero poder vender un producto directamente desde el catálogo de stock con un solo clic, para consumidores finales que no requieren factura ni pedido formal.

**Why this priority**: Es el core de la feature — permite concretar ventas al instante sin fricción.

**Independent Test**: Se puede hacer una venta completa en 3 clics: abrir modal, confirmar cantidad, emitir.

**Acceptance Scenarios**:

1. **Given** un producto en el catálogo con stock > 0, **When** hago clic en "Vender", **Then** se abre un modal con el nombre, precio, y selector de cantidad.
2. **Given** el modal de venta abierto, **When** confirmo la venta, **Then** el stock se reduce vía FIFO y se registra una transacción financiera.
3. **Given** una venta exitosa, **When** se confirma, **Then** veo un toast de éxito y el stock se actualiza en la card.

---

### User Story 2 - Historial de Ventas Rápidas (Priority: P2)

Como usuario, quiero poder ver un registro de las ventas directas realizadas para llevar la cuenta.

**Why this priority**: Proporciona trazabilidad sin requerir el sistema completo de pedidos.

**Independent Test**: Al abrir el historial desde el catálogo, veo una lista de ventas directas con fecha, producto, monto.

**Acceptance Scenarios**:

1. **Given** que hay ventas directas registradas, **When** abro el historial, **Then** veo una lista cronológica con producto, cantidad, total, y fecha.
2. **Given** el historial, **When** hago clic en una venta, **Then** veo el detalle (producto, cantidad, precio unitario, total, fecha, y si fue a consumidor final).

---

### User Story 3 - Venta a Consumidor Final con Datos Opcionales (Priority: P3)

Como usuario, quiero poder registrar opcionalmente nombre o email del comprador para seguimiento básico.

**Why this priority**: Mejora la trazabilidad sin obligar al flujo completo de clientes.

**Independent Test**: Puedo completar una venta con y sin datos del comprador, y ambas se registran correctamente.

**Acceptance Scenarios**:

1. **Given** el modal de venta, **When** ingreso opcionalmente nombre/email del comprador, **Then** esos datos se guardan asociados a la transacción.
2. **Given** el modal de venta, **When** no ingreso datos del comprador, **Then** la venta se registra como "Consumidor Final".

---

### Edge Cases

- ¿Qué pasa cuando el stock es insuficiente para la cantidad solicitada? → Mostrar error y sugerir stock disponible máximo.
- ¿Qué pasa cuando el producto no tiene `precioSugerido`? → Mostrar advertencia y requerir que se ingrese un precio antes de vender.
- ¿Qué pasa si hay múltiples lotes FIFO? → El backend ya maneja el consumo FIFO cascade.
- ¿Cómo se refleja en finanzas? → Se crea una transacción de tipo INGRESO categoría VENTA.
- ¿Se puede vender con stock 0? → No, el botón debe estar deshabilitado o mostrar advertencia.

## Visual Compliance

- **Design System**: MUST strictly follow the principles defined in `.specify/memory/constitution.md` (Studio Edition).
- **Borders**: MUST use Hairline (#e0e0e0) 1px borders for separation.
- **Typography**: MUST use Inter with Studio Tight tracking for headlines and 17px for body.
- **Shadows**: MUST NOT use shadows on UI components (buttons, cards).

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow selling a product directly from the stock catalog with a single action.
- **FR-002**: System MUST reduce stock via FIFO (reusing existing `ProductoService.consumeStock`) when a direct sale is confirmed.
- **FR-003**: System MUST register a financial transaction (INGRESO/VENTA) for each direct sale.
- **FR-004**: System MUST show a confirmation modal with product name, price, quantity selector, and optional buyer data.
- **FR-005**: System MUST validate stock availability before confirming the sale.
- **FR-006**: System MUST update the stock quantity in real-time on the ProductoCard after a sale.
- **FR-007**: System MUST create a lightweight "VentaDirecta" record (or reuse Pedido en estado COTIZADO/CONFIRMADO simplificado) for traceability.
- **FR-008**: System MUST allow optional buyer name/email without requiring full Cliente creation.
- **FR-009**: System MUST show a history of direct sales from the stock catalog view.

### Key Entities

- **VentaDirecta**: Simplified sale record (id, productoId, cantidad, precioUnitario, total, compradorNombre?, compradorEmail?, fecha, pedidoId opcional).
- **Transaccion**: Existing entity — INGRESO/VENTA linked to the VentaDirecta via pedidoId.
- **Pedido** (reused): Optionally create a minimal Pedido (sin cliente) for financial tracing, with estado COTIZADO -> CONFIRMADO -> ENTREGADO.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Una venta directa se completa en 3 clics o menos.
- **SC-002**: El stock se actualiza en la UI inmediatamente después de confirmar la venta.
- **SC-003**: La transacción financiera aparece en el Libro Diario inmediatamente.
- **SC-004**: Cero errores en consumo FIFO (validado contra stock real).
