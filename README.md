# Robot Builder (Vanilla OOP)

A fully client-side robot builder game implemented with plain HTML, CSS, and JavaScript.

## Features

- Object-oriented architecture with focused classes.
- Explicit event contracts via centralized constants.
- Incremental robot rendering (non-visual updates do not recreate robot parts).
- View lifecycle safety (`init` + `mount/unmount/destroy`) to avoid listener duplication.
- Toddler-first gameplay defaults (safer themes, gentler pacing/audio, larger touch targets).
- Large robot part catalog (18 options per head/body/arms/legs + 16 palettes).
- Immediate movement response and contextual arm choreography.
- Hide-and-seek with real foreground occlusion, hints, timer, and score.
- Engine bodies with smoke/fire exhaust effects.
- Local SVG icons only (no external font/icon/CDN APIs).
- Web Audio SFX/music and speech synthesis prompts.

## Scripts

- `npm run dev` - build `app.js` and start Vite dev server
- `npm run build` - build `app.js` and run Vite production build
- `npm run build:bundle` - bundle `js/main.js` to `app.js` for plain browser runtime
- `npm run build:docs` - generate `docs/` for GitHub Pages publishing
- `npm run pages:prepare` - build docs artifacts for Pages
- `npm run pages:verify` - verify required static docs artifacts exist
- `npm run preview` - preview production build
- `npm run lint` - ESLint
- `npm run test` - unit tests (Vitest)
- `npm run test:e2e` - build bundle and run end-to-end tests (Playwright)
- `npm run check` - lint + unit tests + build + docs artifact validation

## Local file run (no localhost)

1. Run `npm install`
2. Run `npm run build:bundle`
3. Open `index.html` directly in your browser (double-click or drag into browser)

## GitHub Pages deployment (no Actions required)

1. Run `npm run pages:prepare`
2. Run `npm run pages:verify`
3. Commit and push `docs/` to `main`
4. Open repository `Settings -> Pages`
5. Set `Source` to `Deploy from a branch`
6. Set `Branch` to `main`
7. Set folder to `/docs`

Published site URL:

- `https://barbarosavsar.github.io/beren/`

### Troubleshooting

If GitHub shows:

- `Actions is currently unavailable for your repository, and your Pages site requires a Jekyll build step`

switch Pages source to `Deploy from a branch` (`main` + `/docs`) and keep `docs/.nojekyll` committed.

## Structure

- `index.html` - semantic app shell
- `app.js` - browser-ready bundled runtime for direct file opening
- `css/` - base/layout/animations + split component domains (`hud.css`, `controls.css`, `robot-parts.css`, `stage.css`)
- `js/core/` - config modules, `events.js` event contracts, `EventBus`
- `js/controllers/` - app controller + coordinator modules
- `js/domain/` - game and robot state models
- `js/services/` - audio/exhaust/name/scene services (`services/scene/themes.js` data)
- `js/ui/` - stage, HUD, and controls views
- `docs/` - GitHub Pages publish directory (generated)
- `tests/unit/` - unit tests
- `tests/e2e/` - Playwright tests + shared e2e helpers
