# Implementation Plan: Core App Shell and Layout

**Branch**: `001-core-app-shell` | **Date**: 2026-06-15 | **Spec**: `.specify/specs/001-core-app-shell/spec.md`

## Summary

Implement the foundational UI structure for the 3D Finance app. This involves setting up the design system tokens in Tailwind, creating the "Super-Card" container, and building the fixed Sidebar navigation. The goal is to establish the aesthetic baseline (95/4/1 color rule, 0.5px borders, 8pt grid) defined in the Constitution.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1

**Primary Dependencies**: Tailwind CSS 3.4, Lucide React (for initial icons, though spec mentions Tabler), Radix UI (via Shadcn)

**Storage**: N/A

**Testing**: Visual regression and manual audit against 8pt grid and 0.5px border rules.

**Target Platform**: Desktop (Windows Portable App via Electron)

**Project Type**: Web Frontend (part of Electron app)

**Performance Goals**: Instant layout rendering, zero shift.

**Constraints**: 0.5px borders, Inter 400/500 only, 8pt grid system.

## Constitution Check

- [x] **Spatial Separation**: Using whitespace and 0.5px borders.
- [x] **Color Intent**: Implementing Slate palette + 1% Indigo accent.
- [x] **Typography**: Restricting weights to 400/500 in global styles.
- [x] **Grid System**: Tailwind config will prioritize multiples of 4/8.
- [x] **Shell Consistency**: Core task is the Super-Card shell.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/001-core-app-shell/
├── spec.md              # Requirement definition
├── plan.md              # This file
└── tasks.md             # Implementation tasks
```

### Source Code (frontend)

```text
frontend/
├── tailwind.config.js    # Theme extension (colors, border-width)
├── src/
│   ├── index.css        # Global styles & font overrides
│   ├── components/
│   │   ├── layout/      # New layout-specific components
│   │   │   ├── app-shell.tsx
│   │   │   └── sidebar.tsx
│   │   └── ui/          # (Existing) shadcn components
│   └── App.tsx          # Integration point
```

**Structure Decision**: Created a `components/layout` directory to separate structural shell components from atomic UI elements.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Custom 0.5px borders | Required by Design System | Default 1px is too heavy for the "minimalist" goal. |

## Implementation Steps

### Phase 1: Design System Setup
1. **Tailwind Config**: Extend `theme` with:
   - `borderWidth: { '0.5': '0.5px' }`
   - Custom `slate` palette mapping (900, 800, 700, 500, 300, 100, 50).
   - Custom `indigo` accent mapping.
   - Restrict `fontWeight` to 400 and 500.
2. **Global CSS**:
   - Set `font-family` to 'Inter'.
   - Global border override to `0.5px`.
   - Define `--radius-xl: 16px`, `--radius-lg: 12px`, etc.

### Phase 2: Structural Components
1. **AppShell**:
   - Background: `bg-slate-100`.
   - Container: Centered `div` with `max-w-[1440px]`, `bg-white`, `rounded-xl`, `border-0.5`.
2. **Sidebar**:
   - Fixed `240px` width.
   - Logo area with Indigo-500 icon.
   - Nav items with "Active" state (white bg + border-0.5) and hover (bg-slate-100).

### Phase 3: Integration
1. Update `App.tsx` to wrap the health-checked content in the `AppShell`.
2. Ensure the `Dashboard` component fits within the new layout padding (`32px`).
