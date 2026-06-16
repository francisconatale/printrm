# 🧠 Spec en Lenguaje Natural: Exportación de Reportes en PDF

> **Contexto**: Esto es un ejemplo de cómo escribirías una spec en tus propias palabras, como se te ocurre, sin estructura rígida. Después, un agente la convierte a formato Speckit.

---

## La Idea

Necesito poder exportar los reportes de costos a PDF desde la app. Quiero que sea algo rápido, tipo "apretar un botón y obtengo un PDF lindo".

---

## Cómo me lo imagino

En la pantalla de Resultados, al lado del precio debería haber un botón que diga "Exportar PDF" o algo así. Cuando lo apriete, quiero que genere un PDF con:

- El nombre de la pieza
- Los costos desglosados (energía, filamento, desgaste)
- El precio de venta sugerido
- La fecha
- Un QR o código para identificar la pieza después

El PDF tiene que verse profesional, algo que le pueda mandar a un cliente.

---

## Cosas importantes

- El botón tiene que estar visible siempre en el panel de resultados
- Si no hay resultados calculados, el botón debería estar deshabilitado o ni aparecer
- El PDF tiene que generarse al toque, sin demora
- Preferiría que se descargue automáticamente, no que abra una pestaña nueva
- El estilo del PDF debería seguir los colores de la app (negro, blanco, grises)
- Tiene que funcionar bien con la parte de electron/desktop

---

## Lo que NO quiero

- No quiero tener que instalar nada extra
- No quiero que se abra una ventana del navegador
- No quiero formularios complicados para exportar

---

## Preguntas que me surgen

- ¿Dónde se guarda el PDF? ¿En descargas?
- ¿Se puede personalizar el logo? (no ahora, pero en el futuro)
- ¿Qué pasa si la pieza tiene caracteres raros en el nombre?

---

## Cómo sé que funciona

1. Aprieto Exportar y en 2 segundos tengo un PDF descargado
2. El PDF tiene todos los datos que mencioné arriba
3. Se ve bien, no está cortado ni con errores
4. Si no hay datos, el botón no hace nada (o no está)

---

> Abajo de esta línea está la **conversión automática a Speckit** que haría el agente:
> 
> *Nota: En la vida real, esto iría a `.specify/specs/007-reportes-pdf/spec.md`*

---

<!-- SPECKIT-MAPPING: Esta sección sería generada automáticamente -->

## Feature: Exportación de Reportes en PDF

### User Stories

**US1 (P1) - Exportación Rápida de PDF**
> Como usuario, quiero exportar el resultado del cálculo a PDF con un solo clic para poder compartirlo con clientes.

**US2 (P2) - PDF Profesional y Completo**
> Como usuario, quiero que el PDF incluya nombre de pieza, costos desglosados, precio final, fecha y código QR para que sea presentable a clientes.

**US3 (P3) - Personalización de PDF**
> Como usuario, quiero poder personalizar el logo en el PDF para que coincida con mi marca.

### Functional Requirements

- **FR-001**: Botón "Exportar PDF" visible en el panel de resultados
- **FR-002**: Botón deshabilitado si no hay resultados calculados
- **FR-003**: PDF generado debe incluir: nombre pieza, costos, precio, fecha
- **FR-004**: PDF se descarga automáticamente al hacer clic
- **FR-005**: Estilo del PDF sigue la paleta Ink (#1d1d1f), blanco y grises

### Edge Cases

- Nombres de pieza con caracteres especiales
- Costos muy grandes o muy pequeños (formateo)
- Pantalla de resultados vacía
- Multiples exportaciones rápidas (debounce)

### Success Criteria

- **SC-001**: PDF generado en < 2 segundos
- **SC-002**: PDF contiene todos los campos requeridos
- **SC-003**: Cero errores de generación
