# Implementation Plan: UX Optimization - STL to Product & Variable Pricing Flow

**Branch**: `007-integration-ux` | **Date**: 2026-06-20 | **Spec**: [.specify/specs/007-integration-ux/spec.md](file:///C:/Users/franc/OneDrive/Desktop/printrm/.specify/specs/007-integration-ux/spec.md)

## Summary
Optimizar la experiencia del usuario (UX) unificando y agilizando el flujo de trabajo en el frontend. Implementaremos:
1. Un acceso directo desde la biblioteca STL para publicar un modelo como producto de catálogo en un solo clic.
2. La posibilidad de sobrescribir el precio unitario sugerido directamente al crear un pedido para dar flexibilidad comercial diaria.

## Technical Context
**Language/Version**: Java 17, TypeScript (React 18)
**Dependencies**: Spring Boot 3.3, React, Lucide Icons, React Hook Form
**Storage**: SQLite (JPA)

## Constitution Check
- [x] **Product Protaganist**: Se mantiene la visualización limpia de los campos de texto e inputs de precio.
- [x] **Monochromatic Accent**: El input de sobreprecio se diseña con bordes grises neutros sin colores chillones.
- [x] **Studio Typography**: Fuentes monoespaciadas para los precios y la grilla alineada a 8pt.

## Project Structure
### Documentation
```text
.specify/specs/007-integration-ux/
├── spec.md              # Especificaciones y casos de uso
└── plan.md              # Este archivo
```

### Backend Changes
*   [`ItemPedidoRequestDTO.java`](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedidoRequestDTO.java): Agregar el campo `private Double precioPersonalizado;` para recibir el precio modificado desde el frontend.
*   [`ItemPedido.java`](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/ItemPedido.java): Agregar método o ajustar `calcularSubtotal(Double precioPersonalizado)` para priorizar el precio sobreescrito por sobre el sugerido del catálogo.
*   [`PedidoService.java`](file:///C:/Users/franc/OneDrive/Desktop/printrm/backend/src/main/java/com/printrm/studio/domain/pedidos/PedidoService.java): Pasar el `precioPersonalizado` de la request a `calcularSubtotal` durante la creación del pedido.

### Frontend Changes
*   [`pedidos.types.ts`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/types/pedidos.types.ts): Actualizar `ItemPedidoRequest` para incorporar el opcional `precioPersonalizado?: number`.
*   [`CrearPedidoModal.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/pedidos/components/CrearPedidoModal.tsx):
    *   Agregar un input numérico editable para el precio unitario en cada línea de producto.
    *   Inicializar este input con el precio sugerido del producto seleccionado.
    *   Soportar edición y recalcular totales dinámicamente en el preview.
*   [`PiezasGalleryView.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/PiezasGalleryView.tsx) y [`STLCard.tsx`](file:///C:/Users/franc/OneDrive/Desktop/printrm/frontend/src/features/biblioteca/components/STLCard.tsx):
    *   Integrar un botón rápido de "Publicar" en las tarjetas de la galería STL.
    *   Montar e inicializar el modal de creación de producto con la pieza seleccionada por defecto.
