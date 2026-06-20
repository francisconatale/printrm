# Estado de Tarea: Rediseño Elegante Estilo iPhone de PedidoDetalleView y Validación de Estado

## Objetivo
Reordenar y rediseñar los contenidos de `PedidoDetalleView.tsx` para seguir un estilo elegante inspirado en iOS/iPhone, optimizando la jerarquía visual, la legibilidad en pantallas táctiles y móviles, y la interacción premium. Asimismo, asegurar que en el backend no se puedan realizar entregas duplicadas sobre un pedido ya entregado.

## Tareas
- [x] Analizar la estructura actual de `PedidoDetalleView.tsx` y planificar el orden elegante estilo iPhone.
- [x] Agrupar la información del cliente y totales/saldo en tarjetas (cards) premium al estilo iOS (borde sutil, esquinas redondeadas tipo ardilla/superellipse, fondos translúcidos).
- [x] Ubicar el estado y las acciones rápidas (Gestión de Estados) de forma compacta y visualmente atractiva (tipo panel de control de iOS/Action Sheet o botones segmentados premium).
- [x] Mejorar la visualización de los ítems de presupuesto con un listado más limpio, destacando las cantidades, estado de fabricación y acciones contextuales.
- [x] Asegurar transiciones suaves, hover states estables y el cumplimiento de las directrices UI/UX.
- [x] Agregar validación en el backend (`PedidoService.java`) para que si un pedido ya está en estado `ENTREGADO`, cualquier intento de entregar más productos o cambiar a ese estado lance explícitamente una excepción aclarando que el pedido ya fue entregado.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/PedidoDetalleView.tsx`
- `backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java`
