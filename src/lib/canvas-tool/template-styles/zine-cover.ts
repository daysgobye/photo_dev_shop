import { reactProject, vanillaProject } from "./shared"

const COVER_SIZE = { width: 1080, height: 1350, aspectRatioId: "4:5" }
const BACK_SIZE = { width: 1080, height: 1080, aspectRatioId: "1:1" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet">`

const COVER_CSS = `
.zine {
  background: #eae6da;
  color: #1c1a16;
  font-family: 'Special Elite', monospace;
  width: 100%;
  height: 100%;
  padding: 5vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.zine-noise {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(#1c1a1626 1px, transparent 1px),
    repeating-linear-gradient(0deg, #1c1a160a 0 2px, transparent 2px 4px);
  background-size: 6px 6px, 100% 100%;
  mix-blend-mode: multiply;
  z-index: 0;
}
.zine-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2vmin;
  border-top: 0.5vmin solid #1c1a16;
  border-bottom: 0.35vmin solid #1c1a16;
  padding: 1.6vmin 0;
  font-size: clamp(0.7rem, 2.2vmin, 1rem);
  text-transform: uppercase;
  letter-spacing: 0.14em;
}
.zine-body {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3vmin;
  padding: 4vmin 0;
}
.zine-kicker {
  font-size: clamp(0.8rem, 2.4vmin, 1.1rem);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #1c1a16;
  color: #f7f4ec;
  align-self: flex-start;
  padding: 1vmin 2.4vmin;
  transform: rotate(-1.5deg);
}
.zine-title {
  font-size: clamp(2.4rem, 12vmin, 7.5rem);
  font-weight: 400;
  line-height: 0.98;
  margin: 0;
  text-transform: uppercase;
  text-shadow: 0.6vmin 0.6vmin 0 #ff3b3b;
  word-break: break-word;
}
.zine-sub {
  font-size: clamp(0.9rem, 2.6vmin, 1.25rem);
  margin: 0;
  max-width: 34ch;
  border-left: 0.8vmin solid #ff3b3b;
  padding-left: 2.5vmin;
}
.zine-foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4vmin;
  font-size: clamp(0.7rem, 2vmin, 0.95rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.zine-barcode {
  display: flex;
  align-items: stretch;
  gap: 0.6vmin;
  height: 8vmin;
}
.zine-barcode span {
  width: 1.3vmin;
  background: #1c1a16;
}
.zine-barcode span:nth-child(2) { width: 0.5vmin; }
.zine-barcode span:nth-child(3) { width: 2.2vmin; }
.zine-barcode span:nth-child(4) { width: 0.7vmin; }
.zine-barcode span:nth-child(5) { width: 1.6vmin; }
.zine-barcode span:nth-child(6) { width: 0.4vmin; }
.zine-barcode span:nth-child(7) { width: 1.1vmin; }
.zine-tape {
  position: absolute;
  left: 8%;
  top: 34%;
  width: 34vmin;
  height: 5vmin;
  background: rgba(255,59,59,0.75);
  transform: rotate(-9deg);
  z-index: 2;
  opacity: 0.9;
}
@media (min-aspect-ratio: 4/3) {
  .zine { padding: 5vmin 9vmin; }
  .zine-body { flex-direction: row; align-items: center; gap: 7vmin; }
  .zine-title { max-width: none; }
}
@media (max-aspect-ratio: 3/4) {
  .zine-title { font-size: clamp(2rem, 10vmin, 6rem); }
}
`

const COVER_JSX = `function App() {
  return (
    <div className="zine">
      <div className="zine-noise" />
      <div className="zine-tape" />
      <div className="zine-head">
        <span>the photocopy review</span>
        <span>est. 1998 · no. 3</span>
      </div>
      <div className="zine-body">
        <div>
          <span className="zine-kicker">inside this issue</span>
          <h1 className="zine-title">Cut, paste &amp; repeat</h1>
          <p className="zine-sub">
            A surviving guide to making small, loud things with a photocopier and a
            stapler. Featuring rewrites, doodles, and dead ends.
          </p>
        </div>
      </div>
      <div className="zine-foot">
        <span>$4 · your local zine cabinet</span>
        <div className="zine-barcode">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

const BACK_CSS = `
.zb {
  background: #f7f4ec;
  color: #1c1a16;
  font-family: 'Special Elite', monospace;
  width: 100%;
  height: 100%;
  padding: 7vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3vmin;
  text-align: center;
}
.zb-logo {
  font-size: clamp(1.4rem, 5vmin, 3rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  border-top: 0.4vmin solid #1c1a16;
  border-bottom: 0.4vmin solid #1c1a16;
  padding: 2vmin 0;
}
.zb-block {
  font-size: clamp(0.75rem, 2.1vmin, 1rem);
  line-height: 1.6;
  max-width: 52ch;
  margin: 0 auto;
}
.zb-block h2 {
  font-size: clamp(0.8rem, 2.3vmin, 1.1rem);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin: 0 0 1vmin;
}
.zb-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.zb-price {
  font-size: clamp(1rem, 3.4vmin, 1.6rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.zb-barcode {
  display: inline-flex;
  align-items: stretch;
  gap: 0.5vmin;
  height: 5vmin;
}
.zb-barcode span { width: 1.2vmin; background: #1c1a16; }
.zb-barcode span:nth-child(2) { width: 0.4vmin; }
.zb-barcode span:nth-child(3) { width: 1.8vmin; }
.zb-barcode span:nth-child(4) { width: 0.6vmin; }
.zb-barcode span:nth-child(5) { width: 1vmin; }
.zb-barcode span:nth-child(6) { width: 2vmin; }
.zb-barcode span:nth-child(7) { width: 0.4vmin; }
@media (min-aspect-ratio: 4/3) {
  .zb { flex-direction: row; align-items: center; text-align: left; padding: 7vmin 10vmin; }
  .zb-logo { border-left: 0.4vmin solid #1c1a16; border-right: 0.4vmin solid #1c1a16; padding: 2vmin 4vmin; }
}
@media (max-aspect-ratio: 3/4) {
  .zb { padding: 5vmin; }
}
`

const BACK_HTML = `<div class="zb">
  <div>
    <h1 class="zb-logo">the photocopy review</h1>
  </div>
  <div class="zb-block">
    <h2>staff &amp; contributors</h2>
    <p class="zb-list">avery · bean · cass · dune<br />printed on one leaking copier<br />stapled by hand in the dark</p>
  </div>
  <div class="zb-block">
    <h2>colophon</h2>
    <p>120 copies, edition no. 3. all comics, poems, and smudges are ours. none of it is precious, so steal it freely.</p>
  </div>
  <div>
    <p class="zb-price">$4 · free if you share</p>
    <div class="zb-barcode"><span /><span /><span /><span /><span /><span /><span /></div>
  </div>
</div>`

export const zine = {
  react: () =>
    reactProject({
      name: "Zine Cover",
      size: COVER_SIZE,
      fontLink: FONT,
      css: COVER_CSS,
      js: COVER_JSX,
    }),
  vanilla: () =>
    vanillaProject({
      name: "Zine Back Cover",
      size: BACK_SIZE,
      fontLink: FONT,
      html: BACK_HTML,
      css: BACK_CSS,
    }),
}