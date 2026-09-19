import { reactProject } from "./shared"

const SIZE = { width: 1080, height: 1080, aspectRatioId: "1:1" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">`

const CSS = `
.frame {
  background: #101014;
  color: #E9E9EC;
  font-family: 'IBM Plex Mono', monospace;
  width: 100%;
  height: 100%;
  padding: 6vmin;
  display: flex;
  flex-direction: column;
  gap: 4vmin;
  overflow: hidden;
}
.frame-mat {
  flex: 1;
  min-height: 0;
  background: #F0EEE8;
  padding: 7vmin;
  box-shadow: inset 0 0 0 1vmin #D8D4C8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.frame-photo {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(135deg, #3a3f4b 0%, #6b7483 45%, #a3adb6 70%, #cfd6dc 100%);
  box-shadow: 0 1.5vmin 3vmin rgba(0,0,0,0.35);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}
.frame-photo-label {
  display: none;
}
.frame-photo .photo-fill {
  border-radius: 0.6vmin;
}
.frame-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 2.4vmin;
  font-size: clamp(0.72rem, 1.9vmin, 0.95rem);
  letter-spacing: 0.06em;
  color: #B9B9C2;
}
.frame-meta b {
  color: #E9E9EC;
  font-weight: 600;
}
.frame-strip {
  display: flex;
  align-items: center;
  gap: 2vmin;
  background: #1C1C22;
  border: 0.3vmin solid #333;
  border-radius: 0.6vmin;
  padding: 1.2vmin 2vmin;
  color: #8f8f98;
}
.frame-strip-holes {
  display: flex;
  gap: 0.7vmin;
}
.frame-strip-holes i {
  width: 0.8vmin;
  height: 0.8vmin;
  border-radius: 50%;
  background: #101014;
}
@media (min-aspect-ratio: 4/3) {
  .frame { flex-direction: row; align-items: stretch; gap: 5vmin; }
  .frame-meta { flex-direction: column; align-items: flex-start; justify-content: center; flex: 0 0 30%; min-width: 0; }
  .frame-strip { flex-direction: column; align-items: flex-start; gap: 1.2vmin; }
}
@media (max-aspect-ratio: 3/4) {
  .frame { padding: 4vmin; }
  .frame-mat { padding: 4vmin; }
}
`

const JSX = `// Swap this URL for your print photo. Paste a hosted image URL, or use an
// uploaded asset variable (upload in the left panel), e.g. const PHOTO = image1.
const PHOTO = "https://placehold.co/900x900/6b7483/f5f2ea.png?text=Your+print"

function App() {
  return (
    <div className="frame">
      <div className="frame-mat">
        <div className="frame-photo">
          <img className="photo-fill" src={PHOTO} alt="Your print" />
        </div>
      </div>
      <div className="frame-meta">
        <div>FRAME <b>07</b> · <b>24</b> EXP</div>
        <div>FILM <b>Tri-X 400</b></div>
        <div>ISO <b>400</b> · DEV <b>HC-110 B</b></div>
        <div className="frame-strip">
          <div className="frame-strip-holes">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <span>Ft.Duval · winter</span>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const photoPrint = {
  react: () =>
    reactProject({
      name: "Photo Print — Film Strip",
      size: SIZE,
      fontLink: FONT,
      css: CSS,
      js: JSX,
    }),
}