# Robot Builder (Vanilla OOP)

A fully client-side robot builder app implemented with plain HTML, CSS, and JavaScript.

## Features

- Object-oriented architecture with small focused classes.
- Scene switching, palette switching, size presets, randomize, movement, dance mode.
- Engine bodies with smoke/fire exhaust effects.
- Hide-and-seek mini game with timer and score.
- Local SVG icons only (no external font/icon/CDN APIs).
- Web Audio based SFX/music and speech synthesis announcements.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - ESLint
- `npm run test` - unit tests (Vitest)
- `npm run test:e2e` - end-to-end smoke tests (Playwright)
- `npm run check` - lint + unit tests + build

## Structure

- `index.html` - semantic app shell
- `css/` - base/layout/components/animations
- `js/` - core, domain, services, ui, controllers
- `assets/icons.svg` - local icon sprite
- `tests/unit/` - unit tests
- `tests/e2e/` - Playwright smoke tests
