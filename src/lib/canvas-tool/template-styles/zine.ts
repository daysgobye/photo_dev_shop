import { buildHeroTheme } from "./shared"

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet">`

const THEME_CSS = `
.zine { background: #eae6da; font-family: 'Special Elite', monospace; color: #111; }
.zine .tpl-decor {
  background-image: radial-gradient(#00000030 1px, transparent 1px);
  background-size: 6px 6px;
  mix-blend-mode: multiply;
  opacity: 0.6;
}
.zine .tpl-card {
  background: #f7f4ec;
  padding: 6vmin;
  clip-path: polygon(1% 2%, 97% 0%, 100% 96%, 3% 100%, 0% 55%, 5% 30%);
  box-shadow: 8px 10px 0 #111;
  border: 1px solid #111;
}
.zine .tpl-title {
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 400;
  text-shadow: 2px 2px 0 #ff3b3b;
}
.zine .tpl-badge {
  background: #111;
  color: #f7f4ec;
  transform: rotate(4deg);
  font-family: monospace;
  letter-spacing: 0.15em;
}
.zine .tpl-cta {
  background: #ff3b3b;
  color: #111;
  border: 2px solid #111;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  transition: background 0.15s, color 0.15s;
}
.zine .tpl-cta:hover { background: #111; color: #ff3b3b; }
.zine .tpl-image-slot {
  border: 2px solid #111;
  filter: grayscale(1) contrast(1.2);
  background: repeating-linear-gradient(0deg, #11111122 0 2px, transparent 2px 4px);
}
`

export const zine = buildHeroTheme({
  name: "Zine Collage",
  themeClass: "zine",
  fontLink: FONT_LINK,
  themeCss: THEME_CSS,
  content: {
    badge: "ISSUE №1",
    title: "CUT & PASTE HEADLINE",
    subtitle: "Photocopied, stapled, and a little bit crooked — on purpose. Edit this blurb.",
    cta: "READ MORE",
  },
})
