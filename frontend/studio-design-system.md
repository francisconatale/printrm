# studio-design-analysis (Version Alpha)

A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF Pro Display headlines with negative letter-spacing and a single Action Blue (#0066cc) interactive color.

## Visual Principles

- **Photography-first:** UI chrome recedes so the product can speak.
- **Museum Gallery feel:** Edge-to-edge tiles with alternating canvases.
- **Signature Shadow:** Only one shadow in the system, under product imagery.
- **Action Blue:** Single interactive color (#0066cc) for all CTAs and links.
- **Studio Tight Typography:** Negative letter-spacing on display headlines.

## Colors

| Token | Hex | Use |
|---|---|---|
| `primary` | `#0066cc` | Action Blue, all interactive elements |
| `ink` | `#1d1d1f` | Main text on light surfaces |
| `canvas` | `#ffffff` | Pure white background |
| `parchment`| `#f5f5f7` | Off-white background for tiles/footer |
| `tile-1` | `#272729` | Main dark tile background |
| `black` | `#000000` | Global nav and void backgrounds |

## Typography (using Inter as substitute)

- **Hero Display:** 56px, weight 600, -0.025em tracking.
- **Display Lg:** 40px, weight 600, -0.01em tracking.
- **Body:** 17px, weight 400, 1.47 line-height.

## Spacing

- Base 8px system.
- Section padding: 80px vertical.
- Card padding: 24px.

## Implementation details

The implementation lives in `frontend/src/studio-theme.css` and the main view is `frontend/src/components/studio-dashboard.tsx`.

