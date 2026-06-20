# Estado de Tarea: Claves Únicas para Items del Formulario

## Objetivo
Solucionar el fallo en el borrado de filas del listado de ítems reemplazando la clave `index` en el `key` de React por un identificador único generado al vuelo (`keyId`). Esto garantiza que React concilie correctamente el DOM al eliminar filas.

## Tareas
- [ ] Modificar la interfaz `ItemFormState` para incluir una propiedad `keyId`.
- [ ] Generar un `keyId` aleatorio/único al inicializar el estado y al usar `handleAddItem`.
- [ ] Cambiar el atributo `key` del listado de ítems en el render a `item.keyId`.
- [ ] Validar compilación.

## Archivos Involucrados
- `frontend/src/features/pedidos/components/CrearPedidoModal.tsx`
