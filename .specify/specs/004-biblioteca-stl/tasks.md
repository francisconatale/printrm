# Tasks: Biblioteca de Piezas (STL)

**Input**: Sprint 2 Plan (`.specify/memory/plan.md`)
**Constitution**: Studio Constitution v3.1.0

## Phase 1: Storage & Gallery Setup (Backend/Frontend)

- [ ] T001 [P] Implement `PiezaSTL` Entity in Backend (Name, FilePath, Metadata).
- [ ] T002 [P] Create `PiezaController` for basic CRUD of model records.
- [ ] T003 Design `STLCard.tsx` following Studio layout (monochromatic, hairline border, shadow-signature on hover).
- [ ] T004 Create `PiezasGalleryView.tsx` with a responsive grid layout.

## Phase 2: 3D Visualization 🎯

- [ ] T005 [P] Setup `@react-three/fiber` and `@react-three/drei` in the frontend.
- [ ] T006 Implement `STLPreview.tsx` (A minimalist, monochromatic 3D viewer for the cards).
- [ ] T007 Optimize preview rendering: lazy loading and canvas cleanup to handle 10+ models in view.

## Phase 3: Integration & Actions

- [ ] T008 Add "Save to Library" action after a successful calculation.
- [ ] T009 Implement "Calculate from Library" to trigger the Slicer Motor using a stored piece.
- [ ] T010 Add search and filtering by material/model name in the gallery.

---

## Dependencies
1. Backend file management (already available from STL Upload).
2. Studio Design System (Cards and Shadows tokens).
