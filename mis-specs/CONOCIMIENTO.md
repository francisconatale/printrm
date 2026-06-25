# 📚 Printly — Documento Maestro de Conocimiento

> **Propósito**: Este documento es la fuente de verdad central del proyecto en lenguaje natural y sirve como el índice maestro modular que orquesta todo el conocimiento técnico, visual, operativo y de negocio de **Printly**.
>
> **Organización**: El conocimiento está distribuido en módulos especializados para evitar la saturación de contexto y permitir consultas rápidas y profundas sobre secciones individuales.

---

## 🧭 1. Identidad del Proyecto
**Printly** (Print Rental Manager / Print Room Manager) es una aplicación de escritorio de alta densidad funcional y portabilidad absoluta para Windows. Diseñada bajo la variante **"Studio Edition"**, se posiciona como una herramienta profesional para la gestión integral de talleres de impresión 3D comercial. Centraliza la cotización mediante slicing de archivos STL, gestión CRM de clientes, ciclo de vida de pedidos, control de stock bajo metodología FIFO y un balance contable/libro diario en tiempo real.

---

## 🗂️ 2. Módulos Especializados de Conocimiento

Para consultar detalles específicos de implementación a nivel de código y diseño, accede a las siguientes guías modulares:

### 🎨 [Constitución de Diseño](file:///c:/Users/franc/OneDrive/Desktop/printly/mis-specs/DISE%C3%91O.md)
*   **Contenido**: Principios de diseño rígidos, paleta monocromática exacta basada en `Ink (#1d1d1f)`, escala tipográfica deInter y JetBrains Mono, límites estrictos de sombras y divisores de `0.5px`, y animaciones de feedback táctil (`active:scale-95`).

### 🧮 [Lógica de Negocio y Finanzas](file:///c:/Users/franc/OneDrive/Desktop/printly/mis-specs/NEGOCIO_FINANZAS.md)
*   **Contenido**: Sistema de control de inventario FIFO por lotes con fusión inteligente por rango de costo unitario, ciclo de vida completo de pedidos (`BORRADOR` a `DEVUELTO`), triggers financieros y el blindaje de reembolsos de dinero en devoluciones (reembolso estricto de `montoPagado`).

### 🏗️ [Arquitectura Tecnológica y Empaquetado](file:///c:/Users/franc/OneDrive/Desktop/printly/mis-specs/ARQUITECTURA_TECNOLOGICA.md)
*   **Contenido**: Stack de software (Java 17, Spring Boot 3.3, SQLite local y React 18 con TypeScript y Vite 8), la estructura real del código organizada por paquetes de dominio lógico, y el pipeline Gradle/jlink/Electron para generar el instalador `.exe`.

### 🔄 [Flujos Operativos y Pipeline 3D](file:///c:/Users/franc/OneDrive/Desktop/printly/mis-specs/FLUJOS_OPERATIVOS.md)
*   **Contenido**: Proceso de slicing local llamando asíncronamente a PrusaSlicer CLI mediante comandos de consola, parseo de metadatos del G-Code para extracción de tiempos y pesos, reactividad en React usando el hook `useCalculo` y el pipeline de renderizado 3D mediante React Three Fiber y Drei.

### 🗄️ [Modelo de Datos y Relaciones](file:///c:/Users/franc/OneDrive/Desktop/printly/mis-specs/MODELO_DATOS.md)
*   **Contenido**: Mapeo completo de las relaciones JPA entre entidades (Pedido, ItemPedido, Producto, Lote, Cliente, PiezaSTL, Calculo, Transaccion), especificación de llaves foráneas y diagrama lógico Mermaid de relaciones.

### 🧪 [Suite de Pruebas](file:///c:/Users/franc/OneDrive/Desktop/printly/mis-specs/SUITE_TESTS.md)
*   **Contenido**: Comandos de ejecución rápida para backend (JUnit 5) y frontend (Vitest), y detalles del propósito de cada clase de pruebas de integración y unitarias del sistema.

---

## 📊 3. Mapa del Estado del Proyecto

### Features Completadas y Operativas:
*   [x] **Core App Shell**: Contenedor principal de escritorio con Super-Card, sidebar fijo y estilización monocromática a 0.5px.
*   [x] **Perfiles y Ajustes Fijos**: Configuración y persistencia de impresoras y filamentos.
*   [x] **Slicing e Integración**: Ejecución de PrusaSlicer en local y lectura automática del archivo G-Code temporal.
*   [x] **Biblioteca STL**: Gestor visual de piezas cargadas y renderizado de mallas 3D.
*   [x] **Módulo de Pedidos**: Ciclo de vida completo del pedido e hidratación de tablas comerciales.
*   [x] **Gestión CRM de Clientes**: CRUD completo y vinculación a cotizaciones/pedidos.
*   [x] **Inventario FIFO por Lotes**: Generación, consumo secuencial y fusión inteligente de lotes de inventario según costo.
*   [x] **Finanzas y Libro Diario**: Listado de transacciones cronológicas y cálculo en tiempo real de ingresos, egresos y mermas.
*   [x] **Pagos Parciales**: Modales para registrar cobros a cuenta (señas) y liquidación de saldos al entregar el pedido.
*   [x] **Blindaje Financiero**: Control de reembolsos para pedidos devueltos limitado a cobros reales.

---

## ⚙️ 4. Integración del Agente (Speckit)
Los comandos definidos en `.specify/commands/` permiten mantener sincronizada esta base de conocimiento con las especificaciones estructuradas del proyecto en la carpeta `.specify/`:
*   `speckit.specify`: Genera una especificación desde lenguaje natural.
*   `speckit.plan`: Diseña el plan técnico detallado antes de escribir código.
*   `speckit.tasks`: Genera el listado estructurado de tareas.
*   `speckit.implement`: Ejecuta las tareas e implementa los cambios en el código.
