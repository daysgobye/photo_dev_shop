import { buildHeroTheme } from "./shared"

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">`

const THEME_CSS = `
.neobrutal { background: #FFE347; font-family: 'Space Grotesk', sans-serif; color: #111; }
.neobrutal .tpl-decor {
  background-image:
    linear-gradient(#11111110 1px, transparent 1px),
    linear-gradient(90deg, #11111110 1px, transparent 1px);
  background-size: 32px 32px;
}
.neobrutal .tpl-card {
  background: #fff;
  border: 4px solid #111;
  border-radius: 0;
  padding: 6vmin;
  box-shadow: 10px 10px 0 #111;
}
.neobrutal .tpl-title { text-transform: uppercase; font-weight: 700; letter-spacing: -0.02em; }
.neobrutal .tpl-badge {
  background: #111;
  color: #FFE347;
  border-radius: 0;
  font-weight: 700;
  text-transform: uppercase;
  border: 3px solid #111;
}
.neobrutal .tpl-cta {
  background: #FF3EC9;
  color: #111;
  border: 4px solid #111;
  border-radius: 0;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 6px 6px 0 #111;
  transition: transform 0.1s, box-shadow 0.1s;
}
.neobrutal .tpl-cta:hover { box-shadow: 3px 3px 0 #111; transform: translate(3px, 3px); }
.neobrutal .tpl-image-slot {
  border: 4px solid #111;
  background: repeating-linear-gradient(45deg, #111 0 4px, #FF3EC9 4px 8px);
}
`

export const neobrutal = buildHeroTheme({
  name: "Neo-Brutalism",
  themeClass: "neobrutal",
  fontLink: FONT_LINK,
  themeCss: THEME_CSS,
  content: {
    badge: "LOUD & CLEAR",
    title: "NO FRILLS. JUST IMPACT.",
    subtitle: "Thick borders, hard shadows, zero subtlety. Replace this with your own line.",
    cta: "CLICK HERE",
  },
})
