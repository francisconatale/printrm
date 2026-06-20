# Quickstart: Phase 2 Validation

## Scenario 1: New Client Creation
1. Navigate to "Clientes" section.
2. Click "Nuevo Cliente".
3. Enter "Test User", "test@example.com".
4. **Validation**: Check if record appears in the list and is persisted in `studio.db`.

## Scenario 2: Save Model to Library
1. Upload an STL in the "Cotizador".
2. After analysis, click "Añadir a Biblioteca".
3. Navigate to "Biblioteca STL".
4. **Validation**: The model should appear in a card with a rotating 3D preview.

## Scenario 3: Share via WhatsApp
1. Open a previous calculation from "Historial".
2. Click the "WhatsApp" icon.
3. **Validation**: Check if a new tab opens with `wa.me` containing a correctly formatted summary of the costs.

---

## Commands for Manual Verification
- **DB Check**: `sqlite3 backend/studio.db "SELECT * FROM clientes;"`
- **Frontend Health**: `npm run lint` in `frontend/` directory.
