# Plan: Sistema de Lotes de Inventario FIFO

## Objetivo
Implementar un sistema de gestión de inventario basado en lotes utilizando la lógica FIFO (First-In, First-Out) para el consumo de stock y el cálculo de costos.

## Stack Tecnológico
- **Backend**: Java, Spring Boot, Spring Data JPA, H2/PostgreSQL.
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui.

## Estructura
- **Entidad Lote**: Almacena cantidad inicial, cantidad actual, costo unitario y fecha de creación.
- **ProductoService**: Lógica para crear lotes al añadir stock y consumir lotes en orden cronológico.
- **ProductoController**: Endpoints para gestionar el stock con información de costos.
- **Frontend**: Visualización de stock y gestión de entradas.
