import { base, RESET_CSS } from "./shared"
import type { CanvasProject } from "@/types/canvas-tool"

const CSS = `${RESET_CSS}
.rawhtml-page {
  font-family: "Times New Roman", Times, serif;
  color: #000;
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 6vmin 8vmin;
  overflow: auto;
}
.rawhtml-page h1 {
  font-size: clamp(1.4rem, 5vmin, 2.4rem);
  font-weight: bold;
  margin: 0 0 0.4em;
}
.rawhtml-page p, .rawhtml-page li {
  font-size: clamp(0.85rem, 2.2vmin, 1.05rem);
  line-height: 1.5;
}
.rawhtml-page p { margin: 0.8em 0; }
.rawhtml-page a { color: #0000EE; text-decoration: underline; }
.rawhtml-page a:visited { color: #551A8B; }
.rawhtml-page hr { border: 1px inset #808080; margin: 1.2em 0; }
.rawhtml-btn {
  font-family: inherit;
  font-size: 1em;
  padding: 3px 12px;
  background: #d9d9d9;
  border: 2px outset #fff;
  box-shadow: inset -1px -1px #808080, inset 1px 1px #fff;
  cursor: pointer;
}
.rawhtml-btn:active { border-style: inset; }
.rawhtml-footer { font-size: 0.8rem; color: #555; font-family: monospace; }
`

const BODY_VANILLA = `<div class="rawhtml-page">
  <h1>Welcome to My Page</h1>
  <hr />
  <p>This looks like a totally unstyled HTML page — but it's actually a deliberate design, laid out to stay centered and readable no matter what size you export. Edit this text to say whatever you want.</p>
  <ul>
    <li>First point about the thing</li>
    <li>Second point about the thing</li>
    <li>Third point, because three is a good number</li>
  </ul>
  <p><button class="rawhtml-btn">Submit</button></p>
  <p><a href="#">This is a link</a> — click here to learn more.</p>
  <hr />
  <p class="rawhtml-footer">Last updated: today</p>
</div>`

function bodyReactJsx(): string {
  return `function App() {
  return (
    <div className="rawhtml-page">
      <h1>Welcome to My Page</h1>
      <hr />
      <p>This looks like a totally unstyled HTML page — but it's actually a deliberate design, laid out to stay centered and readable no matter what size you export. Edit this text to say whatever you want.</p>
      <ul>
        <li>First point about the thing</li>
        <li>Second point about the thing</li>
        <li>Third point, because three is a good number</li>
      </ul>
      <p><button className="rawhtml-btn">Submit</button></p>
      <p><a href="#">This is a link</a> — click here to learn more.</p>
      <hr />
      <p className="rawhtml-footer">Last updated: today</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`
}

export const rawHtml = {
  react: (): CanvasProject => ({
    ...base("react"),
    name: "Raw HTML (React)",
    html: `<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<div id="root"></div>`,
    css: CSS,
    js: bodyReactJsx(),
  }),
  vanilla: (): CanvasProject => ({
    ...base("vanilla"),
    name: "Raw HTML (Vanilla)",
    html: BODY_VANILLA,
    css: CSS,
    js: `// Static markup — no JS needed. Edit the HTML tab to change the text.`,
  }),
}
