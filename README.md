# PrusaSlicer Portable Cost Calculator

Este proyecto es una aplicación de escritorio portable para Windows que integra el motor de PrusaSlicer. Permite a los usuarios calcular costos de impresión 3D a través de una interfaz de usuario moderna, sin necesidad de tener Java o PrusaSlicer preinstalado.

## 🚀 Stack Tecnológico

- **Frontend:** [React](https://reactjs.org/) con [TypeScript](https://www.typescriptlang.org/) y [Vite](https://vitejs.dev/).
- **Backend:** [Spring Boot](https://spring.io/projects/spring-boot) (Java 17) como un wrapper que ejecuta el CLI de PrusaSlicer.
- **Aplicación de Escritorio:** [Electron](https://www.electronjs.org/) para empaquetar la aplicación web y el backend de Java en un solo ejecutable.
- **Build System (Java):** [Gradle](https://gradle.org/).
- **Build System (App):** [Electron Builder](https://www.electron.build/).

## 📁 Estructura del Proyecto

El proyecto se ha unificado para mayor claridad:

- **/backend/**: Contiene todo el código fuente de Spring Boot (Java), los scripts de Gradle, y las configuraciones y binarios de PrusaSlicer necesarios para la compilación.
- **/frontend/**: Contiene todo el código fuente de la interfaz de usuario en React.
- **/output/printcrm/**: Carpeta donde se genera la aplicación portable (`.exe`) después de compilar.
- `main.js`: El punto de entrada principal de la aplicación Electron, responsable de crear la ventana y lanzar el proceso del backend.

## ⚙️ Requisitos para Desarrollo

- [Node.js](https://nodejs.org/) (versión 18+ recomendada)
- [JDK (Java Development Kit) 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- El CLI de Git.

## 🛠️ Guía de Uso

### 1. Instalación de Dependencias

Antes de empezar, necesitas instalar todas las dependencias de Node.js tanto para el proyecto raíz como para el frontend.

```bash
# Instala las dependencias de Electron y del proyecto principal
npm install

# Entra a la carpeta del frontend e instala sus dependencias
cd frontend
npm install
cd ..
```

### 2. Ejecutar en Modo Desarrollo

Para trabajar en la aplicación, podés correr el frontend y el backend simultáneamente con un solo comando. Esto abrirá la aplicación y la recargará automáticamente si hacés cambios en el código.

```bash
npm run dev
```

### 3. Compilar la Versión Portable

Para generar el ejecutable portable final para Windows, hemos creado dos scripts de ayuda:

- **`limpiar.bat`**: (Opcional) Ejecutá este script para borrar todas las carpetas de compilación (`build`, `dist`, `output`) y dejar el proyecto limpio antes de una nueva compilación.
- **`armar_portable.bat`**: **Este es el script principal.** Ejecutalo para automatizar todo el proceso:
    1. Instala todas las dependencias.
    2. Compila el frontend de React.
    3. Compila el backend de Java y genera un JRE mínimo.
    4. Empaqueta todo en un solo `.exe` portable.

Una vez finalizado, encontrarás la aplicación en la carpeta `output/printcrm/`.
