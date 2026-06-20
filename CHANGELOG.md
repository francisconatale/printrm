# CHANGELOG

## [2026-06-21] - Rediseño estilo iPhone de PedidoDetalleView y validación de estado
### Descripción
- **Frontend (Pedidos):**
  - Se rediseñó la vista `PedidoDetalleView.tsx` siguiendo estándares estéticos de iOS/iPhone: se implementó un encabezado limpio tipo tarjeta, una barra de progreso del flujo de trabajo, una barra de completado de pago y se organizó la gestión de estados destacando el siguiente paso recomendado en un panel interactivo premium.
- **Backend (Pedidos):**
  - Se modificó `PedidoService.java` para comprobar explícitamente si el pedido ya está en estado `ENTREGADO` antes de procesar cambios a ese mismo estado, arrojando una excepción clara si se intenta entregar de nuevo.
### Archivos Involucrados
- [PedidoDetalleView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidoDetalleView.tsx)
- [PedidoService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java)

## [2026-06-21] - Control de doble entrega e idempotencia en Pedidos
### Descripción
- **Backend (Pedidos):** 
  - Se añadió la propiedad `cantidadEntregada` a `ItemPedido` para llevar un control granular de las unidades ya suministradas al cliente.
  - Se modificó `PedidoService.cambiarEstado` para validar que no se dupliquen entregas/devoluciones de stock y cobros basándose en el inventario pendiente por entregar.
  - Se actualizó el cálculo de **Faltante Neto** (`cantidadFaltante`) para que ignore las unidades que ya fueron entregadas con éxito, reduciéndose a cero al completarse la entrega.
- **Backend (Pruebas):** Se añadieron pruebas de integración en `PedidoIntegrationTest.java` (`testEntregarPedidoDosVecesLanzaExcepcion` y `testDevolverPedidoDosVecesLanzaExcepcion`) para garantizar que al intentar realizar entregas o devoluciones duplicadas se arroje una excepción `IllegalStateException`.
- **Frontend (Pedidos):** Se actualizó `PedidoDetalleView.tsx` para renderizar visualmente las unidades entregadas por ítem y deshabilitar los botones de acción para estados finales (`ENTREGADO`, `DEVUELTO`, `CANCELADO`) una vez que el pedido se sitúa en ellos.
### Archivos Involucrados
- [PedidoService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java)
- [PedidoIntegrationTest.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/test/java/com/printrm/studio/domain/pedidos/PedidoIntegrationTest.java)
- [pedidos.types.ts](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/types/pedidos.types.ts)
- [PedidoDetalleView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidoDetalleView.tsx)


## [2026-06-21] - Reutilización de componente Select en Modal de Nueva Orden de Stock
### Descripción
- **Frontend (Producción):** Se actualizó el modal `CrearOrdenIndependienteModal.tsx` reemplazando el elemento `<select>` nativo de HTML por el componente de diseño personalizado `Select` de la aplicación (`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`), mejorando la coherencia de la UI y agregando una opción de selección por defecto "Seleccionar Producto...".
### Archivos Involucrados
- [CrearOrdenIndependienteModal.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/produccion/components/CrearOrdenIndependienteModal.tsx)

## [2026-06-21] - Rediseño premium del modal de Nuevo Pedido
### Descripción
- **Frontend (Pedidos):** Se rediseñó por completo el modal `CrearPedidoModal.tsx` incorporando principios de `ui-ux-pro-max`:
  - Se estilizó el selector de clientes en un contenedor premium con fondo `bg-muted/20` e icono descriptivo de usuario.
  - Se rediseñó la lista de productos de pedido en una grilla responsive muy pulida, agregando clases de foco en inputs, bordes suaves hover y transiciones fluidas.
  - Se implementó un panel de resumen financiero de tipo business intelligence que calcula automáticamente en tiempo real la cantidad total de unidades, el costo de producción acumulado, la ganancia estimada y la rentabilidad porcentual esperada del pedido.
### Archivos Involucrados
- [CrearPedidoModal.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/CrearPedidoModal.tsx)

## [2026-06-21] - Modificación de borde drag-drop en STLUpload
### Descripción
- **Frontend (Calculadora):** Se modificó el estilo del borde de la zona de arrastre (drag-drop) en `STLUpload.tsx`, reemplazando el borde continuo por un borde discontinuo neutral (`border-2 border-dashed border-gray-300 dark:border-zinc-700`) para ajustarse a los patrones de diseño estándar.
### Archivos Involucrados
- [STLUpload.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/calculo/components/STLUpload.tsx)

## [2026-06-21] - Corrección de Visualización en HistorialMensual y MetricCards de Finanzas
### Descripción
- **Frontend (Finanzas):**
  - Se corrigió la visualización del gráfico de Historial Mensual separando las etiquetas del eje X del contenedor principal con borde inferior (`border-b`). Ahora las etiquetas se muestran debajo de la línea del eje X en una fila independiente y alineada.
  - Se ajustó el espaciado interno (padding) de las tarjetas de métricas (`MetricCards`) utilizando clases adaptativas (`p-6 md:p-4 xl:p-6`) y se redujo la escala de la tipografía para los valores (`text-2xl sm:text-3xl md:text-xl lg:text-2xl xl:text-3xl`) con truncamiento automático (`truncate`). Esto previene desbordamientos y saltos de línea molestos al visualizar montos negativos muy largos o con símbolos adicionales en pantallas medianas/pequeñas.
### Archivos Involucrados
- [FinanzasDashboard.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/finanzas/components/FinanzasDashboard.tsx)

## [2026-06-21] - Ajuste de borde de estado vacío en Pedidos
### Descripción
- **Frontend (Pedidos):** Se modificaron los bordes dashed del estado vacío en la vista de lista de pedidos (`PedidosListView.tsx`), reemplazando la clase `border-border/60` (que tenía un color brillante) por `border-zinc-200 dark:border-zinc-800` para brindar un tono más suave y armónico en el modo oscuro.
### Archivos Involucrados
- [PedidosListView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidosListView.tsx)

## [2026-06-20] - Pruebas y validación para el flujo de pedidos y fabricación (T014, T015)
### Descripción
- **Backend (Pruebas):** 
  - Se crearon pruebas de integración para `VentaService` en `VentaServiceIntegrationTest.java` para verificar el correcto descuento de stock y el registro de la transacción de ingreso.
  - Se implementaron pruebas de integración y flujo completo en `PedidoFlujoCompletoIntegrationTest.java` para validar el cálculo dinámico de faltantes neto (basado en stock real y órdenes en producción) y el flujo completo (desde la creación de un pedido, mandarlo a fabricar, completar la orden y realizar la entrega definitiva con impacto financiero).
### Archivos Involucrados
- [VentaServiceIntegrationTest.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/test/java/com/printrm/studio/domain/pedidos/VentaServiceIntegrationTest.java)
- [PedidoFlujoCompletoIntegrationTest.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/test/java/com/printrm/studio/domain/pedidos/PedidoFlujoCompletoIntegrationTest.java)
- [.specify/history/sprint-2/007-flujo-pedidos-fabricacion/tasks.md](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/007-flujo-pedidos-fabricacion/tasks.md)
- [.specify/current_task_summary.md](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/current_task_summary.md)

## [2026-06-20] - Solución a doble notificación toast al guardar pieza
### Descripción
- **Frontend (Calculadora):** Se eliminó la visualización manual duplicada del toast de éxito/error al guardar una pieza en la biblioteca en `CalculadoraView.tsx`, ya que la mutación `useGuardarPieza` (vía `useMutationWithFeedback`) se encarga de mostrar la notificación correspondiente de forma automática.
### Archivos Involucrados
- [CalculadoraView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/calculo/components/CalculadoraView.tsx)

