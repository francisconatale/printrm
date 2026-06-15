# Workflows: PrintRM (Studio Edition)

Este documento mapea los flujos lógicos entre el Usuario, el Frontend, el Backend y el Motor de Slicing (PrusaSlicer).

---

## 1. Flujo de Configuración: Perfiles de Dominio
Antes de calcular, el sistema debe conocer las herramientas. Los perfiles se dividen para permitir combinaciones (ej: misma impresora con distintos filamentos).

**Ruta:** `Perfiles > Nuevo Perfil`

1. **Usuario:** Completa los datos en el Frontend.
   - *Impresora:* Modelo, Consumo (W), Boquilla.
   - *Filamento:* Tipo (PLA/ABS), Densidad (g/cm³), $/kg.
   - *Ajustes:* Altura de capa, Relleno, Soportes.
2. **Frontend:** Envía `POST /api/v1/perfiles` al Backend.
3. **Backend:** 
   - Persiste en la Base de Datos (JPA).
   - Genera/Actualiza archivos `.ini` en `backend/configs/[printer|filament|print]/`.
4. **Sistema:** El nuevo perfil queda disponible para el motor de cálculo.

---

## 2. Flujo Técnico: Carga y Slicing (El "Cerebro")
El momento donde un archivo 3D se convierte en datos métricos reales.

**Ruta:** `Dashboard > Cargar STL`

1. **Usuario:** Arrastra un `.stl` y selecciona la combinación de perfiles.
2. **Frontend:** Envía un `FormData` a `POST /api/slice`:
   - `file`: El binario del STL.
   - `printerConfig`: "ender_3"
   - `filamentConfig`: "pla_premium"
   - `printConfig`: "calidad_0.2"
3. **Backend (SlicerService):**
   - Guarda el STL temporalmente.
   - Ejecuta: `prusa-slicer-console.exe --export-gcode [STL] --load [printer.ini] --load [filament.ini] --load [print.ini]`.
   - **Parser:** Lee el G-Code generado y extrae `estimatedTime` y `filamentUsedG`.
4. **Backend:** Retorna un JSON con los metadatos técnicos.

---

## 3. Flujo Financiero: Motor de Cálculo (El "Negocio")
Transformación de datos técnicos en dinero en tiempo real.

**Ruta:** `Dashboard > Resultados`

1. **Frontend (Hook `useCalculo`):** Recibe los datos del Slicing.
2. **Proceso Automático:**
   - Convierte tiempo a decimal.
   - Aplica fórmulas financieras:
     - `Costo Energía = Tiempo * Consumo W * $/kWh`
     - `Costo Material = Gramos * $/gramo`
     - `Costo Desgaste = Tiempo * $/hora_mantenimiento`
3. **Usuario (Ajuste Manual):**
   - Modifica el **Multiplicador** (ej. 3x a 5x).
   - Agrega **Insumos Extra** (ej. $/500 de packaging).
4. **Reactividad:** El **Precio de Venta** se actualiza instantáneamente en el panel sin volver al backend.

---

## 4. Flujo de Finalización: Historial y Exportación
Cierre del proceso y registro de la venta.

**Ruta:** `ResultadoPanel > Guardar`

1. **Usuario:** Hace clic en "Guardar en Historial" o "Copiar Resumen".
2. **Frontend:** 
   - Realiza un snapshot de los inputs y resultados.
   - Envía `POST /api/v1/calculos` para persistencia histórica.
3. **Backend:** Almacena el snapshot para consultas futuras en el módulo de Historial.

---

## Resumen de Responsabilidades
- **Backend:** Autoridad en **Datos Técnicos** (Slicing) y **Persistencia**.
- **Frontend:** Autoridad en **Datos Financieros** (Cálculo Real-Time) y **UX**.
