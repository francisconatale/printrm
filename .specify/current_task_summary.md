# Tarea Actual: Modificar Lógica de Entrega en PedidoService (T007)

## Estado
- [x] Crear la entidad `OrdenProduccion.java` con sus enums y relaciones (T001).
- [x] Crear `OrdenProduccionRepository.java` (T001).
- [x] Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java` (T002).
- [x] Modificar `PedidoResponseDTO` (o `ItemPedidoResponseDTO`) para incluir stock disponible, faltantes y órdenes asociadas (T003).
- [x] Modificar `PedidoService.java` para calcular dinámicamente los faltantes y órdenes en tiempo de ejecución (T003).
- [x] Crear la clase de servicio `VentaService.java` con el método `registrarVenta` (T004).
- [x] Crear la clase de servicio `OrdenProduccionService.java` con soporte para crear órdenes vinculadas e independientes (T005).
- [x] Implementar alta de stock FIFO y registro de egresos (outsourcing o costo de insumos teóricos) al finalizar órdenes en `OrdenProduccionService.java` (T006).
- [ ] Modificar la lógica de entrega en `PedidoService.java` para delegar el descuento de stock e ingresos en `VentaService.registrarVenta` al pasar el pedido a `ENTREGADO` (T007).
- [ ] Validar compilación del backend.
- [ ] Registrar en el `CHANGELOG.md` y realizar commit atómico para T007.

## Archivos involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java`
- `CHANGELOG.md`
- `.specify/current_task_summary.md`