## [2026-06-20] - Archivado de especificaciones completadas
### Descripción
- **Estructura del Proyecto (.specify):** Se eliminaron las tareas de pulido `T016` y `T017` en `005-roadmap-phase-2` por no ser necesarias, y la tarea deprecada `T003` en `003-historial-exportacion`. Al no quedar tareas pendientes, se archivaron las siguientes especificaciones completadas al 100% moviéndolas a `.specify/history/sprint-2/`:
  - `003-historial-exportacion`
  - `004-biblioteca-stl`
  - `005-roadmap-phase-2`
  - `007-flujo-pedidos-fabricacion`
  - `007-integration-ux`
  - `008-auditoria-ux`
  - `009-correcciones-errores`
### Archivos Involucrados
- [.specify/specs/003-historial-exportacion/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/003-historial-exportacion/) (movido a history)
- [.specify/specs/004-biblioteca-stl/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/004-biblioteca-stl/) (movido a history)
- [.specify/specs/005-roadmap-phase-2/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/005-roadmap-phase-2/) (movido a history)
- [.specify/specs/007-flujo-pedidos-fabricacion/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/007-flujo-pedidos-fabricacion/) (movido a history)
- [.specify/specs/007-integration-ux/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/007-integration-ux/) (movido a history)
- [.specify/specs/008-auditoria-ux/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/008-auditoria-ux/) (movido a history)
- [.specify/specs/009-correcciones-errores/](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/history/sprint-2/009-correcciones-errores/) (movido a history)

## [2026-06-20] - Merges Condicionales, Validación de Enums y Recarga de DB (T004)
### Descripción
- **Backend:**
  - Se implementó la lógica de merge condicional en `PerfilService.java` (`updateEntity`) para evitar que las actualizaciones parciales reseteen los campos no provistos a nulo.
  - Se incorporó la validación estricta de cadenas de estado contra el enum `Pedido.EstadoPedido` en `PedidoService.java` (`cambiarEstado`), lanzando `IllegalArgumentException` si la cadena es inválida.
  - Se forzó la recarga desde la base de datos de la entidad `Producto` en `ProductoService.java` (`save`) tras registrar el stock inicial, asegurando que los detalles de los lotes y stock actualizados se retornen de manera fresca en el DTO de respuesta.
### Archivos Involucrados
- [PerfilService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/perfil/PerfilService.java)
- [PedidoService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java)
- [ProductoService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/stock/ProductoService.java)

## [2026-06-20] - Estabilización de Servicios Core y Null-Safety (T002)
### Descripción
- **Backend:**
  - Se añadieron validaciones de nulos en `TransaccionService.java` para prevenir excepciones por autodesarchivado al calcular el balance total.
  - Se agregaron controles de seguridad frente a valores nulos al acceder al campo `item.getCantidad()` en varios puntos críticos de `PedidoService.java` (métodos `cambiarEstado`, `registrarGastoProduccion` y conversiones de DTOs).
  - Se implementaron controles de nulos en `CostCalculationService.java` para las variables de ajustes y `preciokWh`, con valores predeterminados seguros (`0.15` y `0.0` respectivamente).
  - Se corrigió una potencial excepción por puntero nulo en la prueba de integración de `OrdenProduccionServiceIntegrationTest.java` al interactuar con transacciones cuyo identificador de pedido es nulo.
### Archivos Involucrados
- [TransaccionService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionService.java)
- [PedidoService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java)
- [CostCalculationService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/calculo/CostCalculationService.java)
- [OrdenProduccionServiceIntegrationTest.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/test/java/com/printrm/studio/domain/produccion/OrdenProduccionServiceIntegrationTest.java)

## [2026-06-20] - Rediseño Elegante (iPhone Style) de Modales
### Descripción
- **Frontend (Stock/Biblioteca):**
  - Se rediseñó [LotesProductoModal.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/LotesProductoModal.tsx) para aplicar un estilo refinado tipo iPhone: se agregó una cabecera explicativa del método FIFO con estilo de notificación de iOS y se implementó una lista agrupada con el diseño clásico de "Configuración de iPhone" (tarjetas agrupadas con bordes redondeados `rounded-3xl`, divisores finos y badges de estado personalizados) y soporte de animaciones suaves. Se eliminó el scroll interno y la restricción de altura para ver todo el contenido directamente.
  - Se actualizó [PiezaDetailModal.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/PiezaDetailModal.tsx) con bordes sumamente redondeados, colores de fondo dinámicos que se adaptan al tema activo (light/dark mode) y una tarjeta de costos consolidada con estilo iOS. Se eliminaron las restricciones fijas de altura del visor y la columna de metadatos, y se configuró su tamaño a `90vw` (ancho máximo del 90% del viewport) con un límite de altura general de `90vh`, quitando cualquier scrollbar interno para mostrar la información unificada de una sola vez de forma muy espaciosa. Se removieron adornos genéricos (`Sparkles`).
  - Se optimizó [STLCard.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/STLCard.tsx) removiendo la previsualización 3D interactiva en hover dentro de la miniatura de la card en la galería. Esto mejora radicalmente el rendimiento de renderizado general de la galería; ahora, la previsualización 3D interactiva se abre directamente al hacer click y entrar al modal de detalle.
  - Se optimizó y simplificó [ProductoCard.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/ProductoCard.tsx) reemplazando la previsualización 3D pesada por defecto por la miniatura de la primera parte en 2D, reduciendo drásticamente la latencia y consumo de recursos de la galería de stock y aplicando el minimalismo exigido en el sistema de diseño.
  - Se incorporó una mini miniatura visual en las filas de la tabla de [ProductosGalleryView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/ProductosGalleryView.tsx) utilizando la previsualización 2D de la primera pieza, permitiendo una rápida identificación visual de cada producto sin alterar la estructura compacta.
  - Se unificó la tipografía en [FinanzasDashboard.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/finanzas/components/FinanzasDashboard.tsx) y en [LibroDiarioView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/finanzas/components/LibroDiarioView.tsx) eliminando la clase `font-mono` en métricas, gráficos, listas de transacciones y fechas para alinearlos al estilo limpio e Inter (sans-serif) de iPhone.

## [2026-06-20] - Ajustes en Catálogo de Stock y Desglose de Costos (T027)
### Descripción
- **Backend:**
  - Se modificó [PiezaSTLResponseDTO.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLResponseDTO.java) y [PiezaSTLService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLService.java) para exponer el desglose de costos calculados (`costoMaterial` y `costoEnergia`) en cada pieza del producto.
- **Frontend:**
  - Se actualizó [biblioteca.types.ts](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/types/biblioteca.types.ts) para soportar las nuevas propiedades.
  - Se eliminó la columna "Costo Fab." de la tabla del catálogo en [ProductosGalleryView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/ProductosGalleryView.tsx).
  - Se modificó la celda "Precio Sug." en [ProductosGalleryView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/ProductosGalleryView.tsx) para incorporar un tooltip interactivo en hover que muestra el desglose: Costo Material, Costo Energía y Total Costo de Producción.

## [2026-06-20] - Desglose de Costo en Detalle de Piezas STL
### Descripción
- **Backend (Biblioteca de Piezas):**
  - Se modificó `PiezaSTLResponseDTO.java` para incluir los campos `costoMaterial` y `costoEnergia`.
  - Se actualizó `PiezaSTLService.java` para mapear los costos individuales resultantes de `CostCalculationService` (`costoFilamento` y `costoEnergia`) en el DTO de respuesta.
- **Frontend (Biblioteca de Piezas):**
  - Se actualizó la interfaz `PiezaSTL` en `biblioteca.types.ts` incorporando los campos opcionales `costoMaterial` y `costoEnergia`.
  - Se creó el componente interactivo `PiezaDetailModal.tsx` que ofrece una previsualización 3D y una sección visualmente atractiva con el desglose de costos de material, consumo de energía y costo total.
  - Se modificó `STLCard.tsx` para agregar la acción de ver detalle al hacer click en la tarjeta o a través del menú desplegable, y asegurar que la card principal sólo muestre el costo consolidado.
  - Se integró `PiezaDetailModal` en `PiezasGalleryView.tsx`.

## [2026-06-20] - Remediación UX/A11y en Biblioteca de Piezas, Catálogo de Stock y Libro Diario (T026)
### Descripción
- **Frontend (Biblioteca de Piezas):**
  - Se agregó `<label>` oculta para lectores de pantalla al input de búsqueda de piezas.
  - Se añadieron atributos `aria-label` y `aria-hidden` a los botones y elementos de acción de la tarjeta `STLCard.tsx` para mejorar la accesibilidad (A11y).
