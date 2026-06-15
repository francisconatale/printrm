# Tasks: Core App Shell and Layout

**Input**: Design documents from `.specify/specs/001-core-app-shell/`

**Prerequisites**: plan.md, spec.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 (Shell), US2 (Sidebar), US3 (Visuals)

## Phase 1: Design System Setup

**Purpose**: Establish the visual tokens and global styles.

- [ ] T001 [P] [US3] Configure Tailwind colors and border widths in `frontend/tailwind.config.js` (add slate/indigo palettes and `0.5` border weight).
- [ ] T002 [P] [US3] Update `frontend/src/index.css` to enforce Inter font, 400/500 weights only, and set global border default to `0.5px`.
- [ ] T003 [P] [US3] Define CSS variables for spacing and radii in `frontend/src/index.css` (radius-xl: 16px, radius-lg: 12px).

## Phase 2: Foundational Components

**Purpose**: Create the structural shell elements.

- [ ] T004 [US1] Create `frontend/src/components/layout/app-shell.tsx` with the `slate-100` background and `radius-xl` Super-Card container.
- [ ] T005 [US2] Create `frontend/src/components/layout/sidebar.tsx` with a fixed `240px` width and the Indigo-500 logo area.
- [ ] T006 [US2] Implement navigation items in `sidebar.tsx` with hover and active states (white bg + 0.5px border for active).

## Phase 3: Integration

**Purpose**: Assemble the shell and integrate with the existing app logic.

- [ ] T007 [US1] Update `frontend/src/App.tsx` to wrap the application content with the new `AppShell`.
- [ ] T008 [US2] Integrate the `Sidebar` into the `AppShell` layout.
- [ ] T009 [US1] Adjust `frontend/src/components/dashboard.tsx` to ensure it renders correctly within the new layout padding (space-8 / 32px).

## Phase 4: Polish & Compliance

**Purpose**: Final audit and refinements.

- [ ] T010 [P] Visual Compliance Review: Audit all borders in the dev server to ensure they are exactly `0.5px`.
- [ ] T011 [P] Spacing Audit: Verify that all margins and paddings in the shell are multiples of 8 (or 4).
- [ ] T012 [P] Color Check: Confirm distribution matches 95% Slate, 4% Semantic, 1% Indigo.

---

## Dependencies & Execution Order

1. **Phase 1** (T001-T003) must be completed first to provide the styling tokens.
2. **Phase 2** (T004-T006) depends on Phase 1 tokens.
3. **Phase 3** (T007-T009) integrates the components created in Phase 2.
4. **Phase 4** (T010-T012) is the final validation.
