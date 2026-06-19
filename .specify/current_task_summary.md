# Tarea Actual: Crear Servicio de Venta Centralizado VentaService (T004)

## Estado
- [x] Crear la entidad `OrdenProduccion.java` con sus enums y relaciones (T001).
- [x] Crear `OrdenProduccionRepository.java` (T001).
- [x] Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java` (T002).
- [x] Modificar `PedidoResponseDTO` (o `ItemPedidoResponseDTO`) para incluir stock disponible, faltantes y órdenes asociadas (T003).
- [x] Modificar `PedidoService.java` para calcular dinámicamente los faltantes y órdenes en tiempo de ejecución (T003).
- [ ] Crear la clase de servicio `VentaService.java` con el método `registrarVenta` (T004).
- [ ] Validar compilación del backend.
- [ ] Registrar en el `CHANGELOG.md` y realizar commit atómico para T004.

## Archivos involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/VentaService.java`
- `CHANGELOG.md`
- `.specify/current_task_summary.md`
