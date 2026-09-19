import { reactProject, vanillaProject } from "./shared"

const SIZE = { width: 1920, height: 1080, aspectRatioId: "16:9" }

const FRU_FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">`

const FRU_CSS = `
.poster-split {
  background: linear-gradient(130deg, #7FD8F7 0%, #BFEAF5 55%, #E8F9FF 100%);
  color: #0B3B4A;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.poster-split-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4vmin;
  padding: 6vmin;
}
.poster-split-kicker {
  align-self: flex-start;
  color: #0E8F8F;
  font-weight: 600;
  font-size: clamp(0.75rem, 2vmin, 1rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  background: rgba(255,255,255,0.75);
  border-radius: 999px;
  padding: 1.2vmin 2.6vmin;
}
.poster-split-title {
  font-size: clamp(2.1rem, 8vmin, 5.5rem);
  font-weight: 700;
  line-height: 1.02;
  margin: 0;
  max-width: 100%;
  word-break: break-word;
}
.poster-split-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4vmin;
  font-size: clamp(0.8rem, 2.1vmin, 1rem);
}
.poster-split-meta b {
  display: block;
  color: #0E8F8F;
  font-size: clamp(0.95rem, 2.6vmin, 1.3rem);
}
.poster-split-cta {
  margin-top: 1vmin;
  align-self: flex-start;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #0E8F8F, #0B5C6B);
  color: #fff;
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(0.8rem, 2vmin, 1rem);
  letter-spacing: 0.06em;
  padding: 1.6vmin 3.6vmin;
  box-shadow: 0 1.4vmin 3vmin rgba(11,92,107,0.4);
  cursor: pointer;
}
.poster-split-cta:hover { filter: brightness(1.08); }
.poster-split-rail {
  position: relative;
  min-height: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vmin;
}
.poster-split-panel {
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 5vmin;
  border: 0.5vmin solid rgba(255,255,255,0.85);
  box-shadow: inset 0 0 0 1vmin rgba(255,255,255,0.3), 0 3vmin 6vmin rgba(11,59,74,0.2);
  background:
    radial-gradient(circle at 30% 20%, rgba(11,92,107,0.55), transparent 55%),
    radial-gradient(circle at 80% 85%, rgba(255,213,106,0.5), transparent 50%),
    linear-gradient(135deg, #2FA6B4, #0B5C6B);
  display: flex;
  align-items: center;
  justify-content: center;
}
.poster-split-panel-label {
  display: none;
}
.poster-split-panel .photo-fill {
  border-radius: 4.4vmin;
}
@media (min-aspect-ratio: 4/3) {
  .poster-split { flex-direction: row; }
  .poster-split-rail { padding: 5vmin 6vmin 5vmin 2vmin; }
}
@media (max-aspect-ratio: 3/4) {
  .poster-split-main { padding: 5vmin; }
  .poster-split-panel { min-height: 34vmin; }
}
`

