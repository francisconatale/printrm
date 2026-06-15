# Implementation Plan: Sprint 2 - Historial y Exportación

**Branch**: `003-historial-exportacion` | **Date**: 2026-06-16 | **Constitution**: `.specify/constitution.md`

## Summary

Este Sprint se centra en cerrar el ciclo de vida del cálculo y expandir la gestión de activos: desde la persistencia automática de resultados y visualización en un historial, hasta la creación de una **Biblioteca de Piezas** para organizar archivos STL con previsualización 3D. También incluye la capacidad de compartir/exportar datos de forma profesional (WhatsApp y CSV).

---

## Casos de Uso

### CU-01 — Ver Historial
**Actor:** Usuario | **Prioridad:** P1
El usuario accede a la sección "Historial" y ve una lista cronológica de sus últimos 50 cálculos con los datos clave (Nombre, Costo Final, Fecha).

### CU-02 — Compartir por WhatsApp
**Actor:** Usuario | **Prioridad:** P0
Al finalizar un cálculo, el usuario hace clic en "WhatsApp" y se genera un mensaje pre-formateado con el resumen del presupuesto para enviar a un cliente.

### CU-03 — Gestionar Biblioteca de Piezas
**Actor:** Usuario | **Prioridad:** P1
El usuario puede navegar por una galería de tarjetas (Cards) que muestran sus piezas STL guardadas, incluyendo una previsualización visual del modelo y acceso rápido para recalcular su costo.

---

## Objetivos del Módulo
- Implementar persistencia local para cálculos pasados.
- Crear visualización tabular del historial siguiendo el Studio Design System.
- **Implementar Biblioteca de Piezas:** Visualización de STL en formato Galería con previews.
- Facilitar la exportación de datos para administración externa (CSV).

---

## Technical Context
- **Backend:** JPA Repository sobre SQLite.
- **Frontend:** TanStack Query para fetching del historial.
- **Utils:** Formateadores de texto para WhatsApp y generador de CSV.
