# Design Implementation Plan: ProductoCard

## Summary
- **Scope:** Component Redesign
- **Target:** `frontend/src/features/stock/components/ProductoCard.tsx`
- **Winner variant:** Variant B (Horizontal List Card)
- **Key improvements:** 
  - Layout convertido de grid-card (vertical) a list-card (horizontal).
  - Jerarquía clara de la información.
  - Costo de fabricación y stock directamente visibles y estilizados.
  - Menos denso visualmente pero con mejor optimización de espacio.

## Files to Change
- [ ] `frontend/src/features/stock/components/ProductoCard.tsx` - Refactorizar el componente a Variant B.
- [ ] `frontend/src/features/stock/components/ProductosGalleryView.tsx` - (Opcional) Revisar si el layout de `grid` donde se mapean las tarjetas necesita ajustarse a columnas (ej: `grid-cols-1 xl:grid-cols-2`) ahora que el componente es horizontal.

## Implementation Steps
1. **Reestructurar JSX**: Reemplazar la anatomía visual del `ProductoCard` con el diseño de la Variant B.
2. **Reconectar Lógica**:
   - Restaurar el uso de `updateStock` para los botones de `+` y `-`.
   - Recuperar el estado `isLotesModalOpen` y `isEditModalOpen` para los modales.
   - Reconectar el `DropdownMenu` (Editar, Eliminar) en el botón de los 3 puntitos (`MoreVertical`).
3. **Manejo de Datos Reales**:
   - Cargar la imagen usando la validación existente (`producto.partes?.[0]?.imagenBase64`).
   - Usar el cálculo `currentProductionCost` original en lugar de mocks.
4. **Validación de UI/UX**:
   - Verificar `hover` y transiciones en modo Dark/Light.
   - Asegurarse que el contenedor de los modales y el `<DropdownMenuContent>` se superpongan bien.

## Component API
- **Props:** Se mantienen las mismas (`producto: Producto`, `onDelete: (id: string) => void`).
- **State:** `isLotesModalOpen`, `isEditModalOpen`.
- **Events:** `updateStock`, `onDelete`.

## Required UI States
- **Loading:** N/A (manejado por el container o mutaciones como `isPending`).
- **Empty:** En caso de no tener imagen, se usa el ícono `<Box>`.
- **Disabled:** Cuando el stock es `<= 0`, el botón de `Minus` debe estar deshabilitado visual y lógicamente.

## Accessibility Checklist
- [ ] Etiquetas y attributes `aria-hidden` mantenidos para íconos.
- [ ] Contrastes de color legibles en modo claro y oscuro.
- [ ] Elementos interactivos tienen tamaño suficiente y states claros (`hover`/`disabled`).
