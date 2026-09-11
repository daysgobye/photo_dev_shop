import type { CanvasProject } from "@/types/canvas-tool"

function assetList(project: CanvasProject): string {
  if (project.assets.length === 0) return "- (none uploaded)"
  return project.assets
    .map(
      (asset) =>
        `- \`${asset.varName}\` — global JS variable holding the data URL for "${asset.fileName}". Use directly, e.g. \`<img src={${asset.varName}} />\` in React, or \`el.src = ${asset.varName}\` in plain JS.`
    )
    .join("\n")
}

function fontList(project: CanvasProject): string {
  if (project.fonts.length === 0) return "- (none uploaded)"
  return project.fonts
    .map(
      (font) =>
        `- "${font.fontFamily}" — from "${font.fileName}". Already registered as @font-face; use directly, e.g. \`font-family: "${font.fontFamily}", sans-serif;\`.`
    )
    .join("\n")
}

function environmentExplainer(project: CanvasProject): string {
  return `You are writing code for a live browser canvas/design tool. There are three code tabs — HTML, CSS, and JS/JSX — rendered together inside a sandboxed iframe that is exactly ${project.width}×${project.height}px.

How each tab works:
- HTML tab: dropped directly into <body>. This is also where any <script src="..."> or <link> tags for external libraries/fonts belong — they load and run, in order, before the JS tab executes. If you're rendering with React, keep this tab minimal (usually just <div id="root"></div>) and let the JS tab do the rendering.
- CSS tab: dropped into a <style> tag in <head>.
- JS/JSX tab: always compiled through Babel's React preset before running, so JSX syntax works even outside React mode. There's no bundler and no import/export statements — everything runs as one inline script. Reference any library by whatever global it attaches to the page (loaded via a <script> tag in the HTML tab).

Current mode: ${project.mode}.${project.mode === "react"
      ? " React and ReactDOM are expected as globals (e.g. via CDN <script> tags in the HTML tab). Mount with `ReactDOM.createRoot(document.getElementById(\"root\")).render(<App />)`."
      : " No framework is assumed — plain DOM/JS is fine, though JSX is still available if you want it."
    }

Canvas size: ${project.width}×${project.height}px (aspect ratio: ${project.aspectRatioId}).

Available images (already injected as global variables before your JS runs):
${assetList(project)}

Available custom fonts (already registered as @font-face, ready to use by name):
${fontList(project)}`
}

export function buildNewProjectPrompt(project: CanvasProject): string {
  return `${environmentExplainer(project)}

Please write the HTML, CSS, and JS/JSX for a new design based on what I describe below. Reply with three clearly labeled code blocks — one each for HTML, CSS, and JS/JSX — containing the full contents to paste into each tab.

What I want:
`
}

export function buildEditProjectPrompt(project: CanvasProject): string {
  return `${environmentExplainer(project)}

Here is the current code in the project, exactly as it exists in each tab right now:

--- HTML tab ---
${project.html}

--- CSS tab ---
${project.css}

--- JS/JSX tab ---
${project.js}

Please modify this code to make the change I describe below. Reply with the full, updated contents of every tab that needs to change (clearly labeled HTML / CSS / JS/JSX code blocks), not a diff or partial snippet.

What I want changed:
`
}
