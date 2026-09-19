# Plan: Fix PNG/JPEG export dropping CSS filters and vignette

## Problem

CSS image-filter tool effects do not appear in exported PNG/JPEG. Live preview,
the main preview iframe, and HTML export are all correct.

**Root cause (confirmed):** the export rasterizer is html2canvas 1.4.1, which
does not implement `box-shadow` (our vignette is `box-shadow: inset ...`) nor
`filter` (blur, grayscale, sepia, contrast, brightness, saturate, hue-rotate,
invert, opacity, drop-shadow). Both are in its documented unsupported list.

## Outcome (implemented)

Swapped the rasterizer to `html2canvas-pro@2.4.3` and **vendored a locally
patched copy** at `public/vendor/html2canvas-pro-2.4.3.min.js`.

### Second bug found during verification

After the swap, reproduction in headless Chromium showed pro 2.4.3 supports
`grayscale`/`sepia`/`invert`/`brightness`/`contrast` but silently drops `blur()`
and `hue-rotate()`. Root cause is in pro's `filter` property parser
(`src/css/property-descriptors/filter.ts`): `renderFilterArgs` already appends
the unit for dimension tokens (`"4px"`, `"90deg"`), but the parser appends it
again -- emitting invalid `blur(4pxpx)` / `hue-rotate(90degdeg)` which canvas
ignores. No published pro version (2.0.0-2.4.3) avoids it; 2.2.1+ only added
percentage-function support.

The vendored file removes the two redundant suffixes. Patch header documents it
for future upgrades. Decision to keep an html2canvas-family renderer (rather than
SVG/foreignObject libs) is unchanged: it draws text with the live page's loaded
fonts, so Google Fonts / uploaded fonts stay pixel-identical.

### Change

`src/lib/canvas-tool/build-preview-doc.ts` now loads
`${import.meta.env.BASE_URL}vendor/html2canvas-pro-2.4.3.min.js` (same-origin,
no CDN). The global `window.html2canvas`, the options passed (`backgroundColor`,
`useCORS`, `width`, `height`, `windowWidth`, `windowHeight`), and the
postMessage capture protocol are unchanged. No new npm dependency.

The CDN `html2canvas@1.4.1` script and the API are otherwise identical.

## Caveat to validate

Our **Drop shadow** effect emits `filter: drop-shadow(...)`. html2canvas-pro had
a bug history with routing `drop-shadow` through the canvas 2D context (canvas
taint, then "not rendered"); both were addressed by v2.2.x, and we pin 2.4.3.
Spike-test this one effect. If still flaky, the fallback is to emit a real
`box-shadow` for the drop-shadow effect instead of the filter function.

## Verification

1. `npm run build` (authoritative typecheck via `tsc -b`).
2. `npm test` (expect 3 files / 175 tests to still pass; existing tests do not
   cover rasterization, so this is a regression guard only).
3. Manual: open both **Filter Showcase** templates, then for each effect
   (vignette + every simple filter + drop-shadow) export PNG and JPEG and confirm
   the effect is present in the downloaded image.
4. Confirm Google Fonts text still renders correctly in exports, and test one
   user-pasted remote (picsum) image to confirm `useCORS` still works.

## Risk / rollback

Very low. Rollback is reverting the single URL string to
`html2canvas@1.4.1`.

## Out of scope

Fully supporting CSS the browser can paint but neither lib can (e.g.
`backdrop-filter`). Not used by this feature.
