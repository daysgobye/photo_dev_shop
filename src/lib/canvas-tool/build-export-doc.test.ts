import { describe, expect, it } from "vitest"
import {
  buildExportDocument,
  minifyHtml,
} from "@/lib/canvas-tool/build-export-doc"
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
    css: `.box { color: red; }\n\n.box { animation: spin 2s linear infinite; }`,
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

describe("buildExportDocument", () => {
  it("produces a self-contained doc inlining assets, fonts, css and compiled js", () => {
    const doc = buildExportDocument(
      project(),
      "var compiled=1;",
      "body{color:red}"
    )

    expect(doc).toContain('<div id="root"></div>')
    expect(doc).toContain('window["bg"]="data:image/png;base64,iVBORw0KGgo="')
    expect(doc).toContain("@font-face")
    expect(doc).toContain("data:font/woff2;base64,d09GMgABAAAA")
    expect(doc).toContain("body{color:red}")
    expect(doc).toContain("var compiled=1;")
    expect(doc).toContain("scale(1)")
  })

  it("ships no preview/rasterization machinery", () => {
    const doc = buildExportDocument(
      project(),
      "var compiled=1;",
      "body{color:red}"
    )

    expect(doc).not.toContain("html2canvas")
    expect(doc).not.toContain("babel")
    expect(doc).not.toContain("canvas-tool:capture")
    expect(doc).not.toContain("postMessage")
  })

  it("embeds the scale-to-fit wrapper with the project dimensions", () => {
    const doc = buildExportDocument(
      project({ width: 640, height: 480 }),
      "var compiled=1;",
      "body{color:red}"
    )

    expect(doc).toContain("width:640px!important")
    expect(doc).toContain("height:480px!important")
    expect(doc).toContain("Math.min(innerWidth/640,innerHeight/480)")
  })

  it("keeps CDN script/src tags authored in the html tab", () => {
    const doc = buildExportDocument(
      project({
        html: '<script src="https://unpkg.com/react@18/umd/react.development.js"></script><div id="root"></div>',
      }),
      "var compiled=1;",
      "body{color:red}"
    )

    expect(doc).toContain(
      '<script src="https://unpkg.com/react@18/umd/react.development.js"></script>'
    )
  })
})

describe("minifyHtml", () => {
  it("collapses whitespace-only runs between tags", () => {
    expect(minifyHtml("<div>\n  \n  <span>x</span>\n</div>")).toBe(
      "<div> <span>x</span> </div>"
    )
  })

  it("leaves non-whitespace text untouched", () => {
    expect(minifyHtml("<p>Hello   world</p>")).toBe("<p>Hello   world</p>")
  })

  it("preserves <pre> content verbatim", () => {
    const html = "<pre>  line one\n    line two  </pre>"
    expect(minifyHtml(html)).toBe(html)
  })

  it("preserves inline <script> content verbatim", () => {
    const html = '<script>\n  const s = "a  b"\n</script>'
    expect(minifyHtml(html)).toBe(html)
  })

  it("drops comments", () => {
    expect(minifyHtml("<div><!-- note --><span>x</span></div>")).toBe(
      "<div><span>x</span></div>"
    )
  })

  it("does not treat < inside text as a tag", () => {
    expect(minifyHtml("<p>3 < 5</p>")).toBe("<p>3 < 5</p>")
  })
})
