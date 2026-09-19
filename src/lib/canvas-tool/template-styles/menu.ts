import { vanillaProject } from "./shared"

const SIZE = { width: 1080, height: 1350, aspectRatioId: "4:5" }

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Bitter:wght@400;600&display=swap" rel="stylesheet">`

const CSS = `
.menu {
  background: #F4E9DA;
  color: #4A3728;
  font-family: 'Bitter', serif;
  width: 100%;
  height: 100%;
  padding: 6vmin;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4vmin;
}
.menu-inner {
  border: 0.6vmin dashed #B5652F;
  border-radius: 3vmin;
  padding: 6vmin;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4vmin;
  box-shadow: inset 0 0 0 0.6vmin #F4E9DA, inset 0 0 0 0.9vmin #B5652F33;
}
.menu-head {
  text-align: center;
}
.menu-head h1 {
  font-family: 'Caveat', cursive;
  font-size: clamp(2.4rem, 9vmin, 5.5rem);
  color: #B5652F;
  margin: 0;
  font-weight: 600;
}
.menu-head p {
  margin: 1vmin 0 0;
  font-size: clamp(0.85rem, 2.2vmin, 1.1rem);
  color: #7C6B5A;
}
.menu-section h2 {
  font-family: 'Caveat', cursive;
  font-size: clamp(1.5rem, 5vmin, 2.6rem);
  color: #7C9473;
  margin: 0 0 1.6vmin;
  border-bottom: 0.4vmin solid #7C9473;
  padding-bottom: 0.6vmin;
}
.menu-item {
  display: flex;
  align-items: baseline;
  gap: 1.5vmin;
  margin-bottom: 1.4vmin;
  font-size: clamp(0.85rem, 2.2vmin, 1.1rem);
}
.menu-item-dots {
  flex: 1;
  border-bottom: 0.3vmin dotted #B5652F88;
  transform: translateY(-0.4vmin);
}
.menu-item-price {
  font-weight: 600;
  color: #B5652F;
  white-space: nowrap;
}
.menu-foot {
  text-align: center;
  font-size: clamp(0.75rem, 1.9vmin, 0.95rem);
  color: #7C6B5A;
  border-top: 0.4vmin dashed #B5652F;
  padding-top: 2vmin;
}
@media (min-aspect-ratio: 4/3) {
  .menu-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 5vmin; align-content: start; }
  .menu { overflow: hidden; }
}
@media (max-aspect-ratio: 3/4) {
  .menu { padding: 4vmin; }
  .menu-inner { padding: 5vmin 4vmin; }
}
`

const HTML = `<div class="menu">
  <div class="menu-inner">
    <div class="menu-head">
      <h1>The Daily Contact Sheet</h1>
      <p>espresso · negs developed on site · open till late</p>
    </div>
    <div class="menu-sections">
      <div class="menu-section">
        <h2>Shots</h2>
        <div class="menu-item"><span>Flat white</span><span class="menu-item-dots"></span><span class="menu-item-price">3.50</span></div>
        <div class="menu-item"><span>Cortado</span><span class="menu-item-dots"></span><span class="menu-item-price">3.00</span></div>
        <div class="menu-item"><span>Chemex, for two</span><span class="menu-item-dots"></span><span class="menu-item-price">7.00</span></div>
        <div class="menu-item"><span>Roll refill (35mm)</span><span class="menu-item-dots"></span><span class="menu-item-price">11.00</span></div>
      </div>
      <div class="menu-section">
        <h2>Develop &amp; scan</h2>
        <div class="menu-item"><span>C41, 24 exp</span><span class="menu-item-dots"></span><span class="menu-item-price">10.00</span></div>
        <div class="menu-item"><span>C41, 36 exp</span><span class="menu-item-dots"></span><span class="menu-item-price">12.00</span></div>
        <div class="menu-item"><span>B&amp;W push</span><span class="menu-item-dots"></span><span class="menu-item-price">14.00</span></div>
        <div class="menu-item"><span>Archive scan, large</span><span class="menu-item-dots"></span><span class="menu-item-price">8.00</span></div>
      </div>
    </div>
    <div class="menu-foot">developed daily · turnarounds are the times we print on the wall · thanks for hanging out</div>
  </div>
</div>`

export const menu = {
  vanilla: () =>
    vanillaProject({
      name: "Menu — Price List",
      size: SIZE,
      fontLink: FONT,
      html: HTML,
      css: CSS,
    }),
}