const FRU_JSX = `// Swap this URL for your photo. Paste a hosted image URL, or use an uploaded
// asset variable (upload in the left panel), e.g. const PHOTO = image1.
const PHOTO = "https://placehold.co/1400x1000/bfeaf5/0b5c6b.png?text=Showcase+photo"

function App() {
  return (
    <div className="poster-split">
      <div className="poster-split-main">
        <span className="poster-split-kicker">opening reception</span>
        <h1 className="poster-split-title">Under the lighthouse sky</h1>
        <div className="poster-split-meta">
          <div><b>Fri · May 2</b>6–10pm</div>
          <div><b>Harbor Gallery</b>12 Dockside Ave</div>
          <div><b>Free</b>all welcome</div>
        </div>
        <button className="poster-split-cta">Add to calendar</button>
      </div>
      <div className="poster-split-rail">
        <div className="poster-split-panel">
          <img className="photo-fill" src={PHOTO} alt="Showcase photo" />
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

const NEO_CSS = `
.poster-web {
  background: #1a0a3d;
  color: #fff;
  font-family: Verdana, Geneva, sans-serif;
  width: 100%;
  height: 100%;
  padding: 4vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3vmin;
  background-image:
    radial-gradient(#ffffff40 1px, transparent 1px),
    radial-gradient(#ffffff24 1px, transparent 1px),
    radial-gradient(circle at 50% 0%, #4b2e83, transparent 70%);
  background-size: 50px 50px, 90px 90px, 100% 100%;
  background-position: 0 0, 30px 30px, 0 0;
  background-repeat: repeat, repeat, no-repeat;
}
.poster-web-banner {
  text-align: center;
  font-size: clamp(1.6rem, 6.5vmin, 3.4rem);
  font-weight: bold;
  margin: 0;
  background: linear-gradient(90deg, #ff5252, #ffb347, #fff35c, #6bff6b, #52c7ff, #b47bff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: poster-hue 6s linear infinite;
}
@keyframes poster-hue { to { filter: hue-rotate(360deg); } }
.poster-web-marquee {
  overflow: hidden;
  white-space: nowrap;
  background: #000;
  border: 0.3vmin solid #fff;
  font-size: clamp(0.8rem, 2vmin, 1.1rem);
  color: #6bff6b;
  padding: 1vmin 0;
}
.poster-web-marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: poster-scroll 16s linear infinite;
}
@keyframes poster-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-200%); }
}
.poster-web-content {
  flex: 1;
  min-height: 0;
  background: #fff;
  color: #1a0a3d;
  border: 0.8vmin double #ff52a3;
  border-radius: 2vmin;
  padding: 4vmin;
  max-width: 90vmin;
  margin: auto;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vmin;
}
.poster-web-content h1 {
  font-size: clamp(1.2rem, 4vmin, 2rem);
  margin: 0;
}
.poster-web-content p {
  font-size: clamp(0.8rem, 2.1vmin, 1rem);
  line-height: 1.5;
  margin: 0;
}
.poster-web-links {
  display: flex;
  justify-content: center;
  gap: 1.5vmin;
  flex-wrap: wrap;
}
.poster-web-links a {
  background: #d9d9d9;
  border: 0.4vmin outset #fff;
  padding: 1vmin 2vmin;
  color: #1a0a3d;
  text-decoration: none;
  font-weight: bold;
  font-size: clamp(0.75rem, 1.8vmin, 0.95rem);
}
.poster-web-links a:hover { background: #b3b3ff; }
.poster-web-counter {
  align-self: center;
  background: #000;
  color: #6bff6b;
  font-family: "Courier New", monospace;
  padding: 1vmin 2vmin;
  border: 0.3vmin inset #888;
  letter-spacing: 0.1em;
}
.poster-web-footer {
  text-align: center;
  font-size: clamp(0.7rem, 1.7vmin, 0.85rem);
  color: #ffffff;
  margin-top: auto;
}
@media (min-aspect-ratio: 4/3) {
  .poster-web-content { flex-direction: row; align-items: center; gap: 4vmin; text-align: left; }
  .poster-web-text { flex: 1; }
  .poster-web-links { justify-content: flex-start; }
  .poster-web-counter { align-self: auto; }
}
@media (max-aspect-ratio: 3/4) {
  .poster-web { padding: 3vmin; gap: 2vmin; }
  .poster-web-content { max-width: 100%; padding: 3vmin; }
}
`

const NEO_HTML = `<div class="poster-web">
  <h1 class="poster-web-banner">extreme concert series</h1>
  <div class="poster-web-marquee"><span>★ now booking fall tour dates ★ now booking fall tour dates ★</span></div>
  <div class="poster-web-content">
    <div class="poster-web-text">
      <h1>geocities burst 2026</h1>
      <p>Three floors, seven local bands, one dial-up-modem countdown. Our most ambitious small gig yet.</p>
    </div>
    <div class="poster-web-links">
      <a href="#">tickets</a>
      <a href="#">lineup</a>
      <a href="#">venue</a>
    </div>
  </div>
  <div class="poster-web-counter">you are visitor 000271</div>
  <div class="poster-web-footer">best viewed in netscape navigator 4.0</div>
</div>`

export const eventPoster = {
  react: () =>
    reactProject({
      name: "Event Poster — Split",
      size: SIZE,
      fontLink: FRU_FONT,
      css: FRU_CSS,
      js: FRU_JSX,
    }),
  vanilla: () =>
    vanillaProject({
      name: "Event Poster — Neocities",
      size: SIZE,
      html: NEO_HTML,
      css: NEO_CSS,
    }),
}