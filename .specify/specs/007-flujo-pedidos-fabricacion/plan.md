# Plan de Implementación: Flujo Dinámico de Pedidos, Stock y Fabricación

**Branch**: `007-flujo-pedidos-fabricacion` | **Spec**: [.specify/specs/007-flujo-pedidos-fabricacion/spec.md](spec.md)

## 1. Cambios en Backend (Spring Boot)

### A. Dominios Existentes (Sin cambios estructurales)
* `Pedido.java` e `ItemPedido.java` se mantienen **sin campos adicionales persistentes** de stock asignado.
* Agregar el estado `LISTO_PARA_ENTREGAR` y `CONFIRMADO` al enum `EstadoPedido` en `Pedido.java`.

### B. Nuevo Dominio: Producción
* Crear `com.printrm.studio.domain.produccion`:
  * `OrdenProduccion.java` (Entidad JPA):
    * `@Id @GeneratedValue` UUID
    * `@ManyToOne` `ItemPedido`
    * `cantidad` (Integer)
    * `tipo` (enum `TipoProduccion`: `INTERNA`, `EXTERNA`)
    * `estado` (enum `EstadoProduccion`: `COLA`, `IMPRIMIENDO`, `COMPLETADO`, `ENVIADO_PROVEEDOR`, `RECIBIDO_PROVEEDOR`, `CANCELADO`)
    * `costoEstimado` (Double)
    * `proveedor` (String)
  * `OrdenProduccionRepository.java`
  * `OrdenProduccionService.java`
  * `OrdenProduccionController.java`

### C. Lógica Dinámica en `PedidoService.java` o DTOs
* Al mapear `Pedido` a `PedidoResponseDTO`, calcular de forma dinámica para cada `ItemPedidoResponseDTO`:
  * `stockDisponible`: Consultar stock total actual del producto.
  * `cantidadFaltante`: `Math.max(0, item.getCantidad() - stockDisponible)`.
  * `ordenesProduccion`: Listado de órdenes de producción vinculadas a este ítem con sus estados y cantidades.

### D. Flujo de Producción y Registro de Egresos (`OrdenProduccionService`)
* Al crear una `OrdenProduccion` para un `ItemPedido`, se valida que la cantidad a producir no supere el faltante dinámico.
* Al marcar una `OrdenProduccion` como **finalizada** (estado `COMPLETADA` para internas o `RECIBIDO_PROVEEDOR` para externas):
  1. **Alta en Stock (FIFO):**
     * Registrar la entrada de stock en el producto llamando a `productoService.updateStock(productoId, orden.getCantidad())`.
     * **Cálculo de Costo de Lote:**
       * Si es **INTERNA:** El costo del lote se determina dinámicamente según el `Calculo` asociado al producto (costo de filamento + energía) multiplicado por la cantidad fabricada.
       * Si es **EXTERNA:** El costo del lote se determina a partir del `costoEstimado` (precio cobrado por el proveedor externo) dividido la cantidad de piezas.
  2. **Registro Contable de Egresos en Finanzas:**
     * **Para Órdenes Externas:** Al pasar a `RECIBIDO_PROVEEDOR`, se registra de forma obligatoria una transacción de **egreso** contable en el libro diario (`transaccionRepository.save(...)`):
       * Tipo: `EGRESO`
       * Categoría: `MATERIAL` (o subcategoría `TERCERIZACION` / `PROVEEDORES`)
       * Monto: `-orden.getCostoEstimado()` (negativo)
       * PedidoId: Asociado a `itemPedido.getPedido().getId()` (si la orden no es independiente/para stock) para que compute en la rentabilidad de ese pedido.
       * Descripción: `"Pago a proveedor externo [Nombre] por fabricación de [X] unidades de [Producto]"`
     * **Para Órdenes Internas:** Al pasar a `COMPLETADA`, si está vinculada a un pedido, se registran los egresos estimados de insumos (Material y Energía) calculados del `Calculo` del producto, restándolos de la caja para reflejar el desgaste real de insumos de ese pedido en el libro diario.
  3. No se requiere lógica compleja para asociar el stock al pedido en la base de datos: el stock total del producto aumenta, lo que hace que en la próxima consulta dinámica el faltante del pedido sea menor o cero.

### E. Lógica de Venta Centralizada (`VentaService.java`) y Entrega de Pedido
Para evitar duplicación y centralizar la lógica comercial, se introduce un servicio dedicado a procesar ventas:
1. **Nuevo Servicio: `VentaService.java`**:
   * Encapsula la acción de "Vender" un producto y asocia ambas dimensiones (stock y finanzas) mediante el método:
     ```java
     @Service
     @RequiredArgsConstructor
     public class VentaService {
         private final ProductoService productoService;
         private final TransaccionRepository transaccionRepository;
         private final ProductoRepository productoRepository;

         @Transactional
         public void registrarVenta(UUID productoId, int cantidad, double precioUnitario, UUID pedidoId) {
             Producto producto = productoRepository.findById(productoId)
                 .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
             
             // 1. Consume las piezas físicamente del stock usando lotes FIFO
             productoService.updateStock(productoId.toString(), -cantidad);
             
             // 2. Registra el ingreso contable en finanzas
             transaccionRepository.save(Transaccion.builder()
                 .tipo(Transaccion.TipoTransaccion.INGRESO)
                 .categoria(Transaccion.CategoriaTransaccion.VENTA)
                 .monto(precioUnitario * cantidad)
                 .pedidoId(pedidoId)
                 .descripcion("Venta de " + cantidad + " unidades de " + producto.getNombre())
                 .build());
         }
     }
     ```
2. **Confirmar Entrega de Pedido (`PedidoService.java`)**:
   * Al pasar el pedido a `ENTREGADO`:
     * Validar stock global disponible de los ítems de tipo producto antes de proceder.
     * Invocar a `VentaService.registrarVenta(item.getProducto().getId(), item.getCantidad(), item.getProducto().getPrecioSugerido(), pedido.getId())` por cada ítem.
     * Si quedaba algún saldo pendiente del pedido (`pedido.getTotal() - pedido.getMontoPagado() > 0`), se registra el cobro restante de manera habitual y se marca el pedido como cobrado en su totalidad.
     * De esta forma, la entrega de pedidos reutiliza de forma directa el canal de ventas estándar del sistema.

---

## 2. Cambios en Frontend (React)

### A. Vista de Detalle del Pedido (`PedidoDetalleView.tsx`)
* Mostrar dinámicamente para cada ítem:
  * Cantidad Solicitada.
  * Stock real disponible actual.
  * Si `Stock < Cantidad`: Mostrar una alerta indicando las unidades faltantes y un botón rápido **"Mandar a Fabricar"**.
  * Al hacer clic en "Mandar a Fabricar", se abre un formulario para indicar si es interna o externa y la cantidad (por defecto la cantidad faltante).

### B. Listar Órdenes de Producción en el Detalle
* Dentro del detalle del pedido, mostrar las órdenes de producción que se han generado para este pedido y sus estados actuales (`COLA`, `IMPRIMIENDO`, etc.) para que el usuario conozca la traza.

### C. Agenda de Producción
* Pantalla para ver todas las órdenes de producción activas en el sistema, permitiendo actualizarlas (ej. marcar como "Completada" o "Recibida"). Al completarse, impactará directamente en el stock general y actualizará dinámicamente el estado de los pedidos que dependían de ese stock.
