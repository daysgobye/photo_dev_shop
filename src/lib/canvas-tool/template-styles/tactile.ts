import { buildHeroTheme } from "./shared"

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">`

const THEME_CSS = `
.tactile { background: #E8D9C5; font-family: 'Fredoka', sans-serif; color: #4A3728; }
.tactile .tpl-decor {
  background-image:
    repeating-linear-gradient(45deg, #4A372810 0 2px, transparent 2px 10px),
    repeating-linear-gradient(-45deg, #4A372810 0 2px, transparent 2px 10px);
}
.tactile .tpl-card {
  background: #F4E9DA;
  border: 3px dashed #B5652F;
  border-radius: 28px;
  padding: 6vmin;
  box-shadow: inset 0 0 0 6px #F4E9DA, inset 0 0 0 9px #B5652F33;
}
.tactile .tpl-title { color: #B5652F; font-weight: 600; }
.tactile .tpl-badge {
  background: #7C9473;
  color: #fff;
  border-radius: 50px;
  border: 2px dashed #F4E9DA;
  font-weight: 600;
}
.tactile .tpl-cta {
  background: #7C9473;
  color: #fff;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 4px 0 #5c7154;
  transition: transform 0.15s, box-shadow 0.15s;
}
.tactile .tpl-cta:hover { transform: translateY(2px); box-shadow: 0 2px 0 #5c7154; }
.tactile .tpl-image-slot {
  border-radius: 24px;
  border: 3px dashed #B5652F;
  background: linear-gradient(135deg, #7C947333, #B5652F33);
}
`

export const tactile = buildHeroTheme({
  name: "Tactile Craft",
  themeClass: "tactile",
  fontLink: FONT_LINK,
  themeCss: THEME_CSS,
  content: {
    badge: "handmade",
    title: "Stitched together with care",
    subtitle: "Warm, soft, and a little imperfect — like felt and paper cutouts. Edit this text.",
    cta: "See more",
  },
})
