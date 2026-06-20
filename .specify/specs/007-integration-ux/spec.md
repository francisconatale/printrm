# Feature Specification: UX Optimization - STL to Product & Variable Pricing Flow

**Feature Branch**: `007-integration-ux`

**Created**: 2026-06-20

**Status**: Draft

**Input**: Simplificación y optimización del flujo frontend para: subir STL, crear producto de catálogo y permitir variación de precios según el día sin fricciones de navegación.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicar Producto desde Biblioteca STL (Priority: P1)

Como usuario, quiero poder crear un producto en el catálogo directamente desde la tarjeta de una pieza STL en la biblioteca, para evitar tener que navegar manualmente al catálogo de stock e iniciar la composición desde cero.

**Independent Test**:
En la vista "Biblioteca STL", al hacer clic en un nuevo botón "Publicar en Catálogo" en la tarjeta de una pieza STL, se abre el modal "Nuevo Producto" pre-completando el nombre y asociando automáticamente dicha pieza.

**Acceptance Scenarios**:
1. **Given** la vista "Biblioteca STL" cargada con piezas, **When** hago clic en "Publicar en Catálogo", **Then** se abre el modal de composición de producto con el campo `nombre` inicializado con el nombre de la pieza y dicha pieza ya seleccionada en la lista.
2. **Given** el modal abierto por esta vía rápida, **When** confirmo la creación, **Then** el producto se guarda correctamente en el catálogo.

---

### User Story 2 - Sobrescribir Precio del Ítem en el Pedido (Priority: P1)

Como usuario, quiero poder modificar el precio unitario de un producto directamente en las líneas del pedido al momento de crearlo, para poder ajustar cotizaciones y precios variables del día sin necesidad de editar el precio base del producto en el catálogo general.

**Why this priority**: Resuelve la necesidad de que el precio varíe según el día o el cliente sin requerir cambios globales en el catálogo.

**Independent Test**:
En el modal "Nuevo Pedido", al seleccionar un producto, el precio unitario sugerido se muestra en un campo de texto editable (input). Si el usuario lo modifica, el subtotal de la línea y el total del pedido se recalculan instantáneamente con este precio modificado.

**Acceptance Scenarios**:
1. **Given** el modal "Nuevo Pedido", **When** selecciono un producto, **Then** se visualiza su precio unitario en un campo editable inicializado con su `precioSugerido`.
2. **Given** una línea de pedido con un producto, **When** edito su precio unitario, **Then** el subtotal de esa línea (`precio modificado * cantidad`) y el total del pedido se actualizan de forma inmediata.

---

## Requirements *(mandatory)*

### Visual Compliance
- **Design System**: Cumplimiento riguroso de la Studio Constitution.
- **Inputs**: Campos de entrada en la grilla del modal del pedido de tamaño regular, con bordes hairline y fuente monoespaciada para los valores financieros.

### Functional Requirements
- **FR-001**: El modal de creación de pedido MUST soportar un precio de venta personalizado (`precioUnitario`) por ítem.
- **FR-002**: Si no se modifica, el precio unitario de la línea MUST por defecto ser el del catálogo.
- **FR-003**: El JSON enviado al endpoint `POST /api/v1/pedidos` MUST reflejar estos precios en su composición de items.
- **FR-004**: La tarjeta `STLCard` en la biblioteca MUST incluir una acción directa para crear un producto asociado a esa pieza.

## Success Criteria *(mandatory)*
- **SC-001**: Creación de un producto desde biblioteca en menos de 2 clics.
- **SC-002**: Posibilidad de cambiar el precio unitario de un pedido a nivel de ítem en menos de 5 segundos sin salir del modal de pedido.
