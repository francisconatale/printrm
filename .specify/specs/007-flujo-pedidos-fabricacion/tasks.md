# Tasks: Flujo Dinámico de Pedidos, Stock y Fabricación

## Phase 1: Backend Foundations & Entities (Java)
- [ ] T001 Crear la entidad `OrdenProduccion.java` con relación `@ManyToOne` nullable hacia `ItemPedido` y su repositorio `OrdenProduccionRepository.java` en `backend/src/main/java/com/printrm/studio/domain/produccion/`.
- [ ] T002 Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java`.

## Phase 2: Business Logic & Services (Backend)
- [ ] T003 Modificar `PedidoService.java` y `PedidoResponseDTO` para calcular dinámicamente la cantidad faltante de stock y listar las órdenes asociadas para cada ítem.
- [ ] T004 Crear `OrdenProduccionService.java` con soporte para crear órdenes vinculadas a pedidos y órdenes independientes (para stock propio).
- [ ] T005 Implementar la lógica en `OrdenProduccionService` para que al completar o recibir una orden se incremente el stock físico del producto mediante un nuevo lote FIFO.
- [ ] T006 Modificar la lógica de entrega en `PedidoService` para verificar y descontar físicamente el stock real (FIFO) al pasar el pedido a `ENTREGADO`.
- [ ] T007 Crear `OrdenProduccionController.java` para exponer los endpoints de creación, listado y actualización de estado.

## Phase 3: Frontend - Detalle de Pedido (React)
- [ ] T008 Modificar `PedidoDetalleView.tsx` para calcular e informar en pantalla la cantidad en stock, en producción y el faltante neto de cada ítem de tipo producto.
- [ ] T009 Crear el modal de creación de orden de producción vinculada para piezas faltantes y conectarlo con la API.

## Phase 4: Frontend - Agenda de Producción (React)
- [ ] T010 Crear la vista de "Agenda de Producción" que liste las órdenes agrupadas/filtradas por estado y tipo (Para Cliente vs. Para Stock).
- [ ] T011 Implementar formulario en la Agenda de Producción para crear órdenes independientes (para stock propio) y conectarlo con la API.
- [ ] T012 Agregar botones en la Agenda para avanzar el estado de las órdenes de producción.

## Phase 5: Testing & Verification
- [ ] T013 Escribir pruebas unitarias e integración para el cálculo dinámico de faltantes y el ingreso de stock al completar órdenes.
- [ ] T014 Realizar pruebas de flujo completo: Crear pedido -> Ver faltante -> Mandar a fabricar -> Completar orden en Agenda -> Verificar stock ingresado -> Entregar pedido.
