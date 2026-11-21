# Karan Gupta — Game Developer Portfolio

A standalone portfolio for game and XR development, built with React and Vite. Its required project images and videos are included in `public/assets/`.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually [http://localhost:5173/](http://localhost:5173/)).

## Build

```bash
npm run build     # outputs a static site to dist/
npm run preview   # serves dist/ locally to check the build
```

The build uses relative paths, so `dist/` can be deployed to any static host, including a GitHub Pages subpath.

## Editing content

- **Projects, toolkit, stats, contact links:** `src/data.js`. Adding a project there automatically updates the cards, filter counts, numbering, and media gallery.
- **Sections:** `src/components/`, one component per section.
- **Quest HUD, XP, and checkpoint toasts:** `src/hooks/useQuest.js`.
- **Styles:** `src/styles.css`.
- **Images and videos:** `public/assets/`, referenced as `assets/...` in `src/data.js`.

## Courier Run (mini-game page)

`play.html` is a second page with a small original endless runner: jump over glitch blocks, duck under drones, and beat your best score, which is saved in the browser.

- **Page layout:** `src/play/PlayPage.jsx` and `src/play/play.css`
- **Game loop, input, overlays:** `src/play/RunnerGame.jsx`
- **Rules and physics** (pure logic, tweak the constants at the top): `src/play/game/engine.js`
- **Drawing:** `src/play/game/render.js`
- **Home-page link:** `src/components/SideQuest.jsx`, plus the "Play" entry in `navLinks` in `src/data.js`
