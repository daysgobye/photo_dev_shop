import type { CanvasProject, EditorMode } from "@/types/canvas-tool"
import { flyer } from "./template-styles/flyer"
import { instagramPost } from "./template-styles/instagram-post"
import { zine } from "./template-styles/zine-cover"
import { storyCover } from "./template-styles/story-cover"
import { eventPoster } from "./template-styles/event-poster"
import { menu } from "./template-styles/menu"
import { photoPrint } from "./template-styles/photo-print"
import { businessCard } from "./template-styles/business-card"
import { businessCardSheet } from "./template-styles/business-card-sheet"
import { stickerSheet } from "./template-styles/sticker-sheet"
import { filterShowcase } from "./template-styles/filter-showcase"

const blankReact = (): CanvasProject => ({
  formatVersion: 1,
  mode: "react",
  name: "Blank (React)",
  width: 1080,
  height: 1080,
  aspectRatioId: "1:1",
  assets: [],
  fonts: [],
  html: `<!-- This tab is mainly for libraries: fonts, <link> tags, <script src="..."> tags. -->
<!-- React + ReactDOM are loaded here as plain globals so your JS tab can use JSX. -->
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<div id="root"></div>`,
  css: `html, body { margin: 0; height: 100%; }
#root { width: 100%; height: 100%; }
body {
  font-family: system-ui, sans-serif;
}
.blank-hero {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vmin;
  background: #111827;
  color: white;
  font-size: clamp(2rem, 6vmin, 4rem);
  font-weight: 700;
  text-align: center;
}
.blank-hero small {
  font-size: clamp(0.85rem, 2.4vmin, 1.25rem);
  font-weight: 400;
  color: #9ca3af;
}
@media (max-aspect-ratio: 3/4) {
  .blank-hero { font-size: clamp(1.6rem, 7vmin, 2.6rem); }
}`,
  js: `function App() {
  return (
    <div className="blank-hero">
      Hello, Canvas
      <small>Pick an aspect ratio up top and watch this reflow.</small>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`,
})

const blankVanilla = (): CanvasProject => ({
  formatVersion: 1,
  mode: "vanilla",
  name: "Blank (Vanilla)",
  width: 1080,
  height: 1080,
  aspectRatioId: "1:1",
  assets: [],
  fonts: [],
  html: `<!-- This tab is your markup, plus any <link>/<script> tags for libraries. -->
<div class="box">Hello, Canvas</div>`,
  css: `html, body { margin: 0; height: 100%; }
body {
  font-family: system-ui, sans-serif;
}
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vmin;
  background: #111827;
  color: white;
  font-size: clamp(2rem, 6vmin, 4rem);
  font-weight: 700;
  text-align: center;
}
.box small {
  font-size: clamp(0.85rem, 2.4vmin, 1.25rem);
  font-weight: 400;
  color: #9ca3af;
}
@media (max-aspect-ratio: 3/4) {
  .box { font-size: clamp(1.6rem, 7vmin, 2.6rem); }
}`,
  js: `// Plain JS — document, window, etc. are all available.
console.log("canvas ready")`,
})

export interface TemplateOption {
  key: string
  label: string
  build: () => CanvasProject
}

export interface TemplateGroup {
  label: string
  options: TemplateOption[]
}

export const TEMPLATE_GROUPS: TemplateGroup[] = [
  {
    label: "Blank",
    options: [
      { key: "react-blank", label: "React", build: blankReact },
      { key: "vanilla-blank", label: "Vanilla", build: blankVanilla },
    ],
  },
  {
    label: "Gig Flyer",
    options: [
      {
        key: "react-flyer",
        label: "React · Neo Brutalism",
        build: flyer.react,
      },
      {
        key: "vanilla-flyer",
        label: "Vanilla · Frutiger Aero",
        build: flyer.vanilla,
      },
    ],
  },
  {
    label: "Instagram Post",
    options: [
      {
        key: "react-igpost",
        label: "React · Naive Doodle",
        build: instagramPost.react,
      },
    ],
  },
  {
    label: "Zine",
    options: [
      { key: "react-zine-cover", label: "React · Cover", build: zine.react },
      {
        key: "vanilla-zine-back",
        label: "Vanilla · Back cover",
        build: zine.vanilla,
      },
    ],
  },
  {
    label: "Story Cover",
    options: [
      {
        key: "react-story",
        label: "React · Tactile Craft",
        build: storyCover.react,
      },
    ],
  },
  {
    label: "Event Poster",
    options: [
      {
        key: "react-poster-split",
        label: "React · Split image + text",
        build: eventPoster.react,
      },
      {
        key: "vanilla-poster-neocities",
        label: "Vanilla · Neocities",
        build: eventPoster.vanilla,
      },
    ],
  },
  {
    label: "Menu",
    options: [
      {
        key: "vanilla-menu",
        label: "Vanilla · Price List",
        build: menu.vanilla,
      },
    ],
  },
  {
    label: "Photo Print",
    options: [
      {
        key: "react-photo-print",
        label: "React · Film Strip",
        build: photoPrint.react,
      },
    ],
  },
  {
    label: "Business Card",
    options: [
      {
        key: "react-business-card",
        label: "React · Neo Brutalism",
        build: businessCard.react,
      },
      {
        key: "react-business-card-sheet",
        label: "React · Letter Sheet",
        build: businessCardSheet.react,
      },
    ],
  },
  {
    label: "Sticker Sheet",
    options: [
      {
        key: "react-sticker-sheet",
        label: "React · Die Cut",
        build: stickerSheet.react,
      },
    ],
  },
  {
    label: "Filter Showcase",
    options: [
      {
        key: "react-filter-before-after",
        label: "React · Before / After",
        build: filterShowcase.react.beforeAfter,
      },
      {
        key: "react-filter-portrait",
        label: "React · Portrait B&W",
        build: filterShowcase.react.portrait,
      },
    ],
  },
]

export const TEMPLATES: Record<string, () => CanvasProject> =
  TEMPLATE_GROUPS.reduce(
    (acc, group) => {
      for (const option of group.options) acc[option.key] = option.build
      return acc
    },
    {} as Record<string, () => CanvasProject>
  )

export function createDefaultProject(
  mode: EditorMode = "react"
): CanvasProject {
  return mode === "react" ? blankReact() : blankVanilla()
}
