# Tarea Actual: Calcular Dinámicamente Stock Faltante en Pedido (T003)

## Estado
- [x] Crear la entidad `OrdenProduccion.java` con sus enums y relaciones (T001).
- [x] Crear `OrdenProduccionRepository.java` (T001).
- [x] Agregar estados `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java` (T002).
- [ ] Modificar `PedidoResponseDTO` (o `ItemPedidoResponseDTO`) para incluir stock disponible, faltantes y órdenes asociadas (T003).
- [ ] Modificar `PedidoService.java` para calcular dinámicamente los faltantes y órdenes en tiempo de ejecución (T003).
- [ ] Validar compilación del backend.
- [ ] Registrar en el `CHANGELOG.md` y realizar commit atómico para T003.

## Archivos involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoResponseDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java`
- `CHANGELOG.md`
- `.specify/current_task_summary.md`
