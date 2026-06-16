# 🔄 Flujos Operativos y Pipeline 3D

Este documento detalla el funcionamiento técnico del motor de procesamiento 3D y slicing de **PrintRM**, describiendo la interacción desde que el usuario sube un archivo STL hasta que se calcula el costo en tiempo real y se visualiza en la interfaz.

---

## 🚀 1. El Pipeline de Slicing (Integración PrusaSlicer)

PrintRM integra de forma local la herramienta **PrusaSlicer CLI** para procesar archivos 3D directamente en la computadora del usuario sin requerir APIs web externas.

```mermaid
graph TD
    A[Carga STL en Frontend] -->|POST /api/slice| B[SlicerController]
    B -->|Genera Config .ini| C[SlicerService]
    C -->|Ejecuta Comando CLI| D[PrusaSlicer CLI]
    D -->|Genera Archivo G-Code| E[SlicerService]
    E -->|Parsea G-Code| F[Metadatos: Peso, Tiempo]
    F -->|Devuelve JSON| G[useCalculo Hook en Frontend]
    G -->|Reactividad en Frontend| H[Cálculo de Costo Real]
```

### Flujo de Ejecución Detallado:

1.  **Carga e Ingesta**: El frontend envía el archivo `.stl` y los perfiles de impresora e impresión seleccionados al endpoint `/api/slice`.
2.  **Generación de Configuración Temp**: El backend (`PrusaSlicerGenerator.java`) lee los parámetros del perfil y escribe un archivo de configuración temporal `.ini` con los ajustes específicos de temperatura, rellenos, capas y soporte.
3.  **Ejecución Asíncrona del Comando CLI**:
    El backend lanza un subproceso llamando al ejecutable nativo de PrusaSlicer provisto en los binarios de la aplicación:
    ```powershell
    prusa-slicer.exe --slice --load temp_config.ini --output temp_output.gcode input_file.stl
    ```
4.  **Parseo de G-Code**:
    Una vez finalizada la ejecución de PrusaSlicer, el servicio lee el archivo `.gcode` generado. Parsea las líneas de metadatos al final del archivo insertadas por el slicer:
    *   `filament used [g]`: Peso exacto de filamento consumido.
    *   `filament cost`: Costo teórico.
    *   `estimated printing time`: Tiempo total de impresión en horas, minutos y segundos.
5.  **Retorno**: El backend elimina los archivos temporales generados (`.ini` y `.gcode`) y retorna la información limpia al frontend en formato JSON.

---

## 🧮 2. Reactividad en el Frontend: `useCalculo`

Una vez que el frontend recibe la respuesta con el peso en gramos y el tiempo en horas y minutos del slicer, el hook personalizado `useCalculo` realiza los cálculos de costos de forma local con funciones puras actualizando la interfaz en menos de 200ms ante cualquier cambio del usuario.

### Fórmulas del Hook:
*   `TiempoTotalHoras = Horas + (Minutos / 60)`
*   `CostoEnergia = (ConsumoWatts / 1000) * TiempoTotalHoras * CostoKwh`
*   `CostoFilamento = (Gramos / 1000) * CostoFilamentoKg`
*   `CostoDesgaste = (CostoAmortizacionImpresora / VidaUtilHoras) * TiempoTotalHoras`
*   `Subtotal = CostoEnergia + CostoFilamento + CostoDesgaste + InsumosExtra`
*   `CostoBase = Subtotal * (1 + MargenError / 100)`
*   `PrecioVenta = CostoBase * Multiplicador`

---

## 👁️ 3. Pipeline de Renderizado 3D

Para las tarjetas de la galería en la Biblioteca y el visor de detalle, la aplicación implementa previsualizaciones ligeras del modelo 3D cargado:
*   **React Three Fiber & Drei**: Se monta un canvas de WebGL liviano que lee el archivo STL convertido a Buffer.
*   **Optimizaciones de Carga**:
    *   Se calcula la caja de contención para centrar la cámara del canvas de forma automática.
    *   Se limita la complejidad de las geometrías en previsualización (se lee el STL binario simplificado) para evitar caídas de frames en el render del navegador embebido de Electron.
