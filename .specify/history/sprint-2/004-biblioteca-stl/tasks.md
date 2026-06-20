# Tasks: Biblioteca de Piezas (STL)

**Input**: Sprint 2 Plan (`.specify/memory/plan.md`)
**Constitution**: Studio Constitution v3.1.0

## Phase 1: Storage & Gallery Setup (Backend/Frontend)

- [x] T001 [P] Implement `PiezaSTL` Entity in Backend (Name, FilePath, Metadata).
- [x] T002 [P] Create `PiezaController` for basic CRUD of model records.
- [x] T003 Design `STLCard.tsx` following Studio layout (monochromatic, hairline border, shadow-signature on hover).
- [x] T004 Create `PiezasGalleryView.tsx` with a responsive grid layout.

## Phase 2: 3D Visualization 🎯

- [x] T005 [P] Setup `@react-three/fiber` and `@react-three/drei` in the frontend.
- [x] T006 Implement `STLPreview.tsx` (A minimalist, monochromatic 3D viewer for the cards).
- [x] T007 Optimize preview rendering: lazy loading and canvas cleanup to handle 10+ models in view.

## Phase 3: Integration & Actions

- [x] T008 Add "Save to Library" action after a successful calculation.
- [x] T009 Implement "Calculate from Library" to trigger the Slicer Motor using a stored piece.
- [x] T010 Add search and filtering by material/model name in the gallery.

---

## Dependencies
1. Backend file management (already available from STL Upload).
2. Studio Design System (Cards and Shadows tokens).
