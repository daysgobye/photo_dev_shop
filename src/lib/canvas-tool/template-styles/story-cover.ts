import { reactProject } from "./shared"

const SIZE = { width: 1080, height: 1920, aspectRatioId: "9:16" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">`

const CSS = `
.story {
  background: #E8D9C5;
  color: #4A3728;
  font-family: 'Fredoka', sans-serif;
  width: 100%;
  height: 100%;
  padding: 5vmin;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4vmin;
}
.story-stitch {
  position: absolute;
  inset: 3.4vmin;
  border: 0.4vmin dashed #B5652F;
  border-radius: 5vmin;
  pointer-events: none;
  z-index: 0;
}
.story-top {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2.4vmin;
}
.story-badge {
  align-self: flex-start;
  background: #7C9473;
  color: #fff;
  border: 0.5vmin dashed #E8D9C5;
  border-radius: 999px;
  padding: 1vmin 2.8vmin;
  font-size: clamp(0.75rem, 2.2vmin, 1.05rem);
  font-weight: 600;
}
.story-title {
  font-size: clamp(2.2rem, 8vmin, 4.5rem);
  font-weight: 600;
  line-height: 1.05;
  color: #B5652F;
  margin: 0;
}
.story-sub {
  font-size: clamp(0.95rem, 2.8vmin, 1.35rem);
  margin: 0;
  max-width: 90%;
}
.story-frame {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  border-radius: 5vmin;
  border: 0.8vmin solid #F4E9DA;
  box-shadow:
    inset 0 0 0 0.8vmin #B5652F33,
    0 2vmin 4vmin #4A37283d;
  background:
    repeating-linear-gradient(45deg, #7C947333 0 2vmin, transparent 2vmin 4vmin),
    repeating-linear-gradient(-45deg, #B5652F33 0 2vmin, transparent 2vmin 4vmin);
  display: flex;
  align-items: center;
  justify-content: center;
}
.story-frame-label {
  display: none;
}
.story-frame .photo-fill {
  border-radius: 4.2vmin;
  border: 0.3vmin solid #F4E9DA;
}
.story-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3vmin;
}
.story-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4vmin;
  font-size: clamp(0.7rem, 2vmin, 0.95rem);
}
.story-tag {
  border: 0.3vmin solid #B5652F;
  border-radius: 999px;
  padding: 0.8vmin 1.8vmin;
}
.story-cta {
  background: #7C9473;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(0.85rem, 2.5vmin, 1.15rem);
  padding: 2vmin 4vmin;
  box-shadow: 0 4px 0 #5c7154;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s, box-shadow 0.15s;
}
.story-cta:hover { transform: translateY(2px); box-shadow: 0 2px 0 #5c7154; }
@media (min-aspect-ratio: 4/3) {
  .story { flex-direction: row; align-items: stretch; gap: 5vmin; }
  .story-top { justify-content: center; flex: 1.2; }
  .story-frame { flex: 1; }
  .story-bottom { flex-direction: column; align-items: flex-start; justify-content: center; }
  .story-tags { order: 2; }
}
@media (max-aspect-ratio: 3/4) {
  .story-bottom { flex-direction: column; align-items: stretch; gap: 2.4vmin; }
  .story-cta { align-self: flex-end; }
}
`

const JSX = `// Swap this URL for your photo. Paste a hosted image URL, or use an uploaded
// asset variable (upload in the left panel), e.g. const PHOTO = image1.
const PHOTO = "https://placehold.co/1400x2100/f4e9da/b5652f.png?text=Your+photo"

function App() {
  return (
    <div className="story">
      <div className="story-stitch" />
      <div className="story-top">
        <span className="story-badge">field notes · week 4</span>
        <h1 className="story-title">Print day, unplugged</h1>
        <p className="story-sub">A peek at the contact sheets that made the cut this time around.</p>
      </div>
      <div className="story-frame">
        <img className="photo-fill" src={PHOTO} alt="Your photo" />
      </div>
      <div className="story-bottom">
        <div className="story-tags">
          <span className="story-tag">#film</span>
          <span className="story-tag">#darkroom</span>
          <span className="story-tag">#smallbatch</span>
        </div>
        <button className="story-cta">See the prints</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)`

export const storyCover = {
  react: () =>
    reactProject({
      name: "Story Cover — Tactile",
      size: SIZE,
      fontLink: FONT,
      css: CSS,
      js: JSX,
    }),
}