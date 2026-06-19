# Tarea Actual: Visualizar Stock y Faltantes en el Detalle del Pedido (T009)

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
- [ ] Modificar `PedidoDetalleView.tsx` en el frontend para calcular e informar en pantalla la cantidad en stock, en producción y el faltante neto (T009).
- [ ] Registrar en el `CHANGELOG.md` y realizar commit atómico para T009.

## Archivos involucrados
- `frontend/src/features/pedidos/components/PedidoDetalleView.tsx`
- `CHANGELOG.md`
- `.specify/current_task_summary.md`
