# Reglas de Codificación (Backend)

- **DTOs Unificados**: Al implementar DTOs de Request y Response para una entidad, si los campos de entrada y salida son coincidentes (a excepción del campo `id`), se debe utilizar una única clase DTO unificada (ej. `ClienteDTO`), definiendo el campo `id` como opcional/anulable. Esto evita la creación innecesaria de clases redundantes (`*RequestDTO` y `*ResponseDTO`).
