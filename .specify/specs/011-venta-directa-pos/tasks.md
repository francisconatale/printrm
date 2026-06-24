# Tasks: Venta Directa POS

## Backend
- [ ] B001 Crear endpoint `POST /api/ventas-directas`
- [ ] B002 Crear endpoint `GET /api/ventas-directas` paginado
- [ ] B003 Crear DTOs: `VentaDirectaRequest`, `VentaDirectaResponse`
- [ ] B004 Implementar service: consumir stock FIFO + registrar Transaccion
- [ ] B005 Opcional: crear Pedido mínimo (COBERTURA -> CONFIRMADO -> ENTREGADO) automático

## Frontend
- [ ] F001 Agregar botón "Vender" en ProductoCard (con estado disabled si stock = 0)
- [ ] F002 Crear `VentaDirectaModal` con nombre, precio, cantidad, comprador opcional
- [ ] F003 Conectar modal con API y mostrar toast de éxito/error
- [ ] F004 Actualizar stock en la ProductoCard post-venta (refetch o actualización optimista)

## Historial
- [ ] H001 Agregar botón "Historial Ventas" en ProductosGalleryView
- [ ] H002 Crear modal/vista de historial con tabla paginada

## Validación
- [ ] V001 Verificar que la transacción aparece en Libro Diario
- [ ] V002 Verificar consumo FIFO correcto (probar con múltiples lotes)
- [ ] V003 Verificar que no se puede vender con stock insuficiente
