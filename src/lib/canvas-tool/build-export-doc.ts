import type { CanvasProject } from "@/types/canvas-tool"

const RAW_ELEMENTS = new Set(["script", "style", "pre", "textarea"])

/**
 * Conservatively minifies user-authored HTML: collapses whitespace-only runs
 * between tags to a single space, drops comments, and leaves the contents of
 * `<script>`, `<style>`, `<pre>` and `<textarea>` untouched so inline code
 * and pre-formatted text survive byte-for-byte.
 */
export function minifyHtml(html: string): string {
  let out = ""
  let textStart = 0
  let i = 0
  const n = html.length

  const flushText = (end: number) => {
    const text = html.slice(textStart, end)
    if (text === "") return
    if (text.trim() === "") out += " "
    else out += text
  }

  while (i < n) {
    const lt = html.indexOf("<", i)
    if (lt === -1) break

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4)
      if (end === -1) {
        out += html.slice(lt)
        break
      }
      i = end + 3
      textStart = i
      continue
    }

    const after = html.slice(lt, lt + 2)
    const isTagStart =
      /[a-zA-Z]/.test(after[1] ?? "") ||
      after.startsWith("</") ||
      after.startsWith("<?")

    if (!isTagStart) {
      i = lt + 1
      continue
    }

    flushText(lt)

    let j = lt + 1
    let quote: string | null = null
    for (; j < n; j++) {
      const c = html[j]
      if (quote) {
        if (c === quote) quote = null
        continue
      }
      if (c === '"' || c === "'") quote = c
      else if (c === ">") break
    }
    if (j >= n) {
      out += html.slice(lt)
      break
    }

    const tagText = html.slice(lt, j + 1)
    out += tagText
    i = j + 1

    const nameMatch = /^<\/([a-zA-Z][a-zA-Z0-9-]*)/.exec(tagText)
    if (nameMatch) {
      textStart = i
      continue
    }

    const openMatch = /^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(tagText)
    if (openMatch && RAW_ELEMENTS.has(openMatch[1].toLowerCase())) {
      const name = openMatch[1].toLowerCase()
      const closeToken = "</" + name
      const closeStart = html.toLowerCase().indexOf(closeToken, i)
      if (closeStart === -1) {
        out += html.slice(i)
        break
      }
      out += html.slice(i, closeStart)
      const closeEnd = html.indexOf(">", closeStart)
      if (closeEnd === -1) {
        out += html.slice(closeStart)
        break
      }
      out += html.slice(closeStart, closeEnd + 1)
      i = closeEnd + 1
    }
    textStart = i
  }

  if (textStart < n) out += html.slice(textStart)
  return out.trim()
}

/**
 * Builds a standalone self-contained HTML document that replays the project's
 * animation/interactivity. Open it in a browser tab or drop it into any
 * <iframe> — the canvas scales to fit whatever box it's shown in, so it
 * behaves like a moving image.
 *
 * Unlike the live preview document, this export ships **no** Babel
 * standalone, **no** html2canvas and **no** capture plumbing — the user's JS
 * is pre-compiled to plain JS and minified, so nothing heavyweight runs at
 * view time. Assets and uploaded fonts are inlined as data URLs; any CDN
 * `<script src>`/`<link>` tags the user authored are kept as-is.
 *
 * A tiny scale-to-fit wrapper letterboxes the canvas to the current window
 * (object-fit: contain), driven by the project's width/height.
 */
export function buildExportDocument(
  project: CanvasProject,
  compiledJs: string,
  minifiedCss: string
): string {
  const { html, width, height, assets, fonts = [] } = project

  const assetScript = assets
    .map(
      (asset) =>
        `window[${JSON.stringify(asset.varName)}]=${JSON.stringify(asset.dataUrl)};`
    )
    .join("")

  const fontFaceCss = fonts
    .map(
      (font) =>
        `@font-face{font-family:${JSON.stringify(font.fontFamily)};src:url(${JSON.stringify(font.dataUrl)}) format(${JSON.stringify(font.format)});font-display:swap}`
    )
    .join("")

  const fitScript = `(function(){function f(){var s=Math.min(innerWidth/${width},innerHeight/${height}),x=(innerWidth-${width}*s)/2,y=(innerHeight-${height}*s)/2;document.body.style.transform="translate("+x+"px,"+y+"px) scale("+s+")"}addEventListener("resize",f);f()})()`

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>html,body{margin:0!important;padding:0!important;overflow:hidden!important}html{width:100%;height:100%;background-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)!important}body{position:absolute!important;left:0!important;top:0!important;width:${width}px!important;height:${height}px!important;transform:scale(1);transform-origin:0 0!important}</style>
<style>${fontFaceCss}</style>
<style>${minifiedCss}</style>
</head>
<body>
${minifyHtml(html)}
<script>${assetScript}</script>
<script>${compiledJs}</script>
<script>${fitScript}</script>
</body>
</html>`
}
