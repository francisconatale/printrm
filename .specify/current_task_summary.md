# Tarea Actual: Corregir selección de tipo de ítem en CrearPedidoModal (T014)

## Estado
- [x] Crear la entidad `OrdenProduccion.java` con sus enums y relaciones (T001).
- [x] Crear `OrdenProduccionRepository.java` (T001).
- [x] Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java` (T002).
- [x] Modificar `PedidoResponseDTO` (o `ItemPedidoResponseDTO`) para incluir stock disponible, faltantes y órdenes asociadas (T003).
- [x] Modificar `PedidoService.java` para calcular dinámicamente los faltantes y órdenes en tiempo de ejecución (T003).
- [x] Crear la clase de servicio `VentaService.java` con el método `registrarVenta` (T004).
- [x] Crear la clase de servicio `OrdenProduccionService.java` con soporte para crear órdenes vinculadas e independientes (T005).
- [x] Implementar alta de stock FIFO y registro de egresos (outsourcing o costo de insumos teóricos) al finalizar órdenes en `OrdenProduccionService.java` (T006).
- [x] Modificar la lógica de entrega en `PedidoService.java` para delegar el descuento de stock e ingresos en `VentaService.registrarVenta` al pasar el pedido a `ENTREGADO` (T007).
- [x] Crear la clase controladora `OrdenProduccionController.java` exponiendo los endpoints (T008).
- [x] Modificar `PedidoDetalleView.tsx` en el frontend para calcular e informar en pantalla la cantidad en stock, en producción y el faltante neto (T009).
- [x] Crear el modal de creación de orden de producción vinculada para piezas faltantes y conectarlo con la API (T010).
- [x] Crear la vista de "Agenda de Producción" que liste las órdenes agrupadas/filtradas por estado y tipo (T011).
- [x] Crear el modal de creación de orden de producción independiente para reponer stock propio (T012).
- [x] Agregar botones en la Agenda para avanzar el estado de las órdenes de producción (T013).
- [ ] Corregir lógica de selección de tipo de ítem (Cotización vs Producto) en `CrearPedidoModal.tsx` (T014).

## Archivos involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
- `.specify/current_task_summary.md`
