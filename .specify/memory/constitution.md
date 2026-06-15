<!-- 
Sync Impact Report:
- Version change: 1.0.0 -> 2.0.0
- List of modified principles:
  - PRINCIPLE_1: I. Library-First -> I. Spatial Separation
  - PRINCIPLE_2: II. CLI Interface -> II. Intentional Color Usage
  - PRINCIPLE_3: III. Test-First (NON-NEGOTIABLE) -> III. Super-Card Shell Architecture
  - PRINCIPLE_4: IV. Integration Testing -> IV. Balanced Typography & Spacing
  - PRINCIPLE_5: V. Observability -> V. Minimalist Components & Data Display
- Added sections: UI Specification, Development Quality Gates
- Removed sections: N/A
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Updated
  - .specify/templates/spec-template.md: ✅ Updated
  - .specify/templates/tasks-template.md: ✅ Updated
- Follow-up TODOs: 
  - RATIFICATION_DATE set to 2026-06-15.
-->

# 3D Finance Constitution

## Core Principles

### I. Spatial Separation
UI elements are distinguished primarily through whitespace and alignment rather than borders. Borders are restricted to 0.5px and appear only where strictly necessary for clarity.

### II. Intentional Color Usage
The UI follows a strict 95/4/1 distribution: 
- 95% Slate (neutral backgrounds, text, and separators).
- 4% Semantic (Green for income, Red for expenses, Amber for warnings).
- 1% Indigo (Primary CTA, Logo, and active navigation).
Indigo is never used in body text; semantic colors are never used decoratively.

### III. Super-Card Shell Architecture
The application lives within a "Super-Card" container (white background, radius-xl) over a subtle gray background (slate-100). This generates a desktop-native application feel rather than a traditional website.

### IV. Balanced Typography & Spacing
System utilizes the Inter font family with strict adherence to 400 (Regular) and 500 (Medium) weights. Spacing is governed by a strict 8pt grid system; all margins and paddings must be multiples of 4 or 8.

### V. Minimalist Components & Data Display
Monetary figures always use Mono fonts for vertical alignment. Iconography is strictly limited to Tabler Icons (outline style). UI components must maintain density balance—neither too compact nor too airy.

## UI Specification

### Palette
- **Base (Slate):** 900 (Dark text), 100 (Subtle surfaces), 50 (Page background).
- **Accent (Indigo):** 500 (Main), 700 (Hover).
- **Semantic:** Green-500 (Success), Red-500 (Danger), Amber-500 (Warning).

### Typography Scale
- **Heading-1:** 28px/500/-0.5px letter-spacing.
- **Body:** 14px/400.
- **Mono:** 13px/400 (for all financial data).

### Layout
- **Sidebar:** 240px (Fixed).
- **Main Area:** Flex-1 (32px padding).
- **Right Panel:** 300px (Optional activity/summary).

## Development Quality Gates

### Visual Compliance
Every new UI feature must be validated against the 0.5px border rule and the 8pt spacing grid. Focus rings for accessibility must use Indigo-500 with 15% opacity.

### Theme Support
All surfaces and components must explicitly define behavior for both Light and Dark modes. Dark mode must maintain the same Indigo-500 accent but adjust semantic colors for better legibility on dark backgrounds.

## Governance
This constitution serves as the foundational law for all project development. Any implementation that violates these principles must provide a written justification in the Implementation Plan.

### Amendment Procedure
1. Propose changes via a Constitution Amendment PR.
2. Update versioning (MAJOR for principle changes, MINOR for additions, PATCH for clarifications).
3. Update all dependent templates and documentation.

**Version**: 2.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
