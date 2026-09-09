import type { CanvasProject, EditorMode } from "@/types/canvas-tool"

function base(mode: EditorMode): Omit<CanvasProject, "html" | "css" | "js" | "name"> {
  return {
    formatVersion: 1,
    mode,
    width: 1080,
    height: 1080,
    aspectRatioId: "1:1",
    assets: [],
  }
}

export const TEMPLATES: Record<string, () => CanvasProject> = {
  "react-blank": () => ({
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
  }),

  "vanilla-blank": () => ({
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
  }),
}

export function createDefaultProject(mode: EditorMode = "react"): CanvasProject {
  return mode === "react" ? TEMPLATES["react-blank"]() : TEMPLATES["vanilla-blank"]()
}
