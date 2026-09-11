import type { CanvasProject, EditorMode } from "@/types/canvas-tool"

export function base(mode: EditorMode): Omit<CanvasProject, "html" | "css" | "js" | "name"> {
  return {
    formatVersion: 1,
    mode,
    width: 1080,
    height: 1080,
    aspectRatioId: "1:1",
    assets: [],
    fonts: [],
  }
}

/** Minimal reset shared by every template so the canvas fills edge-to-edge. */
export const RESET_CSS = `* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }`

/**
 * Shared skeleton for the "hero card" style templates (badge + card + title +
 * subtitle + CTA + image slot). Sized with vmin/clamp() so it holds up across
 * every built-in aspect ratio — only each theme's colors/shapes differ.
 */
export const HERO_BASE_CSS = `${RESET_CSS}
.tpl-stage {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6vmin;
}
.tpl-decor {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.tpl-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.8vmin;
}
.tpl-title {
  font-size: clamp(1.75rem, 7vmin, 4.5rem);
  line-height: 1.05;
  margin: 0;
  max-width: 100%;
  word-break: break-word;
}
.tpl-subtitle {
  font-size: clamp(0.9rem, 2.6vmin, 1.3rem);
  margin: 0;
  max-width: 58ch;
}
.tpl-cta {
  font-size: clamp(0.8rem, 2.2vmin, 1.05rem);
  padding: 1.4vmin 3.2vmin;
  cursor: pointer;
  border: none;
  align-self: flex-start;
}
.tpl-badge {
  position: absolute;
  top: 5vmin;
  right: 5vmin;
  z-index: 3;
  font-size: clamp(0.7rem, 1.8vmin, 1rem);
  padding: 1vmin 2.4vmin;
  white-space: nowrap;
}
.tpl-image-slot {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  margin-top: 1vmin;
}
`

export interface HeroContent {
  badge: string
  title: string
  subtitle: string
  cta: string
}

export interface HeroThemeOptions {
  name: string
  themeClass: string
  fontLink: string
  themeCss: string
  content: HeroContent
}

function heroMarkupVanilla(themeClass: string, content: HeroContent): string {
  return `<div class="tpl-stage ${themeClass}">
  <div class="tpl-decor"></div>
  <span class="tpl-badge">${content.badge}</span>
  <div class="tpl-card">
    <h1 class="tpl-title">${content.title}</h1>
    <p class="tpl-subtitle">${content.subtitle}</p>
    <button class="tpl-cta">${content.cta}</button>
    <!-- No image uploaded yet — this slot is just a decorative placeholder.
         Upload an image (left panel) and set this div's background, e.g.
         style="background-image: url(image1)", or swap it for an <img>. -->
    <div class="tpl-image-slot"></div>
  </div>
</div>`
}

function heroMarkupReact(themeClass: string, content: HeroContent): string {
  return `function App() {
  return (
    <div className="tpl-stage ${themeClass}">
      <div className="tpl-decor" />
      <span className="tpl-badge">${content.badge}</span>
      <div className="tpl-card">
        <h1 className="tpl-title">${content.title}</h1>
        <p className="tpl-subtitle">${content.subtitle}</p>
        <button className="tpl-cta">${content.cta}</button>
        {/* No image uploaded yet — this is just a placeholder. Upload an
            image (left panel) and set this div's backgroundImage using its
            variable, e.g. "url(" + image1 + ")", or swap it for an <img>. */}
        <div className="tpl-image-slot" />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`
}

/** Builds a matching React + vanilla template pair for a "hero card" theme. */
export function buildHeroTheme(opts: HeroThemeOptions): {
  react: () => CanvasProject
  vanilla: () => CanvasProject
} {
  const css = `${HERO_BASE_CSS}\n${opts.themeCss}`

  return {
    react: () => ({
      ...base("react"),
      name: `${opts.name} (React)`,
      html: `${opts.fontLink}
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<div id="root"></div>`,
      css,
      js: heroMarkupReact(opts.themeClass, opts.content),
    }),
    vanilla: () => ({
      ...base("vanilla"),
      name: `${opts.name} (Vanilla)`,
      html: `${opts.fontLink}
${heroMarkupVanilla(opts.themeClass, opts.content)}`,
      css,
      js: `// Static markup — no JS needed here. Edit the HTML tab to change the
// text, or the CSS tab to tweak colors, spacing, and shapes.`,
    }),
  }
}
