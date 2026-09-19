import type { CanvasProject } from "@/types/canvas-tool"

// Vendored, locally patched copy of html2canvas-pro 2.4.3. Upstream 2.4.3
// double-appends units in its `filter` parser, emitting invalid `blur(4pxpx)` /
// `hue-rotate(90degdeg)` that canvas ignores, so Blur and Hue rotate were
// missing from exports. See the patch header in the vendored file.
const HTML2CANVAS_SRC = `${import.meta.env.BASE_URL}vendor/html2canvas-pro-2.4.3.min.js`
const BABEL_SRC = "https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"

/**
 * Builds a full standalone HTML document for the preview iframe.
 *
 * - `project.html` is dropped straight into <body>, so any <script src>/<link>
 *   tags the user added for libraries/fonts load and execute in order.
 * - `project.fonts` become `@font-face` rules (before `project.css`), so any
 *   uploaded font file is usable by its `font-family` name immediately.
 * - `project.css` becomes a <style> tag.
 * - Each asset becomes `window[varName] = "data:...";` before user code runs.
 * - `project.js` is always run through Babel's React preset, so JSX works by
 *   default and plain JS just passes through unchanged.
 * - A postMessage listener lets the parent request an html2canvas-pro capture.
 */
export function buildPreviewDocument(project: CanvasProject): string {
  const { html, css, js, width, height, assets, fonts = [] } = project

  const assetScript = assets
    .map((asset) => `window[${JSON.stringify(asset.varName)}] = ${JSON.stringify(asset.dataUrl)};`)
    .join("\n")

  const fontFaceCss = fonts
    .map(
      (font) =>
        `@font-face { font-family: ${JSON.stringify(font.fontFamily)}; src: url(${JSON.stringify(font.dataUrl)}) format(${JSON.stringify(font.format)}); font-display: swap; }`
    )
    .join("\n")

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
</style>
<style>${fontFaceCss}</style>
<style>${css}</style>
</head>
<body>
${html}
<script>${assetScript}</script>
<script src="${HTML2CANVAS_SRC}"></script>
<script src="${BABEL_SRC}"></script>
<script>
(function () {
  window.addEventListener("message", function (event) {
    var data = event.data
    if (!data || data.type !== "canvas-tool:capture") return
    var opts = data.payload || {}
    window.html2canvas(document.body, {
      backgroundColor: opts.transparent ? null : "#ffffff",
      useCORS: true,
      width: ${width},
      height: ${height},
      windowWidth: ${width},
      windowHeight: ${height},
    })
      .then(function (canvas) {
        var dataUrl = canvas.toDataURL("image/" + (opts.format || "png"), opts.quality || 0.92)
        parent.postMessage(
          { type: "canvas-tool:capture-result", dataUrl: dataUrl, requestId: data.requestId },
          "*"
        )
      })
      .catch(function (err) {
        parent.postMessage(
          { type: "canvas-tool:capture-error", message: String(err), requestId: data.requestId },
          "*"
        )
      })
  })

  try {
    var source = ${JSON.stringify(js)}
    var compiled = window.Babel.transform(source, { presets: ["react"], filename: "main.jsx" }).code
    new Function(compiled)()
  } catch (err) {
    console.error(err)
    var pre = document.createElement("pre")
    pre.style.cssText =
      "position:fixed;top:0;left:0;right:0;margin:0;padding:8px;background:#fff;color:#b91c1c;" +
      "font:12px monospace;white-space:pre-wrap;z-index:999999;"
    pre.textContent = err && err.message ? err.message : String(err)
    document.body.appendChild(pre)
  }
})()
</script>
</body>
</html>`
}
