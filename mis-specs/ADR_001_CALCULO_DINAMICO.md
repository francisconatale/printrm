# ADR-001: Centralización y Dinamismo del Motor de Costos

> **Fecha**: 16 de Junio de 2026
> **Estado**: Implementado
> **Decisión**: Eliminar el cálculo de costos en el Frontend y la persistencia de precios estáticos en la base de datos (STL), trasladando toda la matemática financiera a un motor dinámico centralizado en el Backend (`CostCalculationService`).

---

## 🛑 El Problema Original (¿Por qué cambiamos?)

En la arquitectura inicial, cuando el usuario calculaba el costo de una pieza 3D, el Frontend hacía la matemática y le enviaba al Backend un número fijo (ej. `$150`). El Backend guardaba ese `$150` en la base de datos dentro de la tabla `piezas_stl`.

Esto generaba tres riesgos críticos para el negocio a largo plazo:

1. **Vulnerabilidad a la Inflación (Precios "Viejos")**: Si el costo del kWh (luz) o del kilo de filamento subía la semana siguiente, los `$150` guardados en la base de datos quedaban obsoletos. El usuario hubiera tenido que abrir cada uno de sus 500 archivos STL, recalcularlos y volverlos a guardar manualmente uno por uno para no perder dinero.
2. **Inseguridad (Frontend no confiable)**: En desarrollo de software profesional, el Frontend (el navegador) nunca debe decidir sobre dinero. Si un error en el navegador o una interrupción de red alteraba el cálculo, la base de datos hubiese guardado un costo irreal.
3. **Acoplamiento Comercial/Técnico**: Mezclar el "Multiplicador de Ganancia" (Markup) y el "Desgaste de Máquina" junto con los gramos de plástico hacía imposible separar lo que cuesta fabricar físicamente algo de la estrategia comercial de venta.

---

## 🎯 La Solución Implementada (Motor Centralizado)

Se diseñó una nueva arquitectura basada en **Cálculo "On-the-fly" (En tiempo real)**.

### 1. La Biblioteca STL es Puramente Física
Ahora, la base de datos solo guarda la **Verdad Absoluta Física**: "Esta pieza pesa 27 gramos y tarda 2 horas, usando PLA". No sabe de dinero.

### 2. El Servidor es el Contador
Cuando la interfaz necesita mostrar un precio (en la biblioteca, o al armar un producto), le pasa esos datos físicos al `CostCalculationService` en el Backend. El servidor revisa a cuánto está el filamento y la luz **en ese preciso milisegundo** y devuelve el costo exacto.

### 3. Sellado FIFO en Fabricación
El único momento en el que un costo se vuelve "estático" es al momento de fabricar físicamente (sumar stock `+`). Ahí, el Backend calcula el precio actual y "sella" un Lote FIFO. Esto garantiza que el inventario físico tenga el valor histórico real que te costó producirlo ese día.

---

## 📈 Impacto y Beneficios Clave

1. **Ajuste Automático Anti-Inflación**: Si el precio del filamento sube un 10%, el usuario solo cambia un número en la pestaña de "Ajustes Globales". Inmediatamente, TODO el catálogo de productos de la app mostrará los nuevos costos de producción de forma retroactiva sin tocar ni un solo archivo STL.
2. **Resolución del Cuello de Botella "N+1"**: Se optimizó la base de datos para que no pregunte "a cuánto está la luz" por cada pieza individual al cargar la galería. Se carga el precio global una vez y se aplica matemáticamente a todas las piezas en memoria, haciendo que la app cargue instantáneamente aunque tengas miles de diseños.
3. **Escalabilidad Enterprise**: Si el día de mañana se lanza una App Móvil de Printly, no hay que reprogramar las fórmulas financieras en Android o iOS; simplemente llaman al mismo endpoint `/calculate` del servidor central.
