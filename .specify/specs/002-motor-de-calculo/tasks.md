# Tasks: Motor de Cálculo (Backend Integration)

**Input**: Updated `plan.md` using Backend PrusaSlicer Wrapper and Domain Separation.

## Phase 0: Domain Profile Setup (Configuration)

- [ ] T000 [P] Create directory structure in `backend/configs/`: `print/`, `filament/`, `printer/`.
- [ ] T000.1 [P] Populate initial `.ini` templates for each category.
- [ ] T000.2 Update `SlicerService.java` to support multiple `--load` arguments in the command line builder.

## Phase 1: API Integration (Frontend-Backend Bridge)

- [ ] T001 [P] Implement `slicer.api.ts` in `frontend/src/features/calculo/api/` to call `POST /api/slice` using defaults from the **Active Profile**.
- [ ] T002 [P] Update `calculo.types.ts` to include `SlicingResult` and `SlicingConfig` types.
- [ ] T003 Create `STLUpload.tsx` component using `shadcn` components for file selection and triggering the slicing process.
- [ ] T003.1 Create `SlicingConfigSelector.tsx` to allow overriding Printer, Filament, and Print profiles from the **Active Profile** during upload.

---

## Phase 2: Financial Logic & Hook Update

- [ ] T004 Update `useCalculo.ts` to handle the async state of slicing (Loading/Error/Success).
- [ ] T005 Update `calculos.utils.ts` to parse backend time formats (e.g., "1h 20m 3s") into decimal hours.
- [ ] T006 Ensure Vitest covers the new time parsing logic and financial edge cases.

---

## Phase 3: Interactive UI 🎯

- [ ] T007 Integrate `STLUpload` into the main dashboard.
- [ ] T008 Update `PiezaForm.tsx` to display backend-calculated values and allow manual overrides.
- [ ] T009 Refine `ResultadoPanel.tsx` to show "Pending calculation" while slicing is in progress.

---

## Phase 4: Validation & Polish

- [ ] T010 [P] Verify performance: Slicing time depends on backend, but UI must stay responsive during the process.
- [ ] T011 [P] Visual Review: Ensure all values are formatted according to `Intl.NumberFormat('es-AR')` and use Mono fonts.
- [ ] T012 End-to-end test: Upload STL -> Get Slicing Data -> Adjust Multiplier -> Verify Price.

---

## Dependencies

1. Backend `/api/slice` must be operational (already present in `backend/`).
2. `001-perfiles-gastos-fijos` must provide the context for costs (kWh, Filament price).
