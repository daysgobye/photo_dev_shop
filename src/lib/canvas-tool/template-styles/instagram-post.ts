import { reactProject } from "./shared"

const SIZE = { width: 1080, height: 1080, aspectRatioId: "1:1" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" rel="stylesheet">`

const CSS = `
.igpost {
  background: #FBF6EC;
  color: #1F2933;
  font-family: 'Kalam', cursive;
  width: 100%;
  height: 100%;
  padding: 5vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.igpost-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#1F293322 1.6px, transparent 1.6px);
  background-size: 24px 24px;
  z-index: 0;
}
.igpost-sun {
  position: absolute;
  top: 6vmin;
  right: 8vmin;
  width: 15vmin;
  height: 15vmin;
  border-radius: 50%;
  background: #FFD166;
  border: 0.8vmin solid #1F2933;
  z-index: 1;
}
.igpost-squiggle {
  position: absolute;
  bottom: 10vmin;
  left: 25%;
  width: 50%;
  height: 5vmin;
  border-top: 1.2vmin solid #1F2933;
  border-radius: 50%;
  transform: rotate(-3deg);
  z-index: 1;
}
.igpost-card {
  position: relative;
  z-index: 2;
  background: #fff;
  border: 0.8vmin solid #1F2933;
  border-radius: 255px 22px 255px 22px / 22px 255px 22px 255px;
  box-shadow: 1.6vmin 1.6vmin 0 #1F2933;
  padding: 6vmin 7vmin;
  width: 100%;
  max-width: 78%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3vmin;
  transform: rotate(-1deg);
}
.igpost-badge {
  align-self: flex-start;
  background: #FFD166;
  border: 0.7vmin solid #1F2933;
  border-radius: 40% 60% 55% 45% / 55% 45% 60% 40%;
  padding: 1vmin 2.6vmin;
  font-size: clamp(0.7rem, 2vmin, 1rem);
  font-weight: 700;
  transform: rotate(-6deg);
}
.igpost-title {
  font-size: clamp(2.2rem, 9.5vmin, 6.5rem);
  font-weight: 700;
  line-height: 1.02;
  margin: 0;
  word-break: break-word;
}
.igpost-sub {
  font-size: clamp(0.95rem, 2.8vmin, 1.3rem);
  margin: 0;
  max-width: 90%;
}
.igpost-cta {
  align-self: flex-start;
  background: #FF6B6B;
  color: #fff;
  border: 0.7vmin solid #1F2933;
  border-radius: 32px 8px 32px 8px;
  box-shadow: 1vmin 1vmin 0 #1F2933;
  font-family: inherit;
  font-weight: 700;
  font-size: clamp(0.85rem, 2.4vmin, 1.15rem);
  padding: 1.8vmin 3.8vmin;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.igpost-cta:hover { transform: translate(-0.8vmin, -0.8vmin); box-shadow: 1.6vmin 1.6vmin 0 #1F2933; }
@media (min-aspect-ratio: 4/3) {
  .igpost-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5vmin;
    transform: rotate(0deg);
  }
  .igpost-words { flex: 1; min-width: 0; }
  .igpost-cta { align-self: auto; white-space: nowrap; }
}
@media (max-aspect-ratio: 3/4) {
  .igpost-card { max-width: 90%; padding: 5vmin; }
  .igpost-sun { width: 12vmin; height: 12vmin; }
}
`

const JSX = `function App() {
  return (
    <div className="igpost">
      <div className="igpost-dots" />
      <div className="igpost-sun" />
      <div className="igpost-squiggle" />
      <div className="igpost-card">
        <div className="igpost-words">
          <span className="igpost-badge">new drop</span>
          <h1 className="igpost-title">Fresh prints are here</h1>
          <p className="igpost-sub">
            Hand-finished photo prints, small batch, made this week. Swipe up to
            grab yours before they are gone.
          </p>
        </div>
        <button className="igpost-cta">Shop prints</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const instagramPost = {
  react: () =>
    reactProject({
      name: "Instagram Promo — Naive",
      size: SIZE,
      fontLink: FONT,
      css: CSS,
      js: JSX,
    }),
}