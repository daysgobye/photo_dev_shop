import { reactProject } from "./shared"

const SIZE = { width: 1080, height: 1080, aspectRatioId: "1:1" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" rel="stylesheet">`

const CSS = `
.sheet {
  background: #eef1f5;
  color: #1F2933;
  font-family: 'Kalam', cursive;
  width: 100%;
  height: 100%;
  padding: 5vmin;
  display: flex;
  flex-direction: column;
  gap: 3vmin;
  overflow: hidden;
}
.sheet-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 1vmin;
}
.sheet-head h1 {
  font-size: clamp(1.3rem, 4.5vmin, 2.4rem);
  margin: 0;
  font-weight: 700;
}
.sheet-head p {
  margin: 0;
  font-size: clamp(0.7rem, 2vmin, 0.95rem);
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.sheet-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3vmin;
}
.sticker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4vmin;
  text-align: center;
  background: #fff;
  padding: 3vmin;
}
.sticker-ink {
  color: #fff;
  font-weight: 700;
  border-radius: 999px;
  width: 9vmin;
  height: 9vmin;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 3.4vmin, 1.8rem);
}
.sticker-name {
  font-size: clamp(0.85rem, 2.6vmin, 1.4rem);
  font-weight: 700;
  line-height: 1;
}
.sticker-sub {
  font-size: clamp(0.55rem, 1.6vmin, 0.85rem);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #6b7280;
}
.sticker-c1 { border: 0.5vmin dashed #FF5D5D; border-radius: 255px 22px 22px 22px; transform: rotate(-2deg); background: #fff5f5; }
.sticker-c2 { border: 0.5vmin dashed #4C9AFF; border-radius: 40% 60% 55% 45% / 55% 45% 60% 40%; transform: rotate(3deg); background: #f3f8ff; }
.sticker-c3 { border: 0.5vmin dashed #FFB020; border-radius: 22px 88px 22px 88px; transform: rotate(-1deg); background: #fffaf0; }
.sticker-c4 { border: 0.5vmin dashed #7C9473; border-radius: 60% 40% 45% 55% / 45% 60% 55% 40%; transform: rotate(2deg); background: #f4f8f2; }
.sticker .i1 { background: #FF5D5D; }
.sticker .i2 { background: #4C9AFF; }
.sticker .i3 { background: #FFB020; }
.sticker .i4 { background: #7C9473; }
@media (min-aspect-ratio: 4/3) {
  .sheet-grid { grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr; }
}
@media (max-aspect-ratio: 3/4) {
  .sheet-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(5, 1fr); }
  .sticker:last-child { grid-column: 1 / -1; }
}
`

const JSX = `function Sticker(props) {
  return (
    <div className={"sticker sticker-" + props.c}>
      <span className={"sticker-ink i" + props.i}>{props.icon}</span>
      <div className="sticker-name">{props.name}</div>
      <div className="sticker-sub">die cut sheet</div>
    </div>
  )
}

function App() {
  return (
    <div className="sheet">
      <div className="sheet-head">
        <h1>Contact sheet stickers</h1>
        <p>peel · stick · photos</p>
      </div>
      <div className="sheet-grid">
        <Sticker c="c1" i="1" icon="S" name="SNAP" />
        <Sticker c="c2" i="2" icon="T" name="TAPE" />
        <Sticker c="c3" i="3" icon="X" name="CROSS X" />
        <Sticker c="c1" i="1" icon="C" name="COUNT" />
        <Sticker c="c2" i="2" icon="P" name="PRINT" />
        <Sticker c="c4" i="4" icon="D" name="DEV" />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const stickerSheet = {
  react: () =>
    reactProject({
      name: "Sticker Sheet",
      size: SIZE,
      fontLink: FONT,
      css: CSS,
      js: JSX,
    }),
}