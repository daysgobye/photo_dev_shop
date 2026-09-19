import { reactProject } from "./shared"

const LANDSCAPE_SIZE = { width: 1200, height: 900, aspectRatioId: "4:3" }
const PORTRAIT_SIZE = { width: 1080, height: 1350, aspectRatioId: "4:5" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap" rel="stylesheet">`

const BA_CSS = `
.ba {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2vmin;
  padding: 4vmin;
  background: #0b0d10;
  color: #e9e9ec;
  font-family: 'Space Grotesk', sans-serif;
}
.ba-panel {
  position: relative;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  border-radius: 1.2vmin;
}
.ba-fill {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ba-label {
  position: absolute;
  left: 1.6vmin;
  top: 1.6vmin;
  margin: 0;
  padding: 0.7vmin 1.4vmin;
  background: rgba(11, 13, 16, 0.72);
  border: 0.2vmin solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: clamp(0.68rem, 1.9vmin, 0.95rem);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
/* The filter panel writes its rules in exactly this marker format — toggle a
   few filters on an uploaded image, copy a snippet, and watch it appear here. */
/* canvas-tool:filter:landscape-filter */
.landscape-filter {
  filter: contrast(1.15) saturate(0.8) sepia(0.35);
}
/* /canvas-tool:filter:landscape-filter */
@media (max-aspect-ratio: 3/4) {
  .ba { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
}
`

const BA_JSX = `// Same photo twice: the left side is untouched, the right side gets its
// whole look from one CSS class. Open the CSS tab and find .landscape-filter.
const PHOTO = "https://picsum.photos/id/1015/1600/1066"

function App() {
  return (
    <div className="ba">
      <figure className="ba-panel">
        <img className="ba-fill" src={PHOTO} alt="Landscape, unfiltered" />
        <figcaption className="ba-label">Original</figcaption>
      </figure>
      <figure className="ba-panel">
        <img className="ba-fill landscape-filter" src={PHOTO} alt="Same photo with CSS filters" />
        <figcaption className="ba-label">Sepia + contrast</figcaption>
      </figure>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

const BW_CSS = `
.bw {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #141414;
  color: #e9e9ec;
  font-family: 'Space Grotesk', sans-serif;
}
.bw-shot {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* canvas-tool:filter:bw-filter */
.bw-filter {
  filter: grayscale(1) contrast(1.12);
}
/* /canvas-tool:filter:bw-filter */
.bw-hud {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2vmin;
  padding: 2vmin 4vmin;
  background: linear-gradient(transparent, rgba(10, 10, 12, 0.82));
  font-size: clamp(0.72rem, 2vmin, 1rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
@media (max-aspect-ratio: 3/4) {
  .bw-hud { font-size: clamp(0.62rem, 2.4vmin, 0.85rem); padding: 2vmin 3vmin; }
}
@media (min-aspect-ratio: 4/3) {
  .bw-hud { font-size: clamp(0.9rem, 2vmin, 1.4rem); }
}
`

const BW_JSX = `// A classic B&W print: grayscale + a touch of contrast. The whole look lives
// in .bw-filter in the CSS tab.
const PHOTO = "https://picsum.photos/id/823/1080/1350"

function App() {
  return (
    <div className="bw">
      <img className="bw-shot bw-filter" src={PHOTO} alt="Portrait, black and white" />
      <div className="bw-hud">
        <span>ILFORD HP5+</span>
        <span>400 · DEV 11:00</span>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const filterShowcase = {
  react: {
    beforeAfter: () =>
      reactProject({
        name: "Filter Showcase — Before / After",
        size: LANDSCAPE_SIZE,
        fontLink: FONT,
        css: BA_CSS,
        js: BA_JSX,
      }),
    portrait: () =>
      reactProject({
        name: "Filter Showcase — Portrait B&W",
        size: PORTRAIT_SIZE,
        fontLink: FONT,
        css: BW_CSS,
        js: BW_JSX,
      }),
  },
}
