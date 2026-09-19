import { reactProject, vanillaProject } from "./shared"

const NEO_SIZE = { width: 1080, height: 1350, aspectRatioId: "4:5" }

const NEO_FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">`

const NEO_CSS = `
.flyer-neo {
  background: #F4EFE1;
  color: #141414;
  font-family: 'Space Grotesk', sans-serif;
  width: 100%;
  height: 100%;
  padding: 6vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4vmin;
}
.flyer-neo-sun {
  position: absolute;
  right: -9vmin;
  top: -9vmin;
  width: 36vmin;
  height: 36vmin;
  border-radius: 50%;
  background: #FFD23F;
  border: 1vmin solid #141414;
  z-index: 0;
}
.flyer-neo-rings {
  position: absolute;
  left: 50%;
  bottom: -20vmin;
  width: 60vmin;
  height: 60vmin;
  border: 1.4vmin solid #141414;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 0;
}
.flyer-neo-head {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4vmin;
}
.flyer-neo-eyebrow {
  align-self: flex-start;
  background: #141414;
  color: #F4EFE1;
  font-size: clamp(0.75rem, 2vmin, 1rem);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 1.2vmin 2.6vmin;
  transform: rotate(-2deg);
}
.flyer-neo-title {
  font-size: clamp(2.6rem, 12.5vmin, 8rem);
  font-weight: 700;
  line-height: 0.92;
  margin: 0;
  text-transform: uppercase;
  max-width: 100%;
  word-break: break-word;
  text-shadow: 0.9vmin 0.9vmin 0 #FF5D5D;
}
.flyer-neo-divider {
  width: 100%;
  height: 1.2vmin;
  background: repeating-linear-gradient(90deg, #141414 0 3.4vmin, transparent 3.4vmin 6vmin);
}
.flyer-neo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6vmin;
  font-size: clamp(0.8rem, 2.4vmin, 1.05rem);
  font-weight: 500;
}
.flyer-neo-meta b {
  display: block;
  font-size: clamp(1.05rem, 3.4vmin, 1.6rem);
  font-weight: 700;
}
.flyer-neo-cta {
  align-self: flex-start;
  margin-top: 2vmin;
  background: #141414;
  color: #F4EFE1;
  border: 0.6vmin solid #141414;
  box-shadow: 1vmin 1vmin 0 #4C9AFF;
  font-family: inherit;
  font-weight: 700;
  font-size: clamp(0.85rem, 2.6vmin, 1.15rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2vmin 4vmin;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.flyer-neo-cta:hover { transform: translate(1vmin, 1vmin); box-shadow: 0 0 0 #4C9AFF; }
@media (min-aspect-ratio: 4/3) {
  .flyer-neo-head {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 7vmin;
  }
  .flyer-neo-words { flex: 1; min-width: 0; }
  .flyer-neo-cta-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 3vmin; }
  .flyer-neo-title { max-width: none; }
}
`

