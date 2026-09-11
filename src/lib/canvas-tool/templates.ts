import type { CanvasProject, EditorMode } from "@/types/canvas-tool"
import { base } from "./template-styles/shared"
import { naive } from "./template-styles/naive"
import { zine } from "./template-styles/zine"
import { tactile } from "./template-styles/tactile"
import { frutiger } from "./template-styles/frutiger"
import { neobrutal } from "./template-styles/neo-brutalism"
import { blackmetal } from "./template-styles/brutal-metal"
import { rawHtml } from "./template-styles/raw-html"
import { neocities } from "./template-styles/neocities"

const blankReact = (): CanvasProject => ({
  ...base("react"),
  name: "React Blank",
  html: `<!-- This tab is mainly for libraries: fonts, <link> tags, <script src="..."> tags. -->
<!-- React + ReactDOM are loaded here as plain globals so your JS tab can use JSX. -->
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<div id="root"></div>`,
  css: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}`,
  js: `function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "white",
        fontSize: 48,
        fontWeight: 700,
      }}
    >
      Hello, Canvas
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`,
})

const blankVanilla = (): CanvasProject => ({
  ...base("vanilla"),
  name: "Vanilla Blank",
  html: `<!-- This tab is your markup, plus any <link>/<script> tags for libraries. -->
<div class="box">Hello, Canvas</div>`,
  css: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111827;
  color: white;
  font-size: 48px;
  font-weight: 700;
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
    label: "Naive Doodle",
    options: [
      { key: "react-naive", label: "React", build: naive.react },
      { key: "vanilla-naive", label: "Vanilla", build: naive.vanilla },
    ],
  },
  {
    label: "Zine Collage",
    options: [
      { key: "react-zine", label: "React", build: zine.react },
      { key: "vanilla-zine", label: "Vanilla", build: zine.vanilla },
    ],
  },
  {
    label: "Tactile Craft",
    options: [
      { key: "react-tactile", label: "React", build: tactile.react },
      { key: "vanilla-tactile", label: "Vanilla", build: tactile.vanilla },
    ],
  },
  {
    label: "Frutiger Aero",
    options: [
      { key: "react-frutiger", label: "React", build: frutiger.react },
      { key: "vanilla-frutiger", label: "Vanilla", build: frutiger.vanilla },
    ],
  },
  {
    label: "Neo-Brutalism",
    options: [
      { key: "react-neobrutal", label: "React", build: neobrutal.react },
      { key: "vanilla-neobrutal", label: "Vanilla", build: neobrutal.vanilla },
    ],
  },
  {
    label: "Black Metal Brutalist",
    options: [
      { key: "react-blackmetal", label: "React", build: blackmetal.react },
      { key: "vanilla-blackmetal", label: "Vanilla", build: blackmetal.vanilla },
    ],
  },
  {
    label: "Raw HTML",
    options: [
      { key: "react-rawhtml", label: "React", build: rawHtml.react },
      { key: "vanilla-rawhtml", label: "Vanilla", build: rawHtml.vanilla },
    ],
  },
  {
    label: "Neocities",
    options: [
      { key: "react-neocities", label: "React", build: neocities.react },
      { key: "vanilla-neocities", label: "Vanilla", build: neocities.vanilla },
    ],
  },
]

export const TEMPLATES: Record<string, () => CanvasProject> = TEMPLATE_GROUPS.reduce(
  (acc, group) => {
    for (const option of group.options) acc[option.key] = option.build
    return acc
  },
  {} as Record<string, () => CanvasProject>
)

export function createDefaultProject(mode: EditorMode = "react"): CanvasProject {
  return mode === "react" ? blankReact() : blankVanilla()
}
