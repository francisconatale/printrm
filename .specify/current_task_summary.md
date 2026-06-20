# Estado de Tarea: Corrección de Spread Order en SelectItem

## Objetivo
Resolver el crash (pantalla en blanco) corrigiendo el orden del spread de props en `SelectItem` de `select.tsx`, ya que `{...props}` sobreescribía el valor `mappedValue` con el valor vacío original `""`.

## Tareas
- [ ] Modificar la definición de `SelectItem` en `select.tsx` para desestructurar `value` de los argumentos, evitando que se propague en `props`.
- [ ] Validar compilación.

## Archivos Involucrados
- `frontend/src/components/ui/select.tsx`
