# Escenarios Financieros: Análisis de Balance y Rentabilidad

Este documento define cómo se comportan las transacciones en los escenarios críticos del negocio para asegurar que el **Balance Total** sea real.

---

### Escenario 1: Ciclo de Venta Exitosa (Ganancia)
**Objetivo**: Ver cuánto gané realmente después de fabricar y vender.
1. **Paso 1 (Fabricación)**: Se marca la pieza como "En Impresión".
    - **Transacción**: EGRESO (Material + Energía) -> **-$100**.
    - **Balance**: -$100.
2. **Paso 2 (Venta)**: El pedido se marca como "ENTREGADO" por un precio de $400.
    - **Transacción**: INGRESO (Venta) -> **+$400**.
    - **Balance Total**: +$300 (Rentabilidad neta).

---

### Escenario 2: Ciclo de Devolución (Pérdida de Venta)
**Objetivo**: Reflejar que el dinero volvió al cliente pero el material se perdió.
1. **Paso 1 (Fabricación)**: EGRESO -> **-$100**. (Balance: -100)
2. **Paso 2 (Venta)**: INGRESO -> **+$400**. (Balance: +300)
3. **Paso 3 (Devolución)**: El pedido cambia a "DEVUELTO".
    - **Transacción**: REEMBOLSO -> **-$400**.
    - **Balance Final**: **-$100**. 
    - *Interpretación*: Recuperaste el stock (si es posible), pero el balance contable muestra que perdiste los $100 que costó fabricarlo inicialmente.

---

### Escenario 3: Merma / Pieza Rota (Control de Doble Descuento)
**Objetivo**: Registrar el gasto de una falla sin restar dinero dos veces.
1. **Paso 1 (Inicio)**: Se inicia la impresión.
    - **Transacción**: EGRESO (Producción) -> **-$100**.
2. **Paso 2 (Fallo)**: La pieza se despega o rompe. El usuario marca "Registrar Merma".
    - **Lógica de Seguridad**: El sistema detecta que el Egreso de -$100 ya fue realizado para este ítem.
    - **Acción**: Solo cambia la **Categoría** del gasto a "MERMA" para estadísticas, pero **NO genera una nueva transacción** de dinero.
    - **Balance Final**: **-$100**.
    - *Resultado*: No se descuenta dos veces. El gasto ya ocurrió y se mantiene como pérdida.

---

### Escenario 4: Pagos Parciales (Señas) y Liquidación
**Objetivo**: Rastrear dinero adelantado y asegurar que el saldo final sea exacto.
1. **Paso 1 (Seña)**: El cliente entrega $200 para un pedido de $500.
    - **Transacción**: INGRESO (Seña) -> **+$200**.
    - **Pedido**: Monto Pagado $200, Saldo Pendiente $300.
2. **Paso 2 (Entrega)**: El pedido cambia a "ENTREGADO".
    - **Lógica**: El sistema detecta saldo pendiente de $300.
    - **Transacción**: INGRESO (Saldo) -> **+$300**.
    - **Resultado**: El ingreso total es $500. Se evita el error de registrar $500 extra al final.

### Escenario 5: Devolución con Pago Parcial (Blindaje)
**Objetivo**: No devolver más dinero del que entró.
1. **Situación**: El pedido era de $500, pero el cliente solo pagó $200 de seña.
2. **Acción**: El pedido cambia a "DEVUELTO".
    - **Lógica de Seguridad**: El sistema verifica `montoPagado`.
    - **Transacción**: REEMBOLSO -> **-$200** (Lo efectivamente cobrado).
    - **Resultado**: El balance de ventas queda en $0. No se descuentan los $500 teóricos.

