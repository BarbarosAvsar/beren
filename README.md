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

- `npm run dev` - build `app.js` and start Vite dev server
- `npm run build` - build `app.js` and run Vite production build
- `npm run build:bundle` - bundle `js/main.js` to `app.js` for plain browser runtime
- `npm run build:docs` - generate `docs/` for GitHub Pages publishing
- `npm run preview` - preview production build
- `npm run lint` - ESLint
- `npm run test` - unit tests (Vitest)
- `npm run test:e2e` - build bundle and run end-to-end smoke tests (Playwright)
- `npm run check` - lint + unit tests + build + docs artifact validation

## Local file run (no localhost)

1. Run `npm install`
2. Run `npm run build:bundle`
3. Open `index.html` directly in your browser (double-click or drag into browser)

## GitHub Pages deployment

1. Run `npm run build:docs`
2. Commit and push `docs/` to `main`
3. Open repository `Settings -> Pages`
4. Set `Source` to `Deploy from a branch`
5. Set `Branch` to `main`
6. Set folder to `/docs`

Published site URL:

- `https://barbarosavsar.github.io/beren/`

## Structure

- `index.html` - semantic app shell
- `app.js` - browser-ready bundled runtime for direct file opening
- `css/` - base/layout/components/animations
- `js/` - core, domain, services, ui, controllers
- `docs/` - GitHub Pages publish directory (generated)
- `tests/unit/` - unit tests
- `tests/e2e/` - Playwright smoke tests
