import { buildHeroTheme } from "./shared"

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">`

const THEME_CSS = `
.frutiger {
  background: linear-gradient(160deg, #bff0ff 0%, #7fd6ff 45%, #3aa9e0 100%);
  font-family: 'Poppins', sans-serif;
  color: #0b3a52;
}
.frutiger .tpl-decor {
  background:
    radial-gradient(circle at 30% 15%, #ffffffaa, transparent 45%),
    radial-gradient(circle at 80% 85%, #ffffff55, transparent 40%);
}
.frutiger .tpl-card {
  background: linear-gradient(180deg, #ffffffcc, #ffffff66);
  border: 1px solid #ffffffaa;
  border-radius: 32px;
  padding: 6vmin;
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 30px #0b3a5233, inset 0 1px 0 #ffffff;
}
.frutiger .tpl-title {
  background: linear-gradient(180deg, #0b3a52, #1c6f9c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
}
.frutiger .tpl-badge {
  background: linear-gradient(180deg, #ffffff, #bfe9ff);
  border: 1px solid #ffffff;
  color: #0b3a52;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 2px 6px #0b3a5233;
}
.frutiger .tpl-cta {
  background: linear-gradient(180deg, #5fd0ff, #1c9adf);
  color: #fff;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: inset 0 1px 0 #ffffffaa, 0 6px 14px #0b3a5244;
  transition: filter 0.15s;
}
.frutiger .tpl-cta:hover { filter: brightness(1.08); }
.frutiger .tpl-image-slot {
  border-radius: 24px;
  border: 1px solid #ffffffaa;
  background: linear-gradient(160deg, #ffffff88, #bfe9ff44);
  box-shadow: inset 0 1px 0 #ffffff;
}
`

export const frutiger = buildHeroTheme({
  name: "Frutiger Aero",
  themeClass: "frutiger",
  fontLink: FONT_LINK,
  themeCss: THEME_CSS,
  content: {
    badge: "new & improved",
    title: "Bright ideas, glossy finish",
    subtitle: "Clean gradients, glassy surfaces, a little bit of early-internet optimism.",
    cta: "Get started",
  },
})
