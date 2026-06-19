# Tasks: Flujo Dinámico de Pedidos, Stock y Fabricación

## Phase 1: Backend Foundations & Entities (Java)
- [x] T001 Crear la entidad `OrdenProduccion.java` con relación `@ManyToOne` nullable hacia `ItemPedido` y su repositorio `OrdenProduccionRepository.java` en `backend/src/main/java/com/printrm/studio/domain/produccion/`.
- [x] T002 Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java`.

## Phase 2: Business Logic & Services (Backend)
- [x] T003 Modificar `PedidoService.java` y `PedidoResponseDTO` para calcular dinámicamente la cantidad faltante de stock y listar las órdenes asociadas para cada ítem.
- [x] T004 Crear el servicio `VentaService.java` centralizando la lógica de venta: consumo de stock (FIFO) y registro contable de ingresos contables.
- [x] T005 Crear `OrdenProduccionService.java` con soporte para crear órdenes vinculadas a pedidos y órdenes independientes (para stock propio).
- [x] T006 Implementar en `OrdenProduccionService` el flujo de finalización de órdenes: alta de stock (lote FIFO) y registro contable de egresos (costo cobrado por proveedor si es externa, o insumos si es interna).
- [x] T007 Modificar la lógica de entrega en `PedidoService` para validar stock real y delegar el consumo y registro de ingresos en `VentaService.registrarVenta`, liquidando el cobro restante.
- [x] T008 Crear `OrdenProduccionController.java` expeliendo endpoints para la creación y gestión del estado de las órdenes de producción.

## Phase 3: Frontend - Detalle de Pedido (React)
- [x] T009 Modificar `PedidoDetalleView.tsx` para calcular e informar en pantalla la cantidad en stock, en producción y el faltante neto de cada ítem de tipo producto.
- [x] T010 Crear el modal de creación de orden de producción vinculada para piezas faltantes y conectarlo con la API.

## Phase 4: Frontend - Agenda de Producción (React)
- [x] T011 Crear la vista de "Agenda de Producción" que liste las órdenes agrupadas/filtradas por estado y tipo (Para Cliente vs. Para Stock).
- [x] T012 Implementar formulario en la Agenda de Producción para crear órdenes independientes (para stock propio) y conectarlo con la API.
- [ ] T013 Agregar botones en la Agenda para avanzar el estado de las órdenes de producción.

## Phase 5: Testing & Verification
- [ ] T014 Escribir pruebas unitarias e integración para `VentaService`, `PedidoService` (cálculo dinámico y entrega) y `OrdenProduccionService` (ingreso de stock y egresos).
- [ ] T015 Realizar pruebas de flujo completo: Crear pedido -> Ver faltante -> Mandar a fabricar -> Completar orden en Agenda -> Verificar stock ingresado y egreso -> Entregar pedido -> Verificar venta registrada e ingreso final.
