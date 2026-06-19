# Tarea Actual: Crear Servicio de Producción OrdenProduccionService (T005)

## Estado
- [x] Crear la entidad `OrdenProduccion.java` con sus enums y relaciones (T001).
- [x] Crear `OrdenProduccionRepository.java` (T001).
- [x] Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java` (T002).
- [x] Modificar `PedidoResponseDTO` (o `ItemPedidoResponseDTO`) para incluir stock disponible, faltantes y órdenes asociadas (T003).
- [x] Modificar `PedidoService.java` para calcular dinámicamente los faltantes y órdenes en tiempo de ejecución (T003).
- [x] Crear la clase de servicio `VentaService.java` con el método `registrarVenta` (T004).
- [ ] Crear la clase de servicio `OrdenProduccionService.java` con soporte para crear órdenes vinculadas e independientes (T005).
- [ ] Validar compilación del backend.
- [ ] Registrar en el `CHANGELOG.md` y realizar commit atómico para T005.

## Archivos involucrados
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionService.java`
- `CHANGELOG.md`
- `.specify/current_task_summary.md`
