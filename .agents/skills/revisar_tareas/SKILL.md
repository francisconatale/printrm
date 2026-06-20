---
name: revisar_tareas
description: Analiza el estado de las tareas y checklists en los archivos markdown de .specify/
---

# Skill: Revisar Tareas
Esta skill se activa cuando el usuario solicita revisar las tareas pendientes o el estado de los checklists en el proyecto.

## Instrucciones para el Agente
Cuando este trigger se active, realiza los siguientes pasos automáticamente:
1. Inspecciona los archivos `tasks.md` dentro de la carpeta `.specify/` y sus subcarpetas de especificaciones.
2. Identifica y extrae todas las tareas que están pendientes (`[ ]`) y las que están completadas (`[x]`).
3. Si un archivo de especificación (`tasks.md`) tiene todas sus tareas y checklists 100% completados (`[x]`), archívalo o marca la sección/archivo correspondiente como archivado según las convenciones del proyecto.
4. Genera un reporte consolidado ordenado por especificación y fase, indicando cuáles fueron archivados.
5. Para cada archivo analizado, incluye enlaces absolutos en formato markdown como: `[nombre_archivo](file:///C:/Users/FRANCISCO/Desktop/printrm/.specify/...)` utilizando barras inclinadas hacia adelante (forward slashes) para la ruta del archivo.
6. Presenta el resumen de forma limpia y concisa al usuario.
