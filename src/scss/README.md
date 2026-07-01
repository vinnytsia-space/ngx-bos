# Global styles (Tailwind entry + minimal SCSS)

This folder contains the **global stylesheet entry** for the app.

We use **Tailwind** for styling in templates.
SCSS here is intentionally minimal and only covers:

- runtime CSS variables (tokens)
- font and icon font loading
- a few global defaults (base, scrollbars)
- small accessibility helpers

## Entry point

**File:** `index.scss`

Loaded in this order:

1. `utils/vars` – CSS variables (tokens)
2. `utils/fonts` – Poppins font faces
3. `utils/icons` – Material Icons font + `.material-icons` class
4. `@use 'tailwindcss';` – Tailwind utilities
5. `layout/base` – global html/body defaults + reduced motion behavior
6. `layout/scroll` – scrollbar styling
7. `atom/a11y` – screen reader utilities

## Tailwind is the styling system

- Use Tailwind utilities in templates for layout, spacing, typography, etc.
- Do **not** create new global SCSS for component styling.
- Add component SCSS only when Tailwind can’t cover the case (rare) and keep it local.

## Runtime theming tokens

**File:** `utils/_vars.scss`

We expose a small set of CSS variables (e.g. `var(--c-bg-primary)`) that can be changed at runtime via attributes on `<html>`:

- `data-mode="dark"` – overrides surface/text/border tokens
- `data-density="compact"` – reduces spacing tokens
- `data-radius="square"` – removes rounding tokens

These tokens exist to support consistent colors/backgrounds and a few global behaviors
(scrollbars, body background, focus ring), not to replace Tailwind.

## Accessibility helpers

**File:** `atom/_a11y.scss`

- `.visually-hidden` – hide visually but keep for screen readers
- `.visually-hidden-focusable` – hidden unless focused (e.g. skip link)

Example:

```html
<a class="visually-hidden-focusable" href="#main">Skip to content</a>
```
