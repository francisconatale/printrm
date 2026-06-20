# Tarea Actual: Ajustes en catálogo de stock (T027)

## Estado
- [x] Eliminar columna 'Costo Fab.' de la tabla del catálogo en `ProductosGalleryView.tsx`.
- [x] Exponer costos de materiales y energía en `PiezaSTLResponseDTO` en el backend y `PiezaSTL` en el frontend.
- [x] Modificar celda de 'Precio Sug.' en `ProductosGalleryView.tsx` para mostrar tooltip con desglose de costos (Costo Material, Costo Energía, Total Costo de Producción).

## Archivos involucrados
- `backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLResponseDTO.java`
- `backend/src/main/java/com/printrm/studio/domain/biblioteca/PiezaSTLService.java`
- `frontend/src/features/biblioteca/types/biblioteca.types.ts`
- `frontend/src/features/stock/components/ProductosGalleryView.tsx`
- `CHANGELOG.md`
