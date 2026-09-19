import type { CanvasProject, EditorMode } from "@/types/canvas-tool"

export interface TemplateSize {
  width: number
  height: number
  aspectRatioId: string
}

const DEFAULT_SIZE: TemplateSize = {
  width: 1080,
  height: 1080,
  aspectRatioId: "1:1",
}

export function base(
  mode: EditorMode,
  size: TemplateSize = DEFAULT_SIZE
): Omit<CanvasProject, "html" | "css" | "js" | "name"> {
  return {
    formatVersion: 1,
    mode,
    width: size.width,
    height: size.height,
    aspectRatioId: size.aspectRatioId,
    assets: [],
    fonts: [],
  }
}

/** Minimal reset shared by every template so the canvas fills edge-to-edge. */
export const RESET_CSS = `* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; overflow: hidden; }
#root { width: 100%; height: 100%; }
.photo-fill { display: block; width: 100%; height: 100%; object-fit: cover; }`

/**
 * The three aspect-ratio breakpoints every template's reflow is built on:
 *   tall:  @media (max-aspect-ratio: 3/4)
 *   wide:  @media (min-aspect-ratio: 4/3)
 *   between: the default "squarish" layout.
 * The preview iframe is always exactly width×height, so these fire on resize.
 * Split layouts stack in tall mode; bands and grids widen in wide mode.
 * Type scales with vmin + clamp(). Each template writes the exact queries it
 * needs, following this convention.
 */
const REACT_CDN = `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>`

export interface ReactTemplateOptions {
  name: string
  size: TemplateSize
  css: string
  js: string
  fontLink?: string
}

export function reactProject(opts: ReactTemplateOptions): CanvasProject {
  return {
    ...base("react", opts.size),
    name: `${opts.name} (React)`,
    html: `${opts.fontLink ?? ""}
${REACT_CDN}
`,
    css: `${RESET_CSS}
${opts.css}`,
    js: opts.js,
  }
}

export interface VanillaTemplateOptions {
  name: string
  size: TemplateSize
  html: string
  css: string
  js?: string
  fontLink?: string
}

export function vanillaProject(opts: VanillaTemplateOptions): CanvasProject {
  return {
    ...base("vanilla", opts.size),
    name: `${opts.name} (Vanilla)`,
    html: `${opts.fontLink ?? ""}
${opts.html}
`,
    css: `${RESET_CSS}
${opts.css}`,
    js:
      opts.js ??
      `// Static markup — no JS needed here. Edit the HTML tab to change the
// text, or the CSS tab to tweak colors, spacing, and shapes.`,
  }
}