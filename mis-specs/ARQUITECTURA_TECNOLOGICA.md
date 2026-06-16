# 🏗️ Arquitectura Tecnológica y Empaquetado

Este documento especifica la arquitectura técnica de **PrintRM**, detallando el stack tecnológico, la integración de la base de datos local y los mecanismos de despliegue y empaquetado para generar una aplicación portable en Windows.

---

## ⚙️ Stack Tecnológico Completo

### Backend (Java Desktop API)
*   **Lenguaje**: Java 17 (LTS)
*   **Framework**: Spring Boot 3.3.0
*   **Base de Datos**: SQLite (Motor embebido local)
    *   **Driver**: `org.xerial:sqlite-jdbc`
    *   **ORM**: Hibernate 6 con una dialecto customizado para SQLite (`org.hibernate.community.dialect.SQLiteDialect`) que mapea tipos UUID y maneja las transacciones locales de forma consistente.
*   **Construcción**: Gradle

### Frontend (React Single Page App)
*   **Lenguaje**: TypeScript en modo estricto
*   **Framework**: React 18
*   **Herramientas de Build**: Vite 8
*   **Estilizado**: Tailwind CSS 3.4
*   **Componentes**: Componentes primitivos de Radix UI estilizados con shadcn/ui.
*   **Estado y Queries**: TanStack Query v5 (React Query) para llamadas asíncronas y caching en memoria de entidades.
*   **Formularios**: React Hook Form integrando validación de esquemas con Zod.

### Desktop Wrapper (Electron Bridge)
*   **Shell**: Electron (Integra la aplicación en un contenedor de escritorio Windows).
*   **Entry Point**: `main.js` (Raíz del proyecto)
    *   **Modo Desarrollo**: Ejecuta el comando de Gradle `bootRun` asíncronamente y redirige Electron hacia la URL del dev server de Vite.
    *   **Modo Producción**: Inicia el backend usando el JRE empaquetado y levanta la ventana cargando los archivos estáticos HTML/JS compilados del frontend.

---

## 📂 Estructura de Directorios

### Backend (`/backend/src/main/java/com/printrm/studio/`)
La estructura sigue un diseño guiado por el dominio (Domain-Driven Package Layout) en lugar de una arquitectura de 3 capas genérica:
*   `StudioApplication.java`: Punto de entrada de Spring Boot.
*   `config/`: Ajustes de CORS globales y controllers de salud del servicio.
*   `slicer/`: Pipeline de integración con PrusaSlicer por consola de comandos.
*   `domain/`: Agrupación por dominios lógicos (cada uno contiene sus Entities, Repositorios, Controllers, DTOs y Servicios):
    *   `ajustes/`: Configuración global del taller.
    *   `biblioteca/`: Gestor de piezas STL y metadatos.
    *   `calculo/`: Motor de costos.
    *   `clientes/`: Registro CRM de clientes.
    *   `finanzas/`: Libro diario y transacciones.
    *   `pedidos/`: Orden de venta, ítems y estados del pedido.
    *   `perfil/`: Perfiles de filamentos, impresoras e impresión.
    *   `stock/`: Inventario físico de productos y lotes FIFO.

### Frontend (`/frontend/src/`)
*   `App.tsx`: Enrutador principal y configuración del Context Provider.
*   `components/layout/`: AppShell, sidebar de ancho fijo de 240px, sub-navegaciones.
*   `components/ui/`: Componentes básicos reutilizables (botones, tablas, diálogos).
*   `features/`: Modularizado por dominios (ej. `features/pedidos/`, `features/stock/`). Cada módulo contiene subcarpetas de componentes, hooks de query, tipos y APIs exclusivas del módulo.
*   `lib/api-client.ts`: Instancia global de Axios pre-configurada con la URL base `/api/v1`.

---

## 📦 Pipeline de Empaquetado y Portabilidad

La portabilidad es un requisito crítico de PrintRM. La aplicación se distribuye como un único ejecutable `.exe` que no requiere instalar Java o base de datos por separado en el sistema operativo del cliente.

1.  **Compilación del Frontend**:
    ```powershell
    npm run build:frontend
    ```
    Compila el código de React a una carpeta de estáticos en `frontend/dist/`.
2.  **Preparación del JRE y Backend**:
    ```powershell
    gradlew stageApp
    ```
    Compila el JAR de Spring Boot y utiliza `jlink` para crear una máquina virtual Java (JRE) minimalista, reduciendo el tamaño total del runtime a menos de 40MB.
3.  **Compilación de Electron**:
    ```powershell
    npx electron-builder --win --dir
    ```
    Orquesta los binarios. Junta el JRE embebido, el backend compilado, los estáticos de frontend y las librerías de Electron en la estructura final copiada a la carpeta `output/printcrm/` para su distribución.
