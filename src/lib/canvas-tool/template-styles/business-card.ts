import { reactProject } from "./shared"

const SIZE = { width: 1080, height: 810, aspectRatioId: "4:3" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">`

const CSS = `
.card {
  background: #F4EFE1;
  color: #141414;
  font-family: 'Space Grotesk', sans-serif;
  width: 100%;
  height: 100%;
  padding: 7vmin;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5vmin;
  overflow: hidden;
  border-left: 2vmin solid #FF5D5D;
  border-right: 2vmin solid #4C9AFF;
}
.card-brand {
  display: flex;
  flex-direction: column;
  gap: 2.4vmin;
}
.card-logo {
  width: 12vmin;
  height: 12vmin;
  background: #141414;
  color: #F4EFE1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.6rem, 6vmin, 3.4rem);
  font-weight: 700;
  box-shadow: 0.8vmin 0.8vmin 0 #FFD23F;
}
.card-name {
  font-size: clamp(1.8rem, 7vmin, 3.6rem);
  font-weight: 700;
  line-height: 1.02;
  margin: 0;
}
.card-role {
  font-size: clamp(0.85rem, 2.4vmin, 1.2rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6d6455;
}
.card-divider {
  width: 16vmin;
  height: 1vmin;
  background: #141414;
}
.card-contacts {
  display: flex;
  flex-direction: column;
  gap: 1.3vmin;
  font-size: clamp(0.78rem, 2.1vmin, 1.05rem);
  font-weight: 500;
}
.card-qr {
  background: #141414;
  color: #F4EFE1;
  padding: 3vmin;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6vmin;
  box-shadow: 0.8vmin 0.8vmin 0 #FFD23F;
}
.card-qr-grid {
  width: 18vmin;
  height: 18vmin;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8vmin;
}
.card-qr-grid i {
  background: rgba(244,239,225,0.9);
}
.card-qr-grid i:nth-child(3n) { opacity: 0.45; }
.card-qr-label {
  font-size: clamp(0.6rem, 1.6vmin, 0.8rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFD23F;
}
@media (min-aspect-ratio: 4/3) {
  .card { flex-direction: row; align-items: center; gap: 6vmin; }
  .card-brand { flex: 1; min-width: 0; }
  .card-qr { flex: 0 0 30%; }
}
@media (max-aspect-ratio: 3/4) {
  .card { padding: 6vmin; }
  .card-logo { width: 14vmin; height: 14vmin; }
  .card-qr-grid { width: 24vmin; height: 24vmin; }
}
`

const JSX = `function App() {
  return (
    <div className="card">
      <div className="card-brand">
        <div className="card-logo">PD</div>
        <h1 className="card-name">Pia Delacroix</h1>
        <div className="card-role">Print &amp; scan tech</div>
        <div className="card-divider" />
        <div className="card-contacts">
          <span>phone · (555) 017-8899</span>
          <span>email · pia@contact.photo</span>
          <span>studio · 14 Norwood Yard</span>
        </div>
      </div>
      <div className="card-qr">
        <div className="card-qr-grid">
          <i /><i /><i /><i /><i />
          <i /><i /><i /><i /><i />
          <i /><i /><i /><i /><i />
          <i /><i /><i /><i /><i />
          <i /><i /><i /><i /><i />
        </div>
        <div className="card-qr-label">scan · samples &amp; rates</div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const businessCard = {
  react: () =>
    reactProject({
      name: "Business Card — Neo Brutalism",
      size: SIZE,
      fontLink: FONT,
      css: CSS,
      js: JSX,
    }),
}