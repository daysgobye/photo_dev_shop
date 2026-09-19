import { reactProject } from "./shared"

const SIZE = { width: 2550, height: 3300, aspectRatioId: "free" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">`

const CSS = `
.sheet {
  background: #F4EFE1;
  width: 100%;
  height: 100%;
  padding: 38px 150px;
  display: grid;
  grid-template-columns: repeat(2, 1050px);
  grid-template-rows: repeat(5, 600px);
  gap: 56px 150px;
  justify-content: center;
  align-content: center;
}
.cell {
  container-type: size;
}
.card {
  background: #F4EFE1;
  color: #141414;
  font-family: 'Space Grotesk', sans-serif;
  width: 100%;
  height: 100%;
  padding: 7cqmin;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5cqmin;
  overflow: hidden;
  border-left: 2cqmin solid #FF5D5D;
  border-right: 2cqmin solid #4C9AFF;
}
.card-brand {
  display: flex;
  flex-direction: column;
  gap: 2.4cqmin;
}
.card-logo {
  width: 12cqmin;
  height: 12cqmin;
  background: #141414;
  color: #F4EFE1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.6rem, 6cqmin, 3.4rem);
  font-weight: 700;
  box-shadow: 0.8cqmin 0.8cqmin 0 #FFD23F;
}
.card-name {
  font-size: clamp(1.8rem, 7cqmin, 3.6rem);
  font-weight: 700;
  line-height: 1.02;
  margin: 0;
}
.card-role {
  font-size: clamp(0.85rem, 2.4cqmin, 1.2rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6d6455;
}
.card-divider {
  width: 16cqmin;
  height: 1cqmin;
  background: #141414;
}
.card-contacts {
  display: flex;
  flex-direction: column;
  gap: 1.3cqmin;
  font-size: clamp(0.78rem, 2.1cqmin, 1.05rem);
  font-weight: 500;
}
.card-qr {
  background: #141414;
  color: #F4EFE1;
  padding: 3cqmin;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6cqmin;
  box-shadow: 0.8cqmin 0.8cqmin 0 #FFD23F;
}
.card-qr-grid {
  width: 18cqmin;
  height: 18cqmin;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8cqmin;
}
.card-qr-grid i {
  background: rgba(244,239,225,0.9);
}
.card-qr-grid i:nth-child(3n) { opacity: 0.45; }
.card-qr-label {
  font-size: clamp(0.6rem, 1.6cqmin, 0.8rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFD23F;
}
@container (min-aspect-ratio: 4/3) {
  .card { flex-direction: row; align-items: center; gap: 6cqmin; }
  .card-brand { flex: 1; min-width: 0; }
  .card-qr { flex: 0 0 30%; }
}
@container (max-aspect-ratio: 3/4) {
  .card { padding: 6cqmin; }
  .card-logo { width: 14cqmin; height: 14cqmin; }
  .card-qr-grid { width: 24cqmin; height: 24cqmin; }
}
@media (min-aspect-ratio: 4/3) {
  .sheet { grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, 1fr); padding: 3vmin; gap: 3vmin; }
}
@media (max-aspect-ratio: 3/4) {
  .sheet { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(5, 1fr); padding: 3vmin; gap: 2vmin; }
}
`

const JSX = `function Card() {
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

function App() {
  return (
    <div className="sheet">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <div className="cell" key={n}>
          <Card />
        </div>
      ))}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const businessCardSheet = {
  react: () =>
    reactProject({
      name: "Business Card Sheet — Letter Print",
      size: SIZE,
      fontLink: FONT,
      css: CSS,
      js: JSX,
    }),
}