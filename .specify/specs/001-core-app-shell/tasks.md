# Tasks: Core App Shell and Layout (Studio Edition)

**Input**: Design documents from `.specify/specs/001-core-app-shell/`

**Prerequisites**: plan.md, spec.md, Studio Constitution v3.1.0

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 (Shell), US2 (Sidebar), US3 (Visuals)

## Phase 1: Design System Setup (Monochromatic Studio)

**Purpose**: Establish the visual tokens and global styles for the Studio Edition.

- [x] T001 [P] [US3] Configure `studio-theme.css` with monochromatic variables (`Ink` #1d1d1f, `Hairline` #e0e0e0).
- [x] T002 [P] [US3] Enforce Inter font with "Studio Tight" tracking (-0.022em to -0.025em) and 17px body base.
- [x] T003 [P] [US3] Define global border utilities for 1px Hairline (removing previous 0.5px Slate attempt).

## Phase 2: Foundational Components

**Purpose**: Create the structural shell elements compatible with the Wrapper architecture.

- [x] T004 [US1] Update `frontend/src/components/layout/app-shell.tsx` to act as a simple flex container for Sidebar + Content.
- [x] T005 [US2] Redesign `frontend/src/components/layout/sidebar.tsx` with monochromatic selection style (Ink bar + Black/5 bg).
- [x] T006 [US2] Implement View-Switching state logic in `App.tsx` to navigate between StudioOverview and StudioDashboard.

## Phase 3: Content Integration

**Purpose**: Assemble the functional views within the shell.

- [x] T007 [US1] Create `frontend/src/components/studio-overview.tsx` to preserve the high-impact summary view.
- [x] T008 [US1] Create `frontend/src/components/studio-dashboard.tsx` to act as the primary financial motor.
- [x] T009 [US3] Audit all shadows: Ensure zero shadows on UI components; reserve unique shadow for product imagery.

## Phase 4: Polish & Compliance

**Purpose**: Final audit and refinements.

- [ ] T010 [P] Visual Compliance Review: Verify that no solid blue or high-contrast selection blocks remain.
- [ ] T011 [P] Spacing Audit: Verify 8pt grid consistency across the full-bleed Studio tiles.
- [ ] T012 [P] Wrapper Check: Ensure layout is responsive to the fixed sidebar and scrollable content area.

---

## Dependencies & Execution Order

1. **Phase 1** must be solid as it defines the monochromatic tokens.
2. **Phase 2** establishes the navigation contract used by all future features.
3. **Phase 3** delivers the current MVP state.
4. **Phase 4** is the final visual quality gate.
