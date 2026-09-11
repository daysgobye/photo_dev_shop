import { base, RESET_CSS } from "./shared"
import type { CanvasProject } from "@/types/canvas-tool"

const CSS = `${RESET_CSS}
.neocities-page {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  font-family: Verdana, Geneva, sans-serif;
  color: #fff;
  padding: 4vmin;
  background-color: #1a0a3d;
  background-image:
    radial-gradient(#ffffffcc 1px, transparent 1px),
    radial-gradient(#ffffff66 1px, transparent 1px),
    radial-gradient(circle at 50% 0%, #4b2e83, transparent 70%);
  background-size: 60px 60px, 90px 90px, 100% 100%;
  background-position: 0 0, 30px 30px, 0 0;
  background-repeat: repeat, repeat, no-repeat;
}
.neocities-banner {
  text-align: center;
  font-size: clamp(1.4rem, 6vmin, 3rem);
  font-weight: bold;
  background: linear-gradient(90deg, #ff5252, #ffb347, #fff35c, #6bff6b, #52c7ff, #b47bff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: neocities-hue 6s linear infinite;
  margin-bottom: 2vmin;
}
@keyframes neocities-hue { to { filter: hue-rotate(360deg); } }
.neocities-marquee {
  overflow: hidden;
  white-space: nowrap;
  background: #000;
  border: 2px solid #fff;
  padding: 0.8vmin 0;
  margin-bottom: 3vmin;
}
.neocities-marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: neocities-scroll 14s linear infinite;
  font-size: clamp(0.75rem, 2vmin, 1rem);
  color: #6bff6b;
}
@keyframes neocities-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-200%); }
}
.neocities-content {
  background: #fff;
  color: #1a0a3d;
  border: 6px double #ff52a3;
  border-radius: 6px;
  padding: 5vmin;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}
.neocities-content h1 { font-size: clamp(1.2rem, 4vmin, 2rem); margin: 0 0 0.6em; }
.neocities-content p { font-size: clamp(0.85rem, 2.2vmin, 1.05rem); line-height: 1.5; }
.neocities-links { display: flex; justify-content: center; gap: 1.5vmin; flex-wrap: wrap; margin: 2vmin 0; }
.neocities-links a {
  background: #d9d9d9;
  border: 2px outset #fff;
  padding: 4px 12px;
  color: #1a0a3d;
  text-decoration: none;
  font-weight: bold;
  font-size: clamp(0.75rem, 1.8vmin, 0.95rem);
}
.neocities-links a:hover { background: #b3b3ff; }
.neocities-counter {
  display: inline-block;
  background: #000;
  color: #6bff6b;
  font-family: "Courier New", monospace;
  padding: 4px 10px;
  border: 2px inset #888;
  letter-spacing: 0.1em;
}
.neocities-footer {
  text-align: center;
  font-size: 0.75rem;
  color: #ffffffaa;
  margin-top: 3vmin;
  font-style: italic;
}
`

const BODY_VANILLA = `<div class="neocities-page">
  <div class="neocities-banner">✨ WELCOME TO MY HOMEPAGE ✨</div>
  <div class="neocities-marquee"><span>Thanks for stopping by! Best viewed with an open mind. Don't forget to sign the guestbook! ✦</span></div>
  <div class="neocities-content">
    <h1>Hi, I'm [Your Name]! 👋</h1>
    <p>This is my little corner of the internet. Replace this text with whatever you'd like people to know.</p>
    <div class="neocities-links">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Links</a>
      <a href="#">Guestbook</a>
    </div>
    <div class="neocities-counter">VISITORS: 004201</div>
  </div>
  <div class="neocities-footer">Made with 💜 — best viewed in Netscape Navigator</div>
</div>`

function bodyReactJsx(): string {
  return `function App() {
  return (
    <div className="neocities-page">
      <div className="neocities-banner">✨ WELCOME TO MY HOMEPAGE ✨</div>
      <div className="neocities-marquee">
        <span>Thanks for stopping by! Best viewed with an open mind. Don't forget to sign the guestbook! ✦</span>
      </div>
      <div className="neocities-content">
        <h1>Hi, I'm [Your Name]! 👋</h1>
        <p>This is my little corner of the internet. Replace this text with whatever you'd like people to know.</p>
        <div className="neocities-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Links</a>
          <a href="#">Guestbook</a>
        </div>
        <div className="neocities-counter">VISITORS: 004201</div>
      </div>
      <div className="neocities-footer">Made with 💜 — best viewed in Netscape Navigator</div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`
}

export const neocities = {
  react: (): CanvasProject => ({
    ...base("react"),
    name: "Neocities (React)",
    html: `<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<div id="root"></div>`,
    css: CSS,
    js: bodyReactJsx(),
  }),
  vanilla: (): CanvasProject => ({
    ...base("vanilla"),
    name: "Neocities (Vanilla)",
    html: BODY_VANILLA,
    css: CSS,
    js: `// Static markup — no JS needed. Edit the HTML tab to change the text.`,
  }),
}
