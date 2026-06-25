# 🎨 Constitución de Diseño: Studio Edition

Este documento define la ley visual estricta para la interfaz de **Printly**. Cada nueva vista o componente debe adherirse estrictamente a estas reglas para mantener la coherencia estética "Studio Edition", orientada a la máxima funcionalidad sin adornos innecesarios.

---

## 🏛️ Principios Fundamentales

### I. Product Protagonist (Data-First)
La interfaz debe retroceder. Los datos financieros y de producción son los verdaderos protagonistas. Se prohíbe todo "cromo" decorativo, gradientes distractores o marcos que compitan con las métricas. Se prioriza el contraste claro y la legibilidad.

### II. Functional Density
Las interfaces deben ser densas pero ordenadas. El espacio de trabajo simula una planilla técnica o terminal de taller. Se evita el aire excesivo de las interfaces de marketing (landing pages) y se prefiere un layout concentrado donde la información crítica esté siempre a la vista.

---

## 🎨 Paleta de Colores

La paleta es monocromática y neutra, basada en el tono de tinta profunda `Ink (#1d1d1f)`. El color saturado se reserva de forma exclusiva para datos semánticos críticos o estados (alertas, precios, botones de acción primaria).

| Token de Color | Valor Hex / Tailwind | Propósito |
| :--- | :--- | :--- |
| **Canvas** | `#ffffff` | Color de fondo principal |
| **Parchment** | `#f5f5f7` | Fondos de secciones secundarias, sidebars y inputs |
| **Ink** | `#1d1d1f` | Texto principal, iconos y bordes de alta prioridad |
| **Hairline** | `#e0e0e0` / `Ink/10` | Divisores y bordes (siempre de `0.5px`) |
| **Success** | `#22c55e` | Dinero entrante, ingresos, estados completados o entregados |
| **Warning** | `#f59e0b` | Pedidos pendientes, estados intermedios, señas pendientes |
| **Destructive** | `#ef4444` | Mermas, cancelaciones, pérdidas financieras y egresos |

---

## 📐 Bordes, Elevación y Sombras

*   **Bordes obligatorios**: Todos los bordes de tablas, tarjetas y contenedores secundarios deben ser de `0.5px` (`border-[0.5px] border-border`).
*   **Shadow Limit**: La interfaz es fundamentalmente plana. Se permite una **única sombra de firma** exclusiva para el contenedor principal de la aplicación (**Super-Card**):
    ```css
    box-shadow: 3px 5px 30px 0px rgba(0, 0, 0, 0.22);
    ```
*   Botones, cards y inputs se separan mediante espacio en blanco y bordes hairline de 0.5px. No llevan sombras individuales.

---

## 🔤 Tipografía y Jerarquía

*   **Fuentes utilizadas**:
    *   Textos generales: **Inter** (fuente sans-serif de ancho variable).
    *   Valores financieros / Métricas / Horas: **JetBrains Mono** (fuente monoespaciada) para asegurar la alineación de números en columnas.
*   **Tracking**: En headlines con tamaño mayor a 17px, el tracking (espaciado entre letras) negativo es **obligatorio** (`tracking-tight` o `tracking-tighter`).

### Escala Tipográfica Estricta:

*   **Hero Display** (KPIs gigantes): `56px` / peso `600` / `-0.025em` tracking (JetBrains Mono si son números)
*   **Display Lg** (Títulos de página): `40px` / peso `600` / `-0.01em`
*   **Section Header**: `24px` / peso `600` / `-0.015em`
*   **Body / Texto común**: `17px` / peso `400` / `-0.022em` (Inter)
*   **Small Label**: `12px` / peso `500`

---

## ⚡ Interacciones y Feedback Táctil

*   **Micro-animación en botones**: Todos los botones de acción e ítems clickeables deben responder al click del usuario con una compresión física:
    *   Efecto Tailwind: `active:scale-95 transition-all duration-100`
*   **Borradores y Estados**: Los estados cambian de color sutilmente utilizando el componente `EstadoBadge`, el cual no debe usar colores sobresaturados de fondo, sino tonos pasteles opacos con texto en color semántico fuerte.
