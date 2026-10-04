import { describe, expect, it } from "vitest"
import { buildPreviewDocument } from "@/lib/canvas-tool/build-preview-doc"
import type { CanvasProject } from "@/types/canvas-tool"

function project(overrides: Partial<CanvasProject> = {}): CanvasProject {
  return {
    formatVersion: 1,
    name: "Test",
    mode: "react",
    width: 800,
    height: 600,
    aspectRatioId: "4:3",
    html: `<div id="root"></div>`,
    css: `.box { color: red; }`,
    js: `function App() { return <div className="box">hi</div> }`,
    assets: [
      {
        id: "a1",
        varName: "bg",
        fileName: "bg.png",
        dataUrl: "data:image/png;base64,iVBORw0KGgo=",
      },
    ],
    fonts: [
      {
        id: "f1",
        fontFamily: "Test Font",
        fileName: "test.woff2",
        format: "woff2",
        dataUrl: "data:font/woff2;base64,d09GMgABAAAA",
      },
    ],
    ...overrides,
  }
}

describe("buildPreviewDocument", () => {
  it("is a complete html document", () => {
    const doc = buildPreviewDocument(project())

    expect(doc.startsWith("<!DOCTYPE html>")).toBe(true)
    expect(doc).toContain("<meta charset=\"utf-8\" />")
    expect(doc.trimEnd().endsWith("</html>")).toBe(true)
  })

  it("drops the html tab straight into the body", () => {
    const doc = buildPreviewDocument(
      project({ html: `<div id="root"><span>seeded</span></div>` })
    )

    expect(doc).toContain("<body>\n<div id=\"root\"><span>seeded</span></div>\n")
  })

  it("keeps script/link tags authored in the html tab so libraries load first", () => {
    const html = `<script src="https://unpkg.com/react@18/umd/react.development.js"></script><div id="root"></div>`
    const doc = buildPreviewDocument(project({ html }))

    expect(doc).toContain(html)
    expect(doc.indexOf("unpkg.com/react")).toBeLessThan(
      doc.indexOf("window.Babel.transform")
    )
  })

  it("inlines the css tab in a style tag", () => {
    const doc = buildPreviewDocument(project({ css: `.box { color: red; }` }))

    expect(doc).toContain("<style>.box { color: red; }</style>")
  })

  it("registers each font as an @font-face rule", () => {
    const doc = buildPreviewDocument(project())

    expect(doc).toContain(
      '@font-face { font-family: "Test Font"; src: url("data:font/woff2;base64,d09GMgABAAAA") format("woff2"); font-display: swap; }'
    )
  })

  it("declares @font-face before the user css so uploads override same-named families", () => {
    const doc = buildPreviewDocument(project())

    expect(doc.indexOf("@font-face")).toBeLessThan(doc.indexOf(".box { color: red; }"))
  })

  it("exposes each asset as a global before user code runs", () => {
    const doc = buildPreviewDocument(project())

    expect(doc).toContain(
      'window["bg"] = "data:image/png;base64,iVBORw0KGgo=";'
    )
    expect(doc.indexOf('window["bg"]')).toBeLessThan(doc.indexOf("window.Babel.transform"))
  })

  it("compiles the js tab through babel's react preset", () => {
    const doc = buildPreviewDocument(project())

    expect(doc).toContain('presets: ["react"]')
    expect(doc).toContain('filename: "main.jsx"')
    expect(doc).toContain("new Function(compiled)()")
  })

  it("stringifies the js tab so quotes and newlines survive the inline script", () => {
    const js = `const msg = 'it\\'s "quoted"'\n// line two`
    const doc = buildPreviewDocument(project({ js }))

    expect(doc).toContain(`var source = ${JSON.stringify(js)}`)
  })

  it("pins the canvas size in the reset stylesheet", () => {
    const doc = buildPreviewDocument(project({ width: 640, height: 480 }))

    expect(doc).toContain("width: 640px; height: 480px;")
    expect(doc).toContain("overflow: hidden;")
  })

  it("passes the canvas size to html2canvas so exports match the frame", () => {
    const doc = buildPreviewDocument(project({ width: 640, height: 480 }))

    expect(doc).toContain("width: 640")
    expect(doc).toContain("height: 480")
    expect(doc).toContain("windowWidth: 640")
    expect(doc).toContain("windowHeight: 480")
  })

  it("handles a project with no assets or fonts", () => {
    const doc = buildPreviewDocument(project({ assets: [], fonts: [] }))

    expect(doc).toContain("<style></style>")
    expect(doc).toContain("<script></script>")
    expect(doc).not.toContain("@font-face")
  })

  describe("rasterizer", () => {
    it("loads the vendored html2canvas-pro from our own origin, not a CDN", () => {
      const doc = buildPreviewDocument(project())

      expect(doc).toContain(
        `src="${import.meta.env.BASE_URL}vendor/html2canvas-pro-2.4.3.min.js"`
      )
      expect(doc).not.toMatch(/src="https:\/\/[^"]*html2canvas/)
    })

    it("loads babel standalone from a CDN", () => {
      const doc = buildPreviewDocument(project())

      expect(doc).toContain(
        'src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"'
      )
    })
  })

  describe("capture protocol", () => {
    it("only responds to our own capture message type", () => {
      const doc = buildPreviewDocument(project())

      expect(doc).toContain('if (!data || data.type !== "canvas-tool:capture") return')
    })

    it("answers results and errors back to the parent, echoing the requestId", () => {
      const doc = buildPreviewDocument(project())

      expect(doc).toContain('type: "canvas-tool:capture-result"')
      expect(doc).toContain('type: "canvas-tool:capture-error"')
      expect(doc.match(/requestId: data\.requestId/g)).toHaveLength(2)
    })

    it("honours transparent, format and quality from the request payload", () => {
      const doc = buildPreviewDocument(project())

      expect(doc).toContain("backgroundColor: opts.transparent ? null : \"#ffffff\"")
      expect(doc).toContain("useCORS: true")
      expect(doc).toContain('"image/" + (opts.format || "png"), opts.quality || 0.92')
    })
  })

  it("surfaces js compile errors in the preview instead of failing silently", () => {
    const doc = buildPreviewDocument(project())

    expect(doc).toContain("console.error(err)")
    expect(doc).toContain('document.createElement("pre")')
  })
})