- **Frontend (Catálogo de Stock / Productos):**
  - Se ajustó el modal de composición de producto (`ComposicionProductoModal.tsx`) para incluir etiquetas `<label>` correctas, accesibilidad por teclado y validación preventiva del botón principal con tooltips informativos.
- **Frontend (Libro Diario / Finanzas):**
  - Se incorporó `QueryErrorView` en `FinanzasDashboard.tsx` para interceptar fallos en el cálculo de métricas financieras.
  - Se agregaron identificadores secundarios visuales (`#id`) al listado de movimientos de `LibroDiarioView.tsx` para diferenciar transacciones ocurridas en el mismo minuto/fecha.
  - Se añadieron etiquetas `<label>` e `id` a los elementos interactivos y controles del formulario de transacción `TransactionForm.tsx`, con validación de botón preventiva basada en estados y tooltips en hover.

## [2026-06-20] - Remediación UX/A11y en Detalle de Pedido y Agenda (T025)
### Descripción
- **Frontend (Detalle de Pedido):**
  - Se agregó navegación por migas de pan (Breadcrumb) en la vista `PedidoDetalleView.tsx`.
  - Se inyectó control de error de query mediante `QueryErrorView` para evitar spinners de carga infinitos en fallos de red.
  - Se actualizó el título principal a etiqueta `<h1>`.
  - Se agregaron atributos de accesibilidad `aria-hidden` y `aria-label` a los elementos interactivos e íconos.
- **Frontend (Agenda de Producción):**
  - Se corrigió la jerarquía de títulos de la sección a `<h1>`.
  - Se inyectó control de error y reintento en el fetching de órdenes mediante `QueryErrorView`.
  - Se agregó etiqueta `<label>` accesible al input de búsqueda y atributos `aria-label` descriptivos a los botones de acción rápida en las tarjetas de producción ("Iniciar", "Completar", "Recibir", "Cancelar").

## [2026-06-20] - Remediación UX/A11y en Clientes y Pedidos (T024)
### Descripción
- **Frontend (APIs):** Se actualizaron `clientes.api.ts` y `pedidos.api.ts` integrando `useMutationWithFeedback` para asegurar confirmación visual en mutaciones.
- **Frontend (Vistas Clientes y Pedidos):** Se implementaron vistas resilientes a errores mediante el uso del componente `QueryErrorView` al fallar el fetching de datos.
- **Frontend (Formularios e Interacción):**
  - Se añadieron placeholders descriptivos y activos en selectores (`Elegí un cliente *`, `Elegí un producto *`).
  - Se agregaron encabezados de columna (`Cant. | Precio Unit. | Subtotal`) en el modal `CrearPedidoModal.tsx`.
  - Se configuró el botón de basura para que se muestre en gris cuando la fila de ítems esté vacía y adquiera el color danger sólo al contener datos de productos.
  - Se incorporaron tooltips de validación preventiva en el botón de confirmación de pedido.
  - Se agregaron marcas de tiempo (hora exacta) en el formateador de fechas de la lista de pedidos.
- **Frontend (A11y):** Etiquetas `<label>` añadidas con atributos `sr-only` en los inputs de búsqueda de Clientes y Pedidos. Headings principales elevados a jerarquía `<h1>`.

## [2026-06-20] - Remediación UX/A11y en Calculadora y Perfiles (T023)
### Descripción
- **Frontend (Calculadora):** Se eliminó el uso de `alert()` nativo en `CalculadoraView.tsx`, reemplazándolo por toasts interactivos y accesibles de `sonner` para éxitos y errores de guardado de piezas y análisis de archivos.
- **Frontend (Perfiles):** Se integró `useMutationWithFeedback` en todos los hooks CRUD de perfiles (`perfiles.api.ts`) para proveer toasts visuales automáticos. Se implementó el componente `QueryErrorView` en la pestaña de visualización para capturar y reintentar fallos en el fetching de perfiles.
- **Frontend (Accesibilidad):** Se agregaron los atributos `aria-hidden="true"` a los íconos de Lucide decorativos y `aria-label` a los botones interactivos sin texto visible en `ConfigTable` y tabuladores de perfiles.

## [2026-06-20] - Infraestructura de Feedback y Resiliencia UX (T022)
### Descripción
- **Frontend (Notificaciones y Errores):** Se instaló e integró la biblioteca `sonner` para la visualización de toasts accesibles y con colores enriquecidos en `App.tsx`.
- **Frontend (Utilidades):** Se creó el hook personalizado `useMutationWithFeedback` para automatizar la visualización de notificaciones flotantes ante éxitos y errores de mutaciones en React Query.
- **Frontend (Componentes de Error):** Se creó el componente `QueryErrorView` para proveer una UI consistente ante fallos de carga en queries de React Query, incluyendo botón de reintento.

## [2026-06-20] - Captura de Miniatura STL en Posición Inicial (T021)
### Descripción
- **Frontend (Miniatura STL):** Se modificó la renderización 3D para capturar automáticamente la imagen de la pieza en su ángulo/posición inicial (cámara ajustada al cargar) antes de iniciar la rotación o cualquier interacción del usuario. Esta imagen se almacena y se usa al presionar "Guardar en biblioteca", evitando saltos o discrepancias visuales de la miniatura frente al render 3D al interactuar con el badge "Ver 3D".

