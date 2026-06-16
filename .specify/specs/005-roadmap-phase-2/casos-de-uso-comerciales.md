# Casos de Uso: Gestión Comercial y Pedidos (printrm)

Estos casos de uso detallan la interacción entre el Cliente, el Cotizador y la persistencia de datos comerciales.

---

### CU-01: Cotización Multi-Pieza y Asociación a Cliente
**Escenario**: Un cliente solicita un presupuesto por varias piezas diferentes.
1. **Acción**: El usuario carga el `Pieza_A.stl`, el sistema calcula el costo base ($100).
2. **Acción**: El usuario asigna la pieza al "Cliente Juan" y define una **cantidad** (ej. 8 unidades).
3. **Resultado**: El sistema calcula el Total del Ítem ($800) y lo guarda en un "Borrador de Pedido" vinculado a Juan.
4. **Acción**: El usuario repite el proceso con `Pieza_B.stl` (ej. 2 unidades).
5. **Resultado**: El Pedido ahora refleja el total combinado de ambas piezas.

---

### CU-02: Ajuste de Cantidad y Bajas Parciales
**Escenario**: El cliente decide reducir la cantidad de un pedido ya cotizado.
1. **Precondición**: Existe un pedido de 8 unidades de `Pieza_A.stl`.
2. **Acción**: El usuario edita la cantidad del pedido del cliente de 8 a 4.
3. **Resultado**: El sistema recalcula inmediatamente el costo de material y energía proporcionalmente, actualizando el total del cliente sin necesidad de re-analizar el STL.
4. **Variante (Baja Total de Ítem)**: El cliente cancela una de las piezas del pedido. El usuario elimina el ítem y el pedido se actualiza manteniendo la integridad del historial.

---

### CU-03: Seguimiento de Estado del Pedido
**Escenario**: Gestión de la producción según la respuesta del cliente.
1. **Acción**: El usuario marca el pedido como "Enviado" (vía WhatsApp).
2. **Acción**: Si el cliente acepta, se marca como "En Producción".
3. **Acción**: Si el cliente se da de baja, se marca como "Cancelado".
4. **Resultado**: Los cálculos cancelados no suman a las métricas de ingresos pero permanecen en el historial del cliente para referencia futura (re-cotización).

---

### CU-04: Persistencia de Preferencias por Cliente
**Escenario**: Un cliente siempre pide un material específico.
1. **Acción**: Al crear al cliente, se le asigna un "Perfil de Filamento Preferido" (ej. PLA Premium).
2. **Resultado**: Al iniciar una cotización para ese cliente, el sistema selecciona automáticamente ese perfil, minimizando errores manuales.

---

## Preguntas para Supervisión:
1. **¿Múltiples STL por Pedido?**: Actualmente el sistema guarda un `Calculo` por archivo. ¿Prefieres que creemos una entidad `Pedido` que agrupe varios `Calculos` o seguimos vinculando `Calculos` individuales directamente al cliente con un campo de `cantidad`?
2. **¿Manejo de Bajas?**: ¿Cuando un cliente se da de baja de un pedido de 8 piezas, quieres que se borre el registro o que cambie a estado "Cancelado" para auditoría?
