# ORAZAKA RULE: UI/UX DESIGN STANDARDS

## §1 — Design Philosophy

### Core Principles
- **Premium First**: Every screen must feel polished and production-grade. No prototypes, no MVPs.
- **Motion as Language**: Micro-animations communicate state changes, guide attention, and build trust.
- **Information Hierarchy**: Visual weight guides the user's eye — primary → secondary → tertiary.
- **Consistency**: Identical patterns across all pages. No one-off styling.

## §2 — Visual System

### Typography
- Primary: `Inter` (Google Fonts) — body text, labels, inputs.
- Display: `Outfit` (Google Fonts) — headings, marketing copy.
- Monospace: `JetBrains Mono` — code blocks, terminal output.
- No browser default fonts.

### Color System
- Use HSL-based color tokens defined in CSS custom properties.
- No inline hex colors. Reference `--color-*` variables only.
- Dark mode support via `prefers-color-scheme` + class toggle.
- Accent gradient: `linear-gradient(135deg, var(--accent-start), var(--accent-end))`.
- Minimum contrast ratio: 4.5:1 (WCAG 2.1 AA).

### Elevation
- 4-level shadow system:
  - `--shadow-sm`: subtle cards
  - `--shadow-md`: dropdowns, tooltips
  - `--shadow-lg`: modals, dialogs
  - `--shadow-xl`: floating panels

### Spacing
- 4px base unit (`--space-1` = 4px, `--space-2` = 8px, ..., `--space-16` = 64px).
- Consistent padding/margin using spacing tokens only.

## §3 — Component Standards

### Layout Patterns
- **Auth pages**: Split layout — marketing panel (left) + form (right).
- **Dashboard**: Sidebar + main content area with header.
- **Chat**: Full-height with streaming message area + input bar.
- **Settings**: Tab-based navigation with form sections.

### Interactive Elements
- Buttons: primary, secondary, ghost, destructive variants.
- All buttons have hover, active, focus, and disabled states.
- Loading states: skeleton placeholders for async data.
- Toast notifications for all user actions (success, error, warning).

### Forms
- Floating labels or top-aligned labels.
- Real-time validation with error messages below inputs.
- Submit buttons show loading spinner during async operations.

## §4 — Motion & Animation

### Transitions
- Page transitions: fade + subtle slide (200ms ease-out).
- Component mount/unmount: scale + opacity (150ms ease-in-out).
- Hover effects: transform + shadow elevation change (100ms).

### Loading States
- Skeleton screens for initial data fetch.
- Inline spinners for button actions.
- Progress indicators for multi-step flows.
- Streaming text: character-by-character reveal with cursor blink.

### Scroll Behavior
- Smooth scrolling for anchor navigation.
- Parallax effects: subtle, performance-conscious (CSS only).
- Infinite scroll with intersection observer for chat history.

## §5 — Responsive Design

### Breakpoints
| Token | Width | Target |
|:---|:---|:---|
| `--bp-sm` | 640px | Mobile landscape |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Desktop |
| `--bp-xl` | 1280px | Wide desktop |

### Mobile-First
- Base styles target mobile.
- `@media (min-width: ...)` for progressive enhancement.
- Touch targets: minimum 44×44px.
- Sidebar collapses to hamburger menu on mobile.

## §6 — Accessibility (WCAG 2.1 AA)

### Requirements
- All interactive elements have unique, descriptive `id` attributes.
- Form inputs have associated `<label>` elements.
- Color is never the only indicator of state.
- Keyboard navigation for all interactive flows.
- Focus indicators visible and high-contrast.
- ARIA labels on icon-only buttons.
- Skip-to-content link for keyboard users.

## §7 — i18n Visual Rules

- All text comes from `TranslationDictionary` — no hardcoded strings in JSX.
- Layouts must accommodate text expansion (French is ~30% longer than English).
- RTL support structure in place (direction-aware padding/margin).
- Date/number formatting via locale-aware utilities.

## §8 — Date & Time Formatting Standards [ERR-108]

### Mandatory Library
- **`date-fns`** is the exclusive date utility library. No alternatives (moment.js, dayjs, luxon) are permitted.
- All user-facing date formatting, parsing, relative time calculations, and ISO string creation MUST use `date-fns`.

### Approved Patterns
| Operation | Approved Pattern |
|:---|:---|
| Format timestamp | `format(parseISO(timestamp), "HH:mm:ss")` |
| Relative time | `formatDistanceToNow(parseISO(timestamp), { addSuffix: true })` |
| ISO string creation | `formatISO(new Date())` or `formatISO(subMinutes(new Date(), 5))` |
| Date comparison/diff | `differenceInMilliseconds(parseISO(a), parseISO(b))` |
| Epoch-ms for IDs | `Date.now()` — **acceptable** for internal state only |
| Copyright year | `new Date().getFullYear()` — **acceptable** as trivial static pattern |

### Banned Patterns (Blocking Errors)
| Anti-Pattern | Why It's Banned |
|:---|:---|
| `new Date(x).toLocaleTimeString()` | Non-deterministic locale behavior, SSR hydration mismatches |
| `new Date().toISOString()` | Bypasses date-fns standard; use `formatISO()` |
| `new Date(x).getMonth()` / `.getDate()` | Raw native mutation; use date-fns `getMonth()` / `getDate()` |
| Manual regex timestamp parsers | Fragile, non-i18n-aware; use `parseISO()` or `parse()` |
| Hardcoded locale format arrays | Non-scalable; use date-fns locale objects (`fr`, `enUS`) |

### Internationalization
- Use `date-fns/locale` for locale-aware formatting.
- Both `en` and `fr` locales must be supported.
- Format patterns must accommodate text expansion for French (~30% longer).

