# Photo Dev Shop

**Photoshop for developers.** Design and export images with HTML, CSS, and
JavaScript — the tools you already know — instead of learning a design
application. Nothing new to learn, no proprietary format, and the output is
yours: real markup and stylesheets you can keep shipping.

Live: **[photo.tools.0x86.site](https://photo.tools.0x86.site/)**

You get a fixed-size canvas with three live-edited tabs on the left and a
sandboxed preview on the right. Write markup, style it, drop in your own
images and fonts, then export a PNG, a JPEG, or a single self-contained HTML
file.

## Features

- **Three tabs, one canvas** — HTML, CSS, and JS/JSX edited in CodeMirror and
  rendered together in a sandboxed iframe at an exact pixel size.
- **JSX without a build step** — the JS tab always runs through Babel's React
  preset, so JSX works even in vanilla mode. React mode expects `React` and
  `ReactDOM` as globals from a CDN `<script>` tag.
- **Canvas sizes** — Free, 1:1, 4:5, 16:9, 9:16, and 4:3. Locking a ratio
  derives height from width and vice versa.
- **Image uploads become variables** — drop in a file and it is exposed as a
  global JS variable inside the preview, no import or bundler required.
- **CSS image filters with a live preview** — nine sliders (blur, brightness,
  contrast, grayscale, sepia, saturate, hue rotate, invert, opacity) plus drop
  shadow. Photo Dev Shop injects the generated rule into your CSS tab and hands
  you copy-pasteable React or vanilla snippets.
- **Font uploads become `@font-face`** — woff2, woff, ttf, otf, and eot are
  registered automatically under a sanitized family name, ready to reference by
  name in CSS.
- **17 starting templates** across 11 groups — flyers, Instagram posts, zines,
  story covers, event posters, menus, photo prints, business cards, sticker
  sheets, and filter showcases. Blank, flyer, zine, and poster templates ship in
  both React and vanilla variants; the rest are React-only except the menu, which
  is vanilla.
- **Export three ways** — PNG, JPEG, or a standalone HTML file with everything
  inlined and minified.
- **AI prompt helpers** — build a "start something new" or "change this"
  prompt describing the exact runtime your code will land in (canvas size,
  available variables, registered fonts, mode). Copied to your clipboard.
- **Project JSON** — export and re-import a project, assets and fonts included.
- **Persistent layout** — panel sizes are remembered in `localStorage`.

## Quickstart

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

Then open the printed local URL.

### Scripts

| Script              | What it does                               |
| ------------------- | ------------------------------------------ |
| `bun run dev`       | Vite dev server with HMR                   |
| `bun run build`     | Typecheck, then build to `dist/`           |
| `bun run preview`   | Serve the production build locally         |
| `bun run test`      | Vitest, single run                         |
| `bun run typecheck` | `tsc --noEmit`                             |
| `bun run lint`      | ESLint                                     |
| `bun run format`    | Prettier, including Tailwind class sorting |

## How a design reaches a file

There are two render paths, and keeping them straight is the main thing to
understand about this codebase.

**Preview** — `src/lib/canvas-tool/build-preview-doc.ts` assembles a complete
document on every keystroke: your HTML into `<body>`, your CSS into a `<style>`
tag, each font as an `@font-face` rule _before_ that stylesheet so an upload can
override a same-named family, each asset as a `window[varName]` global, and your
JS through Babel's `react` preset. Rasterization for PNG/JPEG export happens
_inside_ that same iframe: the parent posts a `canvas-tool:capture` message, the
preview replies over `postMessage` with a data URL.

**HTML export** — `src/lib/canvas-tool/build-export-doc.ts` builds a different,
quieter document. JS and CSS are minified through `esbuild-wasm` and inlined,
alongside your HTML, assets, and fonts. It deliberately ships _none_ of the
preview machinery — no Babel, no rasterizer, no `postMessage` listener — so the
file you hand off is standalone.

`build-export-doc.test.ts` guards that separation, so a change that leaks
preview-only code into an export fails the suite.

### The vendored rasterizer

PNG and JPEG exports are drawn by **html2canvas-pro 2.4.3**, vendored at
`public/vendor/html2canvas-pro-2.4.3.min.js` rather than pulled from a CDN.

We ship a _patched_ copy. Upstream 2.4.3 double-appends units in its `filter`
parser, emitting invalid `blur(4pxpx)` and `hue-rotate(90degdeg)` that canvas
silently ignores — which is why Blur and Hue rotate were missing from exports.
The patch removes the two redundant suffixes, and a header comment in the
vendored file documents it. No published version between 2.0.0 and 2.4.3 avoids
the bug.

If you upgrade it, re-check that header comment and those two effects. Keeping
an html2canvas-family renderer rather than an SVG/`foreignObject` one is
deliberate: it draws text with the page's loaded fonts, so Google Fonts and
uploaded fonts stay pixel-identical between preview and export.

## Project layout

```
src/
  lib/canvas-tool/
    build-preview-doc.ts     assembles the live preview document
    build-export-doc.ts      assembles the standalone export
    image-filter-css.ts      filter stack -> CSS rules and snippets
    prompt-builder.ts        AI prompt assembly
    templates.ts             the template catalog
    template-styles/         one module per template
    aspect-ratios.ts  clipboard.ts  esbuild.ts  fonts.ts
    *.test.ts                colocated tests for all of the above
  components/canvas-tool/    the editor, preview, asset, and font panels
  components/ui/             shadcn/ui primitives
  types/canvas-tool.ts       CanvasProject and friends
```

`CanvasProject` (`src/types/canvas-tool.ts`) is the whole document — tabs,
dimensions, assets, and fonts — and it is what project JSON serializes. Keep it
self-contained; that is what makes a project file portable.

## Testing

239 tests, colocated next to what they cover as `*.test.ts`.

```bash
bun run test
```

Coverage is pure logic in `src/lib`: document building, the filter-to-CSS
compiler, font name and format handling, the template catalog, aspect ratios,
prompt assembly, and the clipboard fallback. `clipboard.test.ts` stubs
`navigator` and `document` by hand rather than depending on jsdom.

There are no component tests. The panels are thin enough that their logic lives
in `src/lib`, which is where the tests are.

## Adding shadcn/ui components

```bash
npx shadcn@latest add button
```

Then import with the `@/` alias:

```tsx
import { Button } from "@/components/ui/button"
```

## Known limits

- **Network required.** Babel loads from unpkg, as does anything you add via a
  `<script>` or `<link>` tag. A fully offline preview is not supported.
- **Exports only include what the rasterizer can paint.** `backdrop-filter` and
  similar CSS that browsers render but html2canvas-pro does not will appear in
  the preview and be missing from PNG/JPEG. HTML export is unaffected — it ships
  your real CSS.
- **Nothing autosaves.** Export the project JSON before closing the tab.

## Stack

Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui on Base UI ·
CodeMirror 6 · esbuild-wasm · Vitest
