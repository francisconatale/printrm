# Casos de Uso: Gestión Comercial y Pedidos (printrm)

Estos casos de uso detallan la interacción entre el Cliente, el Sistema de Pedidos y el Cotizador.

---

### CU-01: Creación de Pedido Multi-Pieza
**Escenario**: Un cliente solicita un presupuesto integral por varios modelos.
1. **Acción**: El usuario crea un nuevo **Pedido** asociado a un Cliente.
2. **Acción**: El usuario carga `Pieza_A.stl` en el cotizador, el sistema calcula el costo unitario.
3. **Acción**: El usuario agrega el cálculo al pedido especificando una **cantidad** (ej. 8 unidades).
4. **Acción**: El usuario repite el proceso para `Pieza_B.stl` (ej. 2 unidades) dentro del mismo pedido.
5. **Resultado**: El sistema genera un presupuesto total sumando todos los ítems y sus respectivas cantidades.

---

### CU-02: Gestión de Cantidades y Bajas en Pedido
**Escenario**: El cliente solicita cambios en un pedido existente.
1. **Acción**: El usuario edita la cantidad de un ítem del pedido (ej. de 8 a 4 unidades).
2. **Resultado**: El sistema actualiza el total del pedido automáticamente.
3. **Acción**: Si el cliente decide no imprimir una de las piezas, el usuario marca ese ítem como "Cancelado" o lo elimina del pedido.
4. **Resultado**: El total del pedido se ajusta reflejando solo los ítems activos.

---

### CU-03: Ciclo de Vida del Pedido (Estados)
**Escenario**: El pedido transiciona por diferentes etapas operativas.
1. **Estados**: 
   - `BORRADOR`: Pedido en preparación, no enviado al cliente.
   - `COTIZADO`: Enviado al cliente (WhatsApp/PDF).
   - `EN_PRODUCCION`: Cliente aceptó y las máquinas están trabajando.
   - `ENTREGADO`: Trabajo finalizado y cobrado.
   - `CANCELADO`: El cliente se dio de baja.
2. **Acción**: El usuario cambia el estado del pedido completo.
3. **Resultado**: El historial del cliente refleja el estado para seguimiento comercial.

---

## Decisiones Técnicas Confirmadas:
1. **Entidad Pedido (Order)**: Actúa como contenedor principal.
2. **Entidad ItemPedido**: Vincula un `Calculo` con una `Cantidad` dentro de un `Pedido`.
3. **Persistencia de Bajas**: Se mantienen los registros en estado `CANCELADO` para análisis de ventas perdidas.
