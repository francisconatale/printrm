# Research: Phase 2 Implementation Details

## Unknowns & Investigations

### 1. Performance of 3D Previews in Gallery
- **Question**: Can `@react-three/fiber` handle 20+ canvas instances in a single view?
- **Decision**: Use a single global `Canvas` with `View` (from `@react-three/drei`) or implement strict lazy loading for the previews.
- **Rationale**: Multiple canvases can lead to WebGL context exhaustion (limit is ~16 in some browsers). Using `View` allows multiple 3D scenes in a single canvas.
- **Alternatives**: Pre-generating static screenshots (rejected for Phase 2, but considered for future optimization).

### 2. WhatsApp Professional Formatting
- **Question**: Best way to generate a WhatsApp message with clear structure (bolding, spacing)?
- **Decision**: Use `encodeURIComponent` with Markdown-style decorators (`*` for bold) and `\n` for line breaks.
- **Rationale**: Native WhatsApp API supports these decorators. It ensures a professional "Invoice-like" feel in the message.

### 3. Client-Calculation Data Model
- **Question**: Should we use a strict JPA relationship or loose UUID referencing?
- **Decision**: Strict `@ManyToOne` from `Calculo` to `Cliente`.
- **Rationale**: Allows easy retrieval of client history using `cliente.getCalculos()` and ensures data integrity.

## Best Practices

### Technology: @react-three/fiber
- Use `useLoader` with `Suspense` for STL files.
- Enable `enableDamping` in `OrbitControls` for Studio-quality feel.

### Technology: Spring Boot JPA
- Use `FetchType.LAZY` for relationships to avoid performance bottlenecks in history views.
- Implement `@CreationTimestamp` for automatic date tracking.
