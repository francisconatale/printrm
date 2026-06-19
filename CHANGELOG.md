# CHANGELOG

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
