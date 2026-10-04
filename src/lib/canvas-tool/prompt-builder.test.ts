import { describe, expect, it } from "vitest"
import {
  buildEditProjectPrompt,
  buildNewProjectPrompt,
} from "@/lib/canvas-tool/prompt-builder"
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

const newPrompt = (p: CanvasProject = project()) => buildNewProjectPrompt(p)
const editPrompt = (p: CanvasProject = project()) => buildEditProjectPrompt(p)

describe("environment explainer", () => {
  it("describes the canvas size and aspect ratio for both prompt kinds", () => {
    for (const prompt of [newPrompt(), editPrompt()]) {
      expect(prompt).toContain("800×600px")
      expect(prompt).toContain("aspect ratio: 4:3")
    }
  })

  it("explains what each of the three tabs does", () => {
    for (const prompt of [newPrompt(), editPrompt()]) {
      expect(prompt).toContain("HTML tab:")
      expect(prompt).toContain("CSS tab:")
      expect(prompt).toContain("JS/JSX tab:")
    }
  })

  it("tells the model that libraries load from the html tab before js runs", () => {
    expect(newPrompt()).toContain("<script src=")
    expect(newPrompt()).toContain("before the JS tab executes")
  })

  it("notes jsx is always available, compiled through babel's react preset", () => {
    expect(newPrompt()).toContain("React preset")
    expect(newPrompt()).toContain("no bundler")
  })

  it("tells the model the rendered result is a fixed-size sandboxed iframe", () => {
    expect(newPrompt()).toContain("sandboxed iframe")
  })

  describe("current mode", () => {
    it("tells a react-mode model to expect React and ReactDOM as globals", () => {
      const prompt = newPrompt(project({ mode: "react" }))

      expect(prompt).toContain("Current mode: react.")
      expect(prompt).toContain("ReactDOM.createRoot")
    })

    it("tells a vanilla-mode model no framework is assumed", () => {
      const prompt = newPrompt(project({ mode: "vanilla" }))

      expect(prompt).toContain("Current mode: vanilla.")
      expect(prompt).toContain("No framework is assumed")
      expect(prompt).not.toContain("ReactDOM.createRoot")
    })
  })

  describe("asset list", () => {
    it("names each variable, its file, and how to use it", () => {
      const prompt = newPrompt()

      expect(prompt).toContain("- `bg` — global JS variable holding the data URL for \"bg.png\".")
      expect(prompt).toContain("el.src = bg")
    })

    it("says so explicitly when no images are uploaded", () => {
      expect(newPrompt(project({ assets: [] }))).toContain("- (none uploaded)")
    })
  })

  describe("font list", () => {
    it("names each family, its file, and that it is already registered", () => {
      const prompt = newPrompt()

      expect(prompt).toContain('- "Test Font" — from "test.woff2".')
      expect(prompt).toContain("@font-face")
      expect(prompt).toContain('font-family: "Test Font", sans-serif;')
    })

    it("says so explicitly when no fonts are uploaded", () => {
      expect(newPrompt(project({ fonts: [] }))).toContain("- (none uploaded)")
    })
  })
})

describe("buildNewProjectPrompt", () => {
  it("asks for three labelled code blocks", () => {
    const prompt = newPrompt()

    expect(prompt).toContain("HTML, CSS, and JS/JSX")
    expect(prompt).toContain("three clearly labeled code blocks")
  })

  it("leaves room for the user's request at the end", () => {
    expect(newPrompt().trimEnd().endsWith("What I want:")).toBe(true)
  })

  it("does not leak the current tab contents into the prompt", () => {
    const prompt = newPrompt()

    expect(prompt).not.toContain("--- HTML tab ---")
    expect(prompt).not.toContain(".box { color: red; }")
  })
})

describe("buildEditProjectPrompt", () => {
  it("embeds all three tabs verbatim, each under its own heading", () => {
    const prompt = editPrompt()

    expect(prompt).toContain("--- HTML tab ---\n<div id=\"root\"></div>")
    expect(prompt).toContain("--- CSS tab ---\n.box { color: red; }")
    expect(prompt).toContain(
      "--- JS/JSX tab ---\nfunction App() { return <div className=\"box\">hi</div> }"
    )
  })

  it("asks for full replacement contents, not a diff or partial snippet", () => {
    const prompt = editPrompt()

    expect(prompt).toContain("full, updated contents of every tab")
    expect(prompt).toContain("not a diff or partial snippet")
  })

  it("leaves room for the requested change at the end", () => {
    expect(editPrompt().trimEnd().endsWith("What I want changed:")).toBe(true)
  })

  it("embeds multi-line tab contents without mangling them", () => {
    const js = `const a = 1\nconst b = 2\nconsole.log(a + b)`
    const prompt = editPrompt(project({ js }))

    expect(prompt).toContain(`--- JS/JSX tab ---\n${js}`)
  })
})