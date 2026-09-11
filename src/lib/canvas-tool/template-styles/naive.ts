import { buildHeroTheme } from "./shared"

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" rel="stylesheet">`

const THEME_CSS = `
.naive { background: #FBF6EC; font-family: 'Kalam', cursive; color: #1F2933; }
.naive .tpl-decor {
  background-image: radial-gradient(#1F293322 1.5px, transparent 1.5px);
  background-size: 22px 22px;
}
.naive .tpl-card {
  background: #fff;
  border: 3px solid #1F2933;
  border-radius: 255px 18px 225px 18px / 18px 225px 18px 255px;
  padding: 6vmin;
  box-shadow: 6px 6px 0 #1F2933;
}
.naive .tpl-title { transform: rotate(-2deg); }
.naive .tpl-badge {
  background: #FFD166;
  border: 2.5px solid #1F2933;
  border-radius: 40% 60% 55% 45% / 55% 45% 60% 40%;
  transform: rotate(-8deg);
  font-weight: 700;
}
.naive .tpl-cta {
  background: #FF6B6B;
  color: #fff;
  border: 3px solid #1F2933;
  border-radius: 30px 8px 30px 8px;
  font-weight: 700;
  box-shadow: 4px 4px 0 #1F2933;
  transition: transform 0.15s, box-shadow 0.15s;
}
.naive .tpl-cta:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #1F2933; }
.naive .tpl-image-slot {
  border: 3px solid #1F2933;
  border-radius: 24px 90px 24px 90px;
  background: repeating-linear-gradient(45deg, #FFD16655 0 10px, #FF6B6B33 10px 20px);
}
`

export const naive = buildHeroTheme({
  name: "Naive Doodle",
  themeClass: "naive",
  fontLink: FONT_LINK,
  themeCss: THEME_CSS,
  content: {
    badge: "✦ new ✦",
    title: "Hey, we made a thing!",
    subtitle: "A friendly little intro line about what this is and why people should care.",
    cta: "Take a look →",
  },
})