const NEO_JSX = `function App() {
  return (
    <div className="flyer-neo">
      <div className="flyer-neo-sun" />
      <div className="flyer-neo-rings" />
      <div className="flyer-neo-head">
        <div className="flyer-neo-words">
          <span className="flyer-neo-eyebrow">Live music · All ages</span>
          <h1 className="flyer-neo-title">Saturday Night Live Show</h1>
          <div className="flyer-neo-divider" />
          <div className="flyer-neo-meta">
            <div>
              <b>SAT · SEP 27</b>
              Doors 8:00pm
            </div>
            <div>
              <b>The Salt Shed</b>
              401 N Temple St
            </div>
            <div>
              <b>$15 adv</b>
              $20 at door
            </div>
          </div>
        </div>
        <div className="flyer-neo-cta-wrap">
          <button className="flyer-neo-cta">Get tickets</button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

const FRU_CSS = `
.flyer-fru {
  background: linear-gradient(160deg, #7FD8F7 0%, #BFEAF5 60%, #E8F9FF 100%);
  color: #0B3B4A;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  height: 100%;
  padding: 6vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4vmin;
}
.flyer-fru-bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), rgba(255,255,255,0.25) 55%, rgba(255,255,255,0.05));
  border: 0.5vmin solid rgba(255,255,255,0.7);
  pointer-events: none;
}
.flyer-fru-bubble-1 { width: 26vmin; height: 26vmin; top: 6vmin; right: 8vmin; }
.flyer-fru-bubble-2 { width: 12vmin; height: 12vmin; bottom: 14vmin; left: 10vmin; }
.flyer-fru-aura { position: absolute; inset: 0; z-index: 0; }
.flyer-fru-inner {
  position: relative;
  z-index: 1;
  background: rgba(255,255,255,0.6);
  border-radius: 6vmin;
  border: 0.5vmin solid rgba(255,255,255,0.8);
  backdrop-filter: blur(2px);
  padding: 6vmin;
  box-shadow: 0 4vmin 8vmin rgba(11,59,74,0.18);
  display: flex;
  flex-direction: column;
  gap: 3vmin;
}
.flyer-fru-kicker {
  color: #0E8F8F;
  font-weight: 600;
  font-size: clamp(0.75rem, 2.1vmin, 1rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
.flyer-fru-title {
  font-size: clamp(2.1rem, 10vmin, 6.5rem);
  font-weight: 600;
  line-height: 1.02;
  margin: 0;
  color: #0B3B4A;
}
.flyer-fru-lines {
  display: flex;
  flex-wrap: wrap;
  gap: 4vmin;
  font-size: clamp(0.85rem, 2.4vmin, 1.05rem);
}
.flyer-fru-lines b { color: #0E8F8F; }
.flyer-fru-cta {
  align-self: flex-start;
  margin-top: 1vmin;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #0E8F8F, #0B5C6B);
  color: #fff;
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(0.8rem, 2.3vmin, 1.05rem);
  letter-spacing: 0.06em;
  padding: 2vmin 4.5vmin;
  box-shadow: 0 1.5vmin 3vmin rgba(11,92,107,0.4);
  cursor: pointer;
}
.flyer-fru-cta:hover { filter: brightness(1.08); }
@media (min-aspect-ratio: 4/3) {
  .flyer-fru { justify-content: center; }
  .flyer-fru-inner { flex-direction: row; align-items: center; gap: 6vmin; }
  .flyer-fru-words { flex: 1; }
  .flyer-fru-cta { align-self: auto; }
}
`

const FRU_HTML = `<div class="flyer-fru">
  <div class="flyer-fru-aura">
    <div class="flyer-fru-bubble flyer-fru-bubble-1"></div>
    <div class="flyer-fru-bubble flyer-fru-bubble-2"></div>
  </div>
  <div class="flyer-fru-inner">
    <div class="flyer-fru-words">
      <p class="flyer-fru-kicker">Summer garden party</p>
      <h1 class="flyer-fru-title">A Night Under the Glass Dome</h1>
      <div class="flyer-fru-lines">
        <span><b>Sat</b> · Jul 19</span>
        <span><b>Botanic Hall</b> · 8pm doors</span>
        <span><b>$10</b> entry</span>
      </div>
    </div>
    <button class="flyer-fru-cta">Grab a ticket</button>
  </div>
</div>`

const FRU_FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">`

export const flyer = {
  react: () =>
    reactProject({
      name: "Gig Flyer — Neo Brutalism",
      size: NEO_SIZE,
      fontLink: NEO_FONT,
      css: NEO_CSS,
      js: NEO_JSX,
    }),
  vanilla: () =>
    vanillaProject({
      name: "Gig Flyer — Frutiger Aero",
      size: NEO_SIZE,
      fontLink: FRU_FONT,
      html: FRU_HTML,
      css: FRU_CSS,
    }),
}