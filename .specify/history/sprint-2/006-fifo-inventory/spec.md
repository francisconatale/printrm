# Spec: Sistema de Lotes de Inventario FIFO

## User Stories

### US1: Gestión de Lotes (Prioridad: P1)
Como administrador, quiero que el sistema guarde el costo unitario de cada entrada de stock en un lote separado para poder calcular el valor del inventario con precisión. **Optimización**: Si se agrega stock con el mismo costo que el último lote activo, las cantidades se fusionarán para optimizar el almacenamiento.

### US2: Consumo FIFO (Prioridad: P1)
Como administrador, quiero que al vender o usar un producto, el stock se descuente de los lotes más antiguos primero (FIFO - First In, First Out) para reflejar un flujo de inventario realista y márgenes precisos.

### US3: Visualización de Stock (Prioridad: P2)
Como administrador, quiero ver el stock total disponible en la interfaz de usuario, manteniendo la complejidad de los lotes en el backend.
