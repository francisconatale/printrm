# Frontend Roadmap: Fase 2 - Gestión Comercial & Finanzas

Este documento detalla los componentes y vistas a desarrollar para convertir **printrm** en una herramienta de gestión completa.

---

## 1. Módulo CRM & Pedidos (Prioridad: ALTA)
*   **Vistas:**
    *   `ClientesListView`: Tabla minimalista (hairline 0.5px) con búsqueda y KPIs rápidos por cliente.
    *   `PedidoDetalleView`: El "corazón" comercial. Permite agregar múltiples STL, ajustar cantidades, registrar señas y cambiar estados.
*   **Componentes Clave:**
    *   `ClienteSelector`: Componente de búsqueda rápida para asignar pedidos desde el cotizador.
    *   `EstadoBadge`: Visualización cromática sutil de los estados (Borrador, Cotizado, Proceso, etc.).

## 2. Módulo Stock & Biblioteca (Prioridad: MEDIA)
*   **Vistas:**
    *   `BibliotecaProView`: Galería de productos terminados.
    *   `ComposicionForm`: Interface para arrastrar y soltar piezas STL y formar un "Producto" (ej: Kit de Lámpara).
*   **Componentes Clave:**
    *   `StockCounter`: Control de inventario con botones +/- que disparan actualizaciones en el backend.
    *   `Mini3DPreview`: Visor ligero para las tarjetas de la galería.

## 3. Módulo Negocio & Finanzas (Prioridad: MEDIA)
*   **Vistas:**
    *   `LibroDiario`: Lista cronológica de todos los movimientos de dinero.
    *   `DashboardFinanciero`: Gráficos de barras para Ingresos vs Gastos y cálculo automático de ROI (Retorno de Inversión).
*   **Componentes Clave:**
    *   `TransactionForm`: Para cargar gastos manuales (ej: compra de correas o boquillas).

---

# Checklist de Validación Manual (QA)

Utilizar este checklist para probar la respuesta del sistema ante escenarios disruptivos:

### Flujo de Venta y Balance
- [ ] **Venta Exitosa:** Crear pedido -> Entregar. Verificar que el monto total aparezca en "Ingresos" y el costo STL en "Egresos".
- [ ] **Pago Parcial:** Registrar una seña del 50%. Verificar que el balance aumente solo por ese monto y el pedido muestre "Saldo Pendiente".
- [ ] **Liquidación Final:** Marcar como "Entregado" un pedido con seña. Verificar que el sistema autogenere el ingreso del saldo restante.

### Flujo de Fallos y Devoluciones
- [ ] **Merma por Unidad:** En un pedido de 10 unidades, marcar 2 como "Merma". Verificar en el Libro Diario que aparezca el registro de ajuste de categoría sin restar dinero extra.
- [ ] **Devolución Total:** Cambiar estado a "Devuelto". Verificar que se genere una transacción de tipo "REEMBOLSO" con monto negativo que anule la venta.
- [ ] **Devolución con Seña (Blindaje):** Cambiar estado a "Devuelto" en un pedido con pago parcial (seña). Verificar que la transacción de tipo "REEMBOLSO" devuelva únicamente el `montoPagado` y no el `total` del pedido.
- [ ] **Integridad de Stock:** Al devolver un producto, verificar si el contador de stock aumentó (si se marcó como recuperable).

### Usabilidad Studio Edition
- [ ] **Consistencia Visual:** Verificar que todas las tablas y divisores usen `border-[0.5px]` y color `Ink/10`.
- [ ] **Feedback Táctil:** Comprobar que todos los botones de acción tengan la animación `active:scale-95`.
- [ ] **Responsive:** Probar que la lista de pedidos sea legible en una ventana de ancho reducido.

---

## Próximo Paso Técnico:
Implementar los **Hooks de TanStack Query** para la API de Clientes y Pedidos para empezar a hidratar estas vistas.
