import { buildHeroTheme } from "./shared"

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap" rel="stylesheet">`

const THEME_CSS = `
.blackmetal { background: #0a0a0a; font-family: 'Metal Mania', serif; color: #e6e6e6; }
.blackmetal .tpl-decor {
  background: repeating-linear-gradient(to bottom, #ffffff09 0px, #ffffff09 1px, transparent 1px, transparent 3px);
}
.blackmetal .tpl-card {
  background: #111;
  border: 2px solid #333;
  clip-path: polygon(0 4%, 4% 0, 96% 0, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0 96%);
  padding: 6vmin;
}
.blackmetal .tpl-title {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #f5f5f5;
  text-shadow: 2px 0 #c0392b, -2px 0 #2c3e50;
}
.blackmetal .tpl-subtitle { font-family: 'Courier New', monospace; color: #a9a9a9; }
.blackmetal .tpl-badge {
  background: #c0392b;
  color: #0a0a0a;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid #f5f5f5;
}
.blackmetal .tpl-cta {
  background: transparent;
  color: #f5f5f5;
  border: 2px solid #f5f5f5;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  transition: background 0.15s, color 0.15s;
}
.blackmetal .tpl-cta:hover { background: #f5f5f5; color: #0a0a0a; }
.blackmetal .tpl-image-slot {
  border: 1px solid #333;
  background: radial-gradient(circle, #1a1a1a, #000);
  filter: contrast(1.2) grayscale(0.4);
}
`

export const blackmetal = buildHeroTheme({
  name: "Black Metal Brutalist",
  themeClass: "blackmetal",
  fontLink: FONT_LINK,
  themeCss: THEME_CSS,
  content: {
    badge: "est. 1986",
    title: "DARKNESS FALLS",
    subtitle: "Harsh, jagged, and unapologetically stark. Replace this with your own text.",
    cta: "Enter",
  },
})