### Archivos Involucrados
- [frontend/src/components/ui/stl-model-viewer.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/components/ui/stl-model-viewer.tsx)
- [frontend/src/features/calculo/components/STLViewer.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/calculo/components/STLViewer.tsx)
- [frontend/src/features/calculo/components/STLUpload.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/calculo/components/STLUpload.tsx)
- [frontend/src/features/calculo/components/CalculadoraView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/calculo/components/CalculadoraView.tsx)
- [CHANGELOG.md](file:///C:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-20] - Integración STL a Producto y Precios Variables (T018, T019, T020)
### Descripción
- **Backend (Pedidos y Precios):** Se implementó el soporte para precios unitarios personalizados en los ítems de pedidos (`precioPersonalizado`). Se actualizó la entidad `ItemPedido`, la lógica de negocio en `PedidoService` y los DTOs de request/response para priorizar el precio unitario personalizado en el cálculo del subtotal y del total.
- **Frontend (Pedidos):** Se agregaron campos editables para el precio unitario en el modal de creación de pedidos (`CrearPedidoModal.tsx`), recalculando los subtotales y el total en tiempo real.
- **Frontend (Biblioteca STL):** Se integró un acceso directo de "Fabricar" en la tarjeta de piezas STL (`STLCard.tsx`) que abre el modal de composición de producto (`ComposicionProductoModal.tsx`) con la pieza preseleccionada y el nombre auto-completado. Se removió el botón "Play" (Calcular Costo) de la tarjeta STL al estar obsoleta la navegación indirecta.

### Archivos Involucrados
- [backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoRequestDTO.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoRequestDTO.java)
- [backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java)
- [backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedido.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedido.java)
- [backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java)
- [frontend/src/features/pedidos/types/pedidos.types.ts](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/types/pedidos.types.ts)
- [frontend/src/features/pedidos/components/CrearPedidoModal.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/CrearPedidoModal.tsx)
- [frontend/src/features/stock/components/ComposicionProductoModal.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/stock/components/ComposicionProductoModal.tsx)
- [frontend/src/features/biblioteca/components/STLCard.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/STLCard.tsx)
- [frontend/src/features/biblioteca/components/PiezasGalleryView.tsx](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/PiezasGalleryView.tsx)
- [CHANGELOG.md](file:///C:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-20] - Pruebas de Integración de Dominio Financiero en Producción (T017)
### Descripción
- **Backend (Pruebas):** Se creó la clase de prueba de integración `OrdenProduccionServiceIntegrationTest.java` para verificar de forma integral el comportamiento contable y financiero cuando una orden de producción se finaliza.
  - Para producción interna, se verifica la deducción estimada de insumos (Material) y de electricidad (Energía) basándose en las especificaciones físicas de la pieza STL (peso, tiempo) y perfiles preferidos de impresora y filamento.
  - Para producción externa (outsourcing), se valida el registro de egreso consolidado contra el total cobrado por el proveedor externo.
  - Se configuró la clase utilizando `@ActiveProfiles("test")` para asegurar que las pruebas corran de forma aislada sobre la base de datos de prueba SQLite sin contaminar la base de datos de desarrollo del proyecto.

### Archivos Involucrados
- `backend/src/test/java/com/printrm/studio/domain/produccion/OrdenProduccionServiceIntegrationTest.java` (creado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Simplificación y Unificación de DTOs de Clientes (T016)
### Descripción
- **Backend (Clientes):** Se unificaron `ClienteRequestDTO` y `ClienteResponseDTO` en una única clase `ClienteDTO` con el campo `id` opcional/anulable, reduciendo el código redundante del backend.
- **Configuración de Agentes (Reglas):** Se creó el archivo de reglas de codificación del proyecto `.agents/AGENTS.md` y se actualizó la constitución de diseño en `.specify/memory/constitution.md` para plasmar la regla canónica de "DTOs Unificados" en el backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/clientes/ClienteRequestDTO.java` (eliminado)
- `backend/src/main/java/com/printrm/studio/domain/clientes/ClienteResponseDTO.java` (eliminado)
- `backend/src/main/java/com/printrm/studio/domain/clientes/ClienteDTO.java` (creado)
- `backend/src/main/java/com/printrm/studio/domain/clientes/ClienteController.java` (modificado)
- `backend/src/main/java/com/printrm/studio/domain/clientes/ClienteService.java` (modificado)
- `.agents/AGENTS.md` (creado)
- `.specify/memory/constitution.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Eliminación del Historial de Cálculos (T015)
### Descripción
- **Frontend & Backend (Cálculos):** Se eliminó por completo el "Historial de Cálculos" de la aplicación.
  - En el frontend, se removieron la pestaña "Historial" del sidebar, la vista de historial (`HistorialView.tsx`), la tabla (`HistorialTable.tsx`), y las consultas a la API de historial.
  - En el backend, se eliminaron los endpoints de persistencia de cálculos (`GET /api/v1/calculos`, `POST /api/v1/calculos`, `DELETE /api/v1/calculos`), conservando únicamente el endpoint `/api/v1/calculos/calculate` utilizado bajo demanda por el Cotizador.
  - Se eliminaron las clases `Calculo.java`, `CalculoRepository.java`, y `CalculoService.java`.
  - Se actualizaron las pruebas de integración de Pedidos para interactuar directamente con Productos del catálogo en lugar de snapshots de cálculos.

### Archivos Involucrados
- `frontend/src/App.tsx` (modificado)
- `frontend/src/components/layout/sidebar.tsx` (modificado)
- `frontend/src/features/calculo/components/HistorialTable.tsx` (eliminado)
- `frontend/src/features/calculo/components/HistorialView.tsx` (eliminado)
- `frontend/src/features/calculo/api/historial.api.ts` (eliminado)
- `backend/src/main/java/com/printrm/studio/domain/calculo/Calculo.java` (eliminado)
- `backend/src/main/java/com/printrm/studio/domain/calculo/CalculoRepository.java` (eliminado)
- `backend/src/main/java/com/printrm/studio/domain/calculo/CalculoService.java` (eliminado)
- `backend/src/main/java/com/printrm/studio/domain/calculo/CalculoController.java` (modificado)
- `backend/src/test/java/com/printrm/studio/domain/pedidos/DevolucionIntegrationTest.java` (modificado)
- `backend/src/test/java/com/printrm/studio/domain/pedidos/IdempotenciaFinancieraTest.java` (modificado)
- `backend/src/test/java/com/printrm/studio/domain/pedidos/PedidoIntegrationTest.java` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Unificación de Ítems de Pedidos a Productos del Catálogo (T014)
### Descripción
- **Frontend (Pedidos):** Se simplificó la lógica del modal `CrearPedidoModal.tsx` y la vista `PedidoDetalleView.tsx` eliminando la opción y distinción de "Cotización" (Cálculo). Ahora todos los pedidos asocian sus ítems exclusivamente a productos del catálogo, reduciendo el ruido visual en la interfaz y alineándose con el flujo simplificado de intención de compra y facturación del backend.

### Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
- `frontend/src/features/pedidos/components/PedidoDetalleView.tsx`
- `CHANGELOG.md`

## [2026-06-19] - Actualización de Skill revisar_tareas y Archivado de Especificación FIFO (006)
### Descripción
- **Customizations (Skills):** Se actualizó la skill `revisar_tareas` (`.agents/skills/revisar_tareas/SKILL.md`) para incorporar la instrucción de archivar automáticamente carpetas de especificaciones (`tasks.md`) cuyos checklists estén al 100% completados.
- **Estructura del Proyecto (.specify):** Se archivó la especificación del sistema de lotes de inventario FIFO (`006-fifo-inventory`) moviéndola de `.specify/specs/` a `.specify/history/sprint-2/006-fifo-inventory/` dado que todas sus tareas asociadas estaban completadas.

### Archivos Involucrados
- `.agents/skills/revisar_tareas/SKILL.md` (modificado)
- `.specify/specs/006-fifo-inventory/` (movido a `.specify/history/sprint-2/`)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Actualización de Reglas del Orquestador de SpecKit en GEMINI.md
### Descripción
- **Configuración de Agente (SpecKit):** Se actualizó el archivo `GEMINI.md` en la raíz del proyecto agregando una sección explícita de "Reglas de Orquestación".
- Esto le permite al agente orquestador (Antigravity) reconocer automáticamente su rol, aplicar las `dispatch-rules.md` para separar selectivamente el contexto de frontend (`constitution-frontend.md`) y backend (`constitution-backend.md`), y seguir el flujo de orquestación definido en `orchestration-workflow.md` sin requerir recordatorios manuales por parte del usuario.

### Archivos Involucrados
- `GEMINI.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Botones de Transición de Estado de Órdenes en la Agenda (T013)
### Descripción
- **Frontend (Producción):** Se agregaron botones de acción dinámicos en las tarjetas de las órdenes de producción dentro de la Agenda para avanzar el estado:
  - "Iniciar": Transiciona la orden de `COLA` a `IMPRIMIENDO` (internas) o `ENVIADO_PROVEEDOR` (externas).
  - "Completar" / "Recibir": Transiciona la orden a `COMPLETADO` (internas) o `RECIBIDO_PROVEEDOR` (externas).
  - "Cancelar": Cancela la orden de producción activa (`CANCELADO`), quitándola del flujo de producción.
- Se vinculó cada transición con el hook de mutación `useUpdateEstadoOrden` de React Query, invalidando las queries del catálogo de stock, pedidos y balance financiero de forma automática para asegurar que la vista refleje los cambios en tiempo real.

### Archivos Involucrados
- `frontend/src/features/produccion/components/AgendaProduccionView.tsx` (modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Modal para Crear Órdenes de Stock Independientes (T012)
### Descripción
- **Frontend (Producción):** Se implementó `CrearOrdenIndependienteModal.tsx` para la creación de órdenes de producción desvinculadas de pedidos (para stock general de reposición propia).
- El formulario permite al usuario seleccionar el producto del catálogo (consumiendo la API `/api/v1/productos` vía `useGetProductos`), elegir la cantidad, y definir si la producción es interna o externa (con proveedor y costo estimado).
- Se vinculó el modal con el botón "+ Nueva Orden de Stock" en la cabecera de la Agenda de Producción.

### Archivos Involucrados
- `frontend/src/features/produccion/components/CrearOrdenIndependienteModal.tsx` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Vista de Agenda de Producción (T011)
### Descripción
- **Frontend (Producción):** Se implementó la pantalla de visualización "Agenda de Producción" (`AgendaProduccionView.tsx`), que organiza las órdenes de producción en columnas tipo Kanban según su estado actual: "En Cola", "En Proceso" y "Completadas".
- Se agregaron filtros rápidos por tipo de orden (Todas / Para Cliente / Stock de Reposición) y un buscador de texto interactivo por producto, cliente o proveedor.
- Se integró la nueva vista en la barra de navegación lateral (`sidebar.tsx`) con un nuevo ícono de herramienta/martillo (`Hammer`) y en el enrutamiento central de la aplicación (`App.tsx`).

### Archivos Involucrados
- `frontend/src/features/produccion/components/AgendaProduccionView.tsx` (creado)
- `frontend/src/components/layout/sidebar.tsx` (modificado)
- `frontend/src/App.tsx` (modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Modal de Orden de Producción Vinculada (T010)
### Descripción
- **Frontend (Pedidos/Producción):** Se implementó `CrearOrdenVinculadaModal.tsx` para permitir mandar a fabricar las piezas faltantes de un pedido de manera directa desde la pantalla del detalle del mismo.
- Se agregó soporte para seleccionar el tipo de orden (interna o externa) y la cantidad a fabricar (por defecto, el faltante neto del ítem).
- Se habilitaron campos adicionales de proveedor y costo estimado para las órdenes de producción de tipo externo.
- Se integró el modal con el botón "Mandar a Fabricar" en `PedidoDetalleView.tsx` y se conectó con el servicio API correspondiente.

### Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearOrdenVinculadaModal.tsx` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Visualizar Stock, Producción y Faltantes en el Detalle del Pedido (T009)
### Descripción
- **Frontend (Pedidos):** Se modificó `PedidoDetalleView.tsx` y `pedidos.types.ts` para mostrar dinámicamente el stock real disponible, la cantidad en producción, y el faltante neto de cada ítem del pedido.
- Se agregó visualización del historial de órdenes de producción vinculadas a cada ítem (traza de fabricación) con sus respectivos estados actualizados.
- Se agregaron los nuevos estados `CONFIRMADO` y `LISTO_PARA_ENTREGAR` a la barra de acciones de estado del pedido y a `EstadoBadge.tsx`.

### Archivos Involucrados
- `frontend/src/features/pedidos/types/pedidos.types.ts` (modificado)
- `frontend/src/features/pedidos/components/EstadoBadge.tsx` (modificado)
- `frontend/src/features/pedidos/components/PedidoDetalleView.tsx` (modificado)
- `frontend/src/features/produccion/types/produccion.types.ts` (creado)
- `frontend/src/features/produccion/api/produccion.api.ts` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Endpoints REST en OrdenProduccionController (T008)
### Descripción
- **Backend (Producción):** Se creó e implementó `OrdenProduccionController.java` exponiendo la API REST bajo el path `/api/v1/produccion/ordenes`.
- Se crearon DTOs `OrdenProduccionRequestDTO.java` y `OrdenProduccionResponseDTO.java` para aislar las capas y prevenir problemas de Lazy Loading en el mapeo de relaciones JPA.
- Endpoints soportados: listado completo (`GET`), detalle individual (`GET`), creación vinculada a pedido (`POST /vinculada`), creación para stock propio (`POST /independiente`), y cambio de estado transaccional con impacto en inventario y finanzas (`PATCH /{id}/estado`).
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionRequestDTO.java` (creado)
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionResponseDTO.java` (creado)
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionController.java` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Integración de Venta y Validación de Stock en Entrega de Pedido (T007)
### Descripción
- **Backend (Pedidos):** Se modificó la lógica en `PedidoService.java` para que al pasar un pedido a estado `ENTREGADO` se ejecuten los siguientes controles y delegaciones:
  1. **Validación de Stock Real:** Verifica en el inventario físico que haya stock suficiente para cada producto antes de entregar el pedido. Si falta stock, arroja una excepción detallada.
  2. **Descuento de Stock Centralizado:** Delega el consumo de stock FIFO en `ventaService.registrarConsumoStock` por cada ítem.
  3. **Cobro de Saldo Restante:** Liquida y registra contablemente en el libro diario el ingreso del saldo remanente pendiente de cobro.
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java` (modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Alta de Stock y Egresos Contables al Finalizar Producción (T006)
### Descripción
- **Backend (Producción):** Se implementó el método `procesarFinalizacionOrden` en `OrdenProduccionService.java` que gestiona de manera automatizada:
  1. **Alta de Stock:** Da de alta el stock físico al completarse/recibirse la orden (FIFO). Para órdenes externas, define el costo unitario basándose en el costo cobrado por el proveedor.
  2. **Registro Contable de Egresos:** Si la orden está vinculada a un pedido, registra en finanzas el egreso correspondiente. Si es externa, registra el costo real de tercerización. Si es interna, calcula y registra el desgaste teórico estimado de filamento y energía basándose en el cálculo del producto o de la cotización original.
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionService.java` (modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Servicio de Producción OrdenProduccionService (T005)
### Descripción
- **Backend (Producción):** Se creó e implementó `OrdenProduccionService.java` que permite el alta de órdenes de producción vinculadas a ítems de pedidos y la creación de órdenes de producción independientes para stock propio de reposición.
- Se flexibilizó la columna `producto_id` de la entidad `OrdenProduccion.java` haciéndola nullable para permitir piezas a medida cotizadas vía cálculos.
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccion.java` (modificado)
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionService.java` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Servicio de Venta Centralizado VentaService (T004)
### Descripción
- **Backend (Ventas/Finanzas):** Se creó la clase `VentaService.java` en `com.printrm.studio.domain.pedidos`. Centraliza la lógica de registrar una venta procesando en un único flujo atómico:
  1. El consumo de stock físico del inventario mediante la lógica FIFO de `ProductoService.updateStock`.
  2. El registro contable de la transacción de ingresos (tipo `INGRESO`, categoría `VENTA`) en el libro diario a través de `TransaccionRepository`.
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/VentaService.java` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Cálculo Dinámico de Faltantes y Mapeo en PedidoResponseDTO (T003)
### Descripción
- **Backend (Pedidos):** Se modificó `ItemPedidoResponseDTO.java` para incluir la cantidad disponible en stock (`stockDisponible`), la cantidad faltante (`cantidadFaltante`) y las órdenes de producción asociadas (`ordenesProduccion`).
- Se actualizó el mapeador `mapToDTO` en `PedidoService.java` para inyectar `OrdenProduccionRepository` y calcular dinámicamente estos campos en tiempo de ejecución para cada ítem, resolviendo de forma segura la volatilidad del inventario físico.
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java` (modificado)
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java` (modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Estados de Pedido LISTO_PARA_ENTREGAR y CONFIRMADO (T002)
### Descripción
- **Backend (Pedidos):** Se agregaron los estados `CONFIRMADO` y `LISTO_PARA_ENTREGAR` al enumerado `EstadoPedido` en la entidad `Pedido.java` para dar soporte al nuevo ciclo de vida de los pedidos que requieren fabricación de faltantes.
- Se validó la compilación del backend.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/pedidos/Pedido.java` (modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Entidad OrdenProduccion y Repositorio (T001)
### Descripción
- **Backend (Producción):** Se implementó la entidad JPA `OrdenProduccion.java` con soporte para vinculación opcional (`nullable`) a un `ItemPedido` (permitiendo órdenes tanto para clientes como para stock propio de reposición).
- Se creó la interfaz de repositorio `OrdenProduccionRepository.java` con métodos de consulta por estado, por ítem de pedido y por producto.
- Se validó la compilación exitosa del backend con las nuevas clases.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccion.java` (creado)
- `backend/src/main/java/com/printrm/studio/domain/produccion/OrdenProduccionRepository.java` (creado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-19] - Diseño de Especificación para Flujo Dinámico de Pedidos, Stock y Fabricación
### Descripción
- **Diseño del Sistema (SpecKit):** Se definió el diseño modular unificado en `.specify/specs/007-flujo-pedidos-fabricacion/spec.md`, el plan técnico `.specify/specs/007-flujo-pedidos-fabricacion/plan.md` y las tareas de implementación `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md`.
- **Dinamicidad en Tiempo de Ejecución:** Para evitar inconsistencias por la volatilidad del inventario físico, se eliminó la persistencia de stock asignado en la entidad `ItemPedido`. Los faltantes de stock se calculan dinámicamente en tiempo de ejecución al consultar el pedido.
- Al detectar un faltante dinámico, el sistema permite generar una `OrdenProduccion` asociada de forma sencilla. Al completarse la orden, ingresa stock al producto de forma normal (FIFO) y el faltante dinámico se reduce en la próxima consulta. El stock real se consume de forma definitiva solo en el momento de la entrega del pedido.
- **Órdenes de Reposición (Para Stock):** Se agregó soporte en el diseño para órdenes de producción independientes (sin vinculación a un pedido de cliente) para permitir fabricar piezas directamente para stock.
- **Transacción Contable al Entregar:** Se asoció de forma explícita la entrega de pedido con el registro de la venta en finanzas. Al pasar a `ENTREGADO`, se liquida y registra el cobro del saldo pendiente como una transacción de ingreso vinculada al pedido.
- **Servicio de Venta Centralizado:** Se introdujo la definición detallada de `VentaService.java` en el plan, especificando su firma en Java y lógica transaccional para descontar stock (FIFO) y registrar el ingreso contable simultáneamente. La entrega de pedidos delega directamente en este servicio.
- **Egresos por Producción:** Al completarse la producción, se registran egresos contables (de materiales/energía si es interna, o del costo cobrado por el proveedor de outsourcing si es externa/tercerizada), asegurando que la rentabilidad del pedido en el libro diario sea matemáticamente exacta.

### Archivos Involucrados
- `.specify/specs/007-flujo-pedidos-fabricacion/spec.md` (creado/modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/plan.md` (creado/modificado)
- `.specify/specs/007-flujo-pedidos-fabricacion/tasks.md` (creado/modificado)
- `.specify/current_task_summary.md` (modificado)
- `CHANGELOG.md` (modificado)

## [2026-06-18] - Remover Vista de Resumen (Overview) del Frontend
### Descripción
- **Frontend (UI):** Se eliminó la sección de "Resumen" (`overview`) del panel de navegación lateral y de la lógica de renderizado principal en `App.tsx`.
- Se eliminó el componente no utilizado `studio-overview.tsx` del proyecto para limpiar la base de código.

### Archivos Involucrados
- `frontend/src/components/layout/sidebar.tsx` (modificado)
- `frontend/src/App.tsx` (modificado)
- `frontend/src/components/studio-overview.tsx` (eliminado)
- `CHANGELOG.md` (modificado)
- `.specify/current_task_summary.md` (modificado)

## [2026-06-18] - Bugfix SQLite CHECK constraint en transacciones (T019)
### Descripción
- **Backend (Base de Datos):** Se realizó la migración del esquema en la base de datos `studio.db` de desarrollo para actualizar el constraint `CHECK` de la columna `categoria` en la tabla `transacciones`. Ahora admite la categoría `'REPUESTO'`, además de las ya existentes (`'MATERIAL'`, `'ENERGIA'`, `'VENTA'`, `'MERMA'`, `'OTRO'`).
- La migración se realizó conservando todos los datos existentes mediante una estrategia limpia (renombrar tabla a temporal, crear nueva tabla con constraint actualizado, copiar los datos de vuelta y eliminar la tabla temporal).
- Se validó el correcto funcionamiento de la migración confirmando inserciones con la nueva categoría.

### Archivos Involucrados
- `backend/studio.db` (modificado)
- `CHANGELOG.md` (modificado)
- `.specify/specs/005-roadmap-phase-2/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)

## [2026-06-18] - Logs de Spring Boot Human-Friendly (T018)
### Descripción
- **Backend (Logging):** Se reconfiguró `application.properties` para definir un formato de consola altamente legible (`logging.pattern.console`), que simplifica el timestamp (`HH:mm:ss.SSS`), colorea dinámicamente los niveles y nombres de logger, y limita las trazas de excepciones Java a un máximo de 5 líneas (`%wEx{5}`) para facilitar la identificación de errores de negocio.
- Se silenciaron los logs de depuración SQL y de binding de Hibernate.
- Se elevaron los niveles mínimos de log de frameworks como Spring Web, Hibernate, Tomcat y SQLite a `WARN` para evitar saturar la consola con trazas del ciclo de vida interno.

### Archivos Involucrados
- `backend/src/main/resources/application.properties` (modificado)
- `.specify/specs/005-roadmap-phase-2/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)

## [2026-06-18] - Dashboard Financiero y Transacciones Manuales (T014)
### Descripción
- **Backend (Finanzas):** Se añadió el endpoint `POST` en `TransaccionController` y el método `create` en `TransaccionService` para permitir el guardado persistente en SQLite de ingresos y egresos registrados manualmente.
- **Frontend (Finanzas):**
  - Se implementó la mutación `useCreateTransaccion` en `finanzas.api.ts` usando TanStack Query para invalidar y refrescar automáticamente el balance y las transacciones al crear una nueva.
  - Se implementó el componente `TransactionForm.tsx` (modal) para registrar transacciones con validación de montos positivos y mapeo automático del signo del monto en base al tipo (egresos negativos, ingresos positivos).
  - Se implementó `FinanzasDashboard.tsx` con soporte para métricas clave (Balance Neto, Ingresos Netos, Gastos Totales y ROI), gráficos mensuales de tendencia y un gráfico de barras para la distribución de gastos por categoría (Materiales, Energía, Repuestos, Mermas y Otros) con compensación matemática de ajustes de merma.
  - Se actualizó `LibroDiarioView.tsx` para incluir navegación por pestañas (Dashboard y Libro Diario) e integrar los nuevos componentes.
  - Se marcó la tarea `T014` como completada en `tasks.md`.

### Archivos Involucrados
- `backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionController.java` (modificado)
- `backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionService.java` (modificado)
- `frontend/src/features/finanzas/api/finanzas.api.ts` (modificado)
- `frontend/src/features/finanzas/components/FinanzasDashboard.tsx` (creado)
- `frontend/src/features/finanzas/components/LibroDiarioView.tsx` (modificado)
- `frontend/src/features/finanzas/components/TransactionForm.tsx` (creado)
- `.specify/specs/005-roadmap-phase-2/tasks.md` (modificado)
- `.specify/current_task_summary.md` (modificado)

## [2026-06-18] - Skill de Revisión Automática de Tareas
### Descripción
- Se creó una skill personalizada (`revisar_tareas`) para automatizar el análisis y la presentación de listas de tareas pendientes basadas en los checklists del directorio `.specify/`.

### Archivos Involucrados
- `.agents/skills/revisar_tareas/SKILL.md` (creado)
- `.specify/current_task_summary.md` (modificado)

## [2026-06-18] - Exportación Simplificada y Compartición (003-historial-exportacion)
### Descripción
- Se implementaron las utilidades de exportación y compartición solicitadas en el módulo de historial.
- **Utilidades de Exportación (`export.utils.ts`):**
    - Generación de resumen de presupuesto en texto plano con separadores visuales.
    - Función de copiado al portapapeles con soporte para contextos seguros e inseguros (fallback).
    - Integración con la API de WhatsApp para envío directo de presupuestos.
    - Generación de archivos CSV con metadatos completos y codificación UTF-8 BOM para compatibilidad con Excel.
- **Integración UI:**
    - Se agregaron botones de "Copiar", "WhatsApp" y "CSV" en el componente `ResultadosBreakdown`.
    - Se implementó feedback visual transitorio ("¡Copiado!") tras la acción de portapapeles.
    - Se inyectaron dinámicamente el `perfilNombre` y el `multiplicador` desde el estado global al panel de resultados para asegurar exportaciones precisas.
- Se actualizó el archivo de tareas de la especificación `003-historial-exportacion` marcando los hitos de backend (ya existentes) y los nuevos hitos de frontend como completados.

### Archivos Involucrados
- `frontend/src/features/calculo/utils/export.utils.ts` (creado)
- `frontend/src/features/calculo/components/ResultadosBreakdown.tsx` (modificado)
- `frontend/src/features/calculo/components/ResultadoPanel.tsx` (modificado)
- `.specify/specs/003-historial-exportacion/tasks.md` (modificado)

## [2026-06-18] - Reparación del entorno de desarrollo
### Descripción
- Se instalaron las dependencias del frontend que estaban ausentes, permitiendo la ejecución de Vite.
- Se restauró el archivo `gradle-wrapper.jar` en el backend, el cual era necesario para ejecutar el wrapper de Gradle y estaba ausente.
- Se verificó la ejecución exitosa de ambos servicios (frontend y backend) mediante el comando `npm run dev:web`.

### Archivos Involucrados
- `frontend/node_modules/` (creado/poblado)
- `backend/gradle/wrapper/gradle-wrapper.jar` (restaurado)
- `.specify/current_task_summary.md` (actualizado)

## [2026-06-16] - Reestructuración y Profundización del Conocimiento en mis-specs/
### Descripción
- Se reestructuró de forma modular la base de conocimiento local en el directorio `mis-specs/` para evitar la mezcla de contextos y la superficialidad de la información.
- Se crearon documentos maestros hiper-detallados con datos técnicos reales extraídos del código:
  - `DISEÑO.md`: Detalla la Constitución de diseño visual, paleta cromática, escala tipográfica de Inter y JetBrains Mono, límites de sombras y feedback interactivo.
  - `NEGOCIO_FINANZAS.md`: Detalla el funcionamiento de la lógica de inventario FIFO por lotes (fusión de lotes, cálculo de costos dinámicos, consumo secuencial), el ciclo de vida de los pedidos con triggers de balance y el blindaje en reembolsos de pagos parciales/señas.
  - `ARQUITECTURA_TECNOLOGICA.md`: Detalla el stack tecnológico backend/frontend/desktop, base de datos local SQLite con Hibernate y el pipeline de empaquetado portátil para Windows.
  - `FLUJOS_OPERATIVOS.md`: Detalla el pipeline de slicing 3D mediante invocación local de PrusaSlicer CLI, parseo del G-Code y pipeline de renderizado 3D mediante WebGL.
  - `MODELO_DATOS.md`: Mapea exhaustivamente la relación entre todas las entidades del sistema (JPA/SQLite), detallando multiplicidades, llaves foráneas y el tipo de acoplamiento. Incluye un diagrama lógico en formato Mermaid y el esquema relacional detallado de todos los campos en notación estándar `Tabla(campo1 [PK], campo2 [FK], ...)`.
  - `SUITE_TESTS.md`: Detalla los comandos de ejecución rápida para la suite de pruebas del backend (JUnit 5 / Spring Boot) y frontend (Vitest), listando exhaustivamente las lógicas de negocio testeadas (inventario FIFO, blindaje financiero, mermas contables) y la descripción del flujo integrador de punta a punta con su diagrama secuencial Mermaid.
- Se actualizó `CONOCIMIENTO.md` como el índice modular de orquestación de estos submódulos.

### Archivos Involucrados
- [mis-specs/CONOCIMIENTO.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/CONOCIMIENTO.md)
- [mis-specs/DISEÑO.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/DISE%C3%91O.md)
- [mis-specs/NEGOCIO_FINANZAS.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/NEGOCIO_FINANZAS.md)
- [mis-specs/ARQUITECTURA_TECNOLOGICA.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/ARQUITECTURA_TECNOLOGICA.md)
- [mis-specs/FLUJOS_OPERATIVOS.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/FLUJOS_OPERATIVOS.md)
- [mis-specs/MODELO_DATOS.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/MODELO_DATOS.md)
- [mis-specs/SUITE_TESTS.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/mis-specs/SUITE_TESTS.md)
- [.specify/current_task_summary.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/current_task_summary.md)
- [CHANGELOG.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-16] - Definición de Tareas: Sistema de Lote FIFO
### Descripción
- Se definieron y documentaron las tareas de implementación para el Sistema de Lotes de Inventario FIFO, el cual ya se encuentra implementado en el código base.
- Se crearon los archivos de diseño (`plan.md`, `spec.md`) y el listado de tareas (`tasks.md`) dentro de `.specify/specs/006-fifo-inventory/` para mantener la trazabilidad del desarrollo.
- Se marcaron todas las tareas como completadas para reflejar el estado actual del proyecto.

### Archivos Involucrados
- [.specify/specs/006-fifo-inventory/plan.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/006-fifo-inventory/plan.md)
- [.specify/specs/006-fifo-inventory/spec.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/006-fifo-inventory/spec.md)
- [.specify/specs/006-fifo-inventory/tasks.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/006-fifo-inventory/tasks.md)
- [.specify/current_task_summary.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/current_task_summary.md)
- [CHANGELOG.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-16] - Documentación del Gap 2: Pagos Parciales / Señales
### Descripción
- Se documentaron en la especificación del modelo de datos los campos `montoPagado` y `saldoPendiente` dentro de la entidad `Pedido`.
- Se actualizó el checklist de QA manual en el roadmap frontend para incluir el escenario de validación de devolución con seña (blindaje del reembolso).
- Se actualizó el estado de la tarea en `current_task_summary.md`.

### Archivos Involucrados
- [.specify/current_task_summary.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/current_task_summary.md)
- [.specify/specs/005-roadmap-phase-2/data-model.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/005-roadmap-phase-2/data-model.md)
- [.specify/specs/005-roadmap-phase-2/frontend-roadmap.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/005-roadmap-phase-2/frontend-roadmap.md)
- [CHANGELOG.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-16] - Gestión Comercial, Pedidos y Finanzas (Fase 2)
### Descripción
- Se implementaron los controladores y servicios financieros en el backend, incluyendo `TransaccionService` y `TransaccionController` para gestionar transacciones y cálculo de balance contable con consistencia de signos.
- Se extendió `PedidoController` agregando endpoints para registrar pagos parciales/señas y registrar mermas de producción sobre ítems cotizados.
- Se actualizó `ItemPedidoResponseDTO` y `PedidoService` para exponer e hidratar correctamente campos críticos (`cantidadMerma`, `calculoId`, `perfilNombre`) requeridos por el frontend.
- Se implementaron las vistas principales de gestión de pedidos en el frontend: `PedidosListView` y `PedidoDetalleView`.
- Se crearon modales interactivos en el frontend para el flujo comercial: `CrearPedidoModal` (selección de cliente e historial de cotizaciones), `RegistrarPagoModal` (pagos parciales/señas) y `RegistrarMermaModal` (impresiones fallidas por ítem).
- Se agregó navegación a la vista de Pedidos en `sidebar.tsx` y su mapeo en `App.tsx`.
- Se corrigieron advertencias y errores de compilación TypeScript en `ClienteForm.tsx` y `ClientesListView.tsx` (mismatch de tipo en `useForm` y propiedades inválidas en componentes comunes de modal).

### Archivos Involucrados
- [backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionService.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionService.java)
- [backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionController.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/finanzas/TransaccionController.java)
- [backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoController.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoController.java)
- [backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoResponseDTO.java)
- [backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java)
- [frontend/src/components/layout/sidebar.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/components/layout/sidebar.tsx)
- [frontend/src/App.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/App.tsx)
- [frontend/src/features/clientes/components/ClienteForm.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/clientes/components/ClienteForm.tsx)
- [frontend/src/features/clientes/components/ClientesListView.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/clientes/components/ClientesListView.tsx)
- [frontend/src/features/pedidos/components/CrearPedidoModal.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/CrearPedidoModal.tsx)
- [frontend/src/features/pedidos/components/EstadoBadge.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/EstadoBadge.tsx)
- [frontend/src/features/pedidos/components/PedidoDetalleView.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidoDetalleView.tsx)
- [frontend/src/features/pedidos/components/PedidosListView.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/PedidosListView.tsx)
- [frontend/src/features/pedidos/components/RegistrarMermaModal.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/RegistrarMermaModal.tsx)
- [frontend/src/features/pedidos/components/RegistrarPagoModal.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/RegistrarPagoModal.tsx)
- [CHANGELOG.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-16] - Almacenamiento Persistente y Visualización de Modelos STL Reales
### Descripción
- Se modificó `SlicerController` para deshabilitar la eliminación del archivo STL temporal posterior a la cotización, manteniéndolo en `temp-uploads/`.
- Se implementó la persistencia física en `PiezaSTLService` para mover archivos STL de `temp-uploads/` a la carpeta permanente `saved-uploads/` al guardar una pieza.
- Se implementó la resolución de colisiones en `PiezaSTLService` agregando una marca de tiempo única al nombre del archivo STL si ya existe un archivo con el mismo nombre en la carpeta destino.
- Se expuso un endpoint en `PiezaSTLController` (`GET /api/v1/biblioteca/files/{filename}`) para descargar/servir los archivos STL persistentes.
- Se actualizó el componente frontend `STLCard.tsx` para cargar dinámicamente el modelo STL desde el endpoint del backend utilizando el `filePath` real de la pieza en lugar de un cubo estático de pruebas.
- Se añadieron pruebas de integración completas en `PiezaSTLServiceIntegrationTest` para validar el proceso de copia de archivos y la lógica de resolución de colisiones.

### Archivos Involucrados
- [backend/src/main/java/com/printrm/studio/slicer/SlicerController.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/slicer/SlicerController.java)
- [backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLService.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLService.java)
- [backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLController.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLController.java)
- [backend/src/test/java/com/printrm/studio/domain/biblioteca/PiezaSTLServiceIntegrationTest.java](file:///c:/Users/franc/OneDrive/Desktop/printrm/backend/src/test/java/com/printrm/studio/domain/biblioteca/PiezaSTLServiceIntegrationTest.java)
- [frontend/src/features/biblioteca/components/STLCard.tsx](file:///c:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/STLCard.tsx)
- [CHANGELOG.md](file:///c:/Users/franc/OneDrive/Desktop/printrm/CHANGELOG.md)

## [2026-06-16] - Refactorización, Limpieza y Abstracción del Frontend
### Descripción
- Se eliminó código muerto correspondiente a la feature `exportacion` no integrada (clipboard, csv, whatsapp utils y tests).
- Se removieron 13 componentes de UI autogenerados sin uso en `frontend/src/components/ui/` para reducir ruido de compilación.
- Se creó un cliente Axios centralizado (`frontend/src/lib/api-client.ts`) migrando los hooks de llamadas API para evitar URLs hardcodeadas.
- Se unificó el formateador de monedas ARS en `frontend/src/lib/utils.ts`.
- Se implementó el componente común `<STLModelViewer />` para centralizar la renderización 3D (Three.js/R3F) de `STLPreview.tsx` y `STLViewer.tsx`.
- Se introdujeron React Refs en lugar de consultas directas al DOM con `querySelector('canvas')` para capturar imágenes base64 de manera segura en React.
- Se crearon hooks compartidos para el polling de estado del servidor (`useBackendHealthCheck`) y comportamiento modal (`useModalOverlay`).
- Se modularizó y simplificó `ResultadoPanel.tsx` separándolo en subcomponentes (`ResultadosBreakdown` y `AjustesGlobalesForm`), reduciendo su complejidad.
- Se modularizó la pestaña de ajustes generales del dashboard de perfiles en `AjustesSeccion.tsx`, disminuyendo el tamaño de `PerfilesDashboardView.tsx`.
- Se reemplazó el uso de diálogos `confirm()` nativos en la galería de piezas por el componente `ConfirmModal`.
- Se corrigieron codificaciones de caracteres rotas con acentos españoles en formularios de perfiles.
- Se aplanó la interfaz `CalculoSnapshot` del frontend para corresponder exactamente al modelo plano de base de datos del backend.
- Se creó `vite-env.d.ts` para resolver las definiciones de tipos globales de Vite.

### Archivos Involucrados
- `frontend/src/features/exportacion` (directorio completo)
- `frontend/src/components/ui/` (avatar, badge, button, card, dialog, input, label, progress, scroll-area, separator, skeleton, tabs)
- `frontend/src/features/biblioteca/hooks` (directorio vacío)
- `frontend/src/lib/api-client.ts`
- `frontend/src/hooks/useBackendHealthCheck.ts`
- `frontend/src/hooks/useModalOverlay.ts`
- `frontend/src/components/ui/theme-toggle.tsx`
- `frontend/src/components/ui/stl-model-viewer.tsx`
- `frontend/src/features/ajustes/components/AjustesFormFields.tsx`
- `frontend/src/features/ajustes/components/AjustesSeccion.tsx`
- `frontend/src/features/calculo/components/AjustesGlobalesForm.tsx`
- `frontend/src/features/calculo/components/ResultadosBreakdown.tsx`
- `frontend/src/vite-env.d.ts`
- `frontend/src/lib/utils.ts`
- `frontend/src/features/ajustes/types/ajustes.types.ts`
- `frontend/src/features/ajustes/api/ajustes.api.ts`
- `frontend/src/features/biblioteca/api/biblioteca.api.ts`
- `frontend/src/features/biblioteca/components/STLPreview.tsx`
- `frontend/src/features/biblioteca/components/PiezasGalleryView.tsx`
- `frontend/src/features/calculo/api/calculos.api.ts`
- `frontend/src/features/calculo/api/slicer.api.ts`
- `frontend/src/features/calculo/types/calculo.types.ts`
- `frontend/src/features/calculo/utils/calculos.utils.ts`
- `frontend/src/features/calculo/components/CalculadoraView.tsx`
- `frontend/src/features/calculo/components/STLUpload.tsx`
- `frontend/src/features/calculo/components/STLViewer.tsx`
- `frontend/src/features/calculo/components/ResultadoPanel.tsx`
- `frontend/src/features/perfiles/api/perfiles.api.ts`
- `frontend/src/features/perfiles/components/PerfilesDashboardView.tsx`
- `frontend/src/features/perfiles/components/PerfilForm.tsx`
- `frontend/src/features/perfiles/components/PrintProfileForm.tsx`
- `frontend/src/features/perfiles/components/FilamentProfileForm.tsx`
- `frontend/src/components/layout/sidebar.tsx`
- `frontend/src/components/layout/studio-sub-nav.tsx`
- `frontend/src/components/ui/modal.tsx`
- `frontend/src/components/ui/confirm-modal.tsx`
- `frontend/src/App.tsx`
- `CHANGELOG.md`

## [2026-06-16] - Refactorización de Perfil Activo y Limpieza de Campos
### Descripción
- Se eliminaron los campos de "Consumo Promedio", "Vida Útil", "Costo Repuestos" y "Costo Filamento" del formulario de Perfil de Impresora (Perfil Activo).
- Se ocultaron las columnas correspondientes en la tabla de gestión de impresoras.
- Se actualizó el motor de cálculo para usar valores predefinidos según el modelo de impresora como respaldo.

### Archivos Involucrados
- `frontend/src/features/perfiles/components/PerfilForm.tsx`
- `frontend/src/features/perfiles/components/PerfilesDashboardView.tsx`
- `frontend/src/features/calculo/hooks/useCalculo.ts`
- `CHANGELOG.md`

## [2026-06-16] - Corrección de NoClassDefFoundError y Actualización de Workflow
### Descripción
- Se eliminó la anotación `@Builder` de los DTOs de solicitud para evitar errores de carga de clases por parte de Jackson (Lombok runtime issues).
- Se actualizaron las reglas de flujo de trabajo en `GEMINI.md` para incluir Resúmenes de Tarea y Registro de Cambios obligatorio.
- Se creó una plantilla para resúmenes de tarea.

### Archivos Involucrados
- `GEMINI.md`
- `CHANGELOG.md`
- `backend/src/main/java/com/printrm/studio/domain/perfil/FilamentProfileRequestDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/perfil/PrintProfileRequestDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/perfil/PerfilRequestDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/calculo/CalculoRequestDTO.java`
- `.specify/templates/task-summary-template.md`
