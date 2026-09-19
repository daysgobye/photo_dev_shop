import { describe, expect, it } from "vitest"
import {
  buildFilterCss,
  buildFilterRuleBlock,
  buildReactSnippet,
  buildSnippet,
  buildVanillaSnippet,
  filterClassName,
  filterFunctions,
  filterSlug,
  hasActiveFilters,
  injectFilterCss,
  removeFilterCss,
  type FilterDraft,
} from "@/lib/canvas-tool/image-filter-css"

describe("filterFunctions", () => {
  it("joins enabled simple filters in catalog order", () => {
    const draft: FilterDraft = { blur: 4, grayscale: 50, brightness: 120 }
    expect(filterFunctions(draft)).toBe(
      "blur(4px) brightness(120%) grayscale(50%)"
    )
  })

  it("skips disabled filters", () => {
    expect(filterFunctions({ sepia: 35 })).toBe("sepia(35%)")
    expect(filterFunctions({})).toBe("")
  })

  it("appends drop-shadow last", () => {
    const draft: FilterDraft = {
      grayscale: 100,
      dropShadow: { x: 2, y: 5, blur: 8, color: "#000000" },
    }
    expect(filterFunctions(draft)).toBe(
      "grayscale(100%) drop-shadow(2px 5px 8px #000000)"
    )
  })
})

describe("hasActiveFilters", () => {
  it("is false for an empty draft", () => {
    expect(hasActiveFilters({})).toBe(false)
  })

  it("is true for any single filter", () => {
    expect(hasActiveFilters({ blur: 2 })).toBe(true)
    expect(
      hasActiveFilters({ dropShadow: { x: 0, y: 0, blur: 0, color: "#000" } })
    ).toBe(true)
  })
})

describe("buildFilterCss", () => {
  it("emits only the enabled filters", () => {
    const draft: FilterDraft = { blur: 4, grayscale: 50 }
    expect(buildFilterCss(draft)).toBe("filter: blur(4px) grayscale(50%);")
  })

  it("returns empty for a blank draft", () => {
    expect(buildFilterCss({})).toBe("")
  })
})

describe("filterSlug", () => {
  it("is empty for no filters", () => {
    expect(filterSlug({})).toBe("")
  })

  it("uses the first three letters of each filter in catalog order", () => {
    expect(filterSlug({ grayscale: 50, blur: 4 })).toBe("blu-gra")
    expect(filterSlug({ hueRotate: 90 })).toBe("hue")
    expect(filterSlug({ sepia: 20, saturate: 80 })).toBe("sep-sat")
  })

  it("appends drop-shadow last", () => {
    expect(filterSlug({ dropShadow: { x: 1, y: 1, blur: 2, color: "#000" } })).toBe(
      "dro"
    )
    expect(
      filterSlug({
        grayscale: 100,
        dropShadow: { x: 1, y: 1, blur: 2, color: "#000" },
      })
    ).toBe("gra-dro")
  })
})

describe("className + rule blocks", () => {
  it("derives a class name from the var name and filter combination", () => {
    expect(filterClassName("image1", {})).toBe("image1-")
    expect(filterClassName("image1", { blur: 4 })).toBe("image1-blu")
    expect(filterClassName("image1", { blur: 4, grayscale: 50 })).toBe(
      "image1-blu-gra"
    )
  })

  it("wraps declarations in markers", () => {
    expect(buildFilterRuleBlock("image1-blu", "filter: blur(4px);")).toBe(
      "/* canvas-tool:filter:image1-blu */\n.image1-blu {\n  filter: blur(4px);\n}\n/* /canvas-tool:filter:image1-blu */"
    )
  })
})

const CSS =
  "html, body { margin: 0; height: 100%; }\n" +
  ".hero { color: red; }\n" +
  "/* canvas-tool:filter:image1-blu */\n" +
  ".image1-blu {\n" +
  "  filter: blur(4px);\n" +
  "}\n" +
  "/* /canvas-tool:filter:image1-blu */\n" +
  ".footer { color: blue; }"

describe("injectFilterCss", () => {
  it("appends a marker block when absent", () => {
    const out = injectFilterCss(
      "body { margin: 0; }\n",
      "image1-blu",
      "filter: blur(4px);"
    )
    expect(out).toContain("body { margin: 0; }")
    expect(out).toContain("/* canvas-tool:filter:image1-blu */")
    expect(out).toContain(".image1-blu")
    expect(out).toContain("/* /canvas-tool:filter:image1-blu */\n")
  })

  it("replaces an existing block in place, preserving surroundings", () => {
    const out = injectFilterCss(CSS, "image1-blu", "filter: sepia(50%);")
    expect(out).toContain("filter: sepia(50%);")
    expect(out).not.toContain("filter: blur(4px);")
    expect(out).toContain(".hero { color: red; }")
    expect(out).toContain(".footer { color: blue; }")
    expect(out.match(/canvas-tool:filter:image1-blu/g)).toHaveLength(2)
    expect(out).toContain("/* /canvas-tool:filter:image1-blu */\n")
  })

  it("is idempotent for unchanged declarations", () => {
    const once = injectFilterCss("body {}\n", "image1-blu", "filter: blur(4px);")
    const twice = injectFilterCss(once, "image1-blu", "filter: blur(4px);")
    expect(twice).toBe(once)
  })

  it("keeps a canonical trailing newline through repeated upserts", () => {
    const once = injectFilterCss(CSS, "image2-sep", "filter: sepia(10%);")
    const twice = injectFilterCss(once, "image2-sep", "filter: sepia(10%);")
    expect(twice).toBe(once)
    expect(twice).toMatch(/\/canvas-tool:filter:image2-sep \*\/\n$/)
  })

  it("keeps distinct blocks for different filter combinations", () => {
    const first = injectFilterCss("", "image1-blu", "filter: blur(2px);")
    const second = injectFilterCss(first, "image1-gra", "filter: grayscale(1);")
    expect(second).toContain(".image1-blu")
    expect(second).toContain(".image1-gra")
    expect(second.match(/canvas-tool:filter:/g)).toHaveLength(4)
  })

  it("manages multiple assets independently", () => {
    const a = injectFilterCss("", "image1-blu", "filter: blur(2px);")
    const ab = injectFilterCss(a, "image2-sep", "filter: sepia(10%);")
    expect(ab).toContain("image1-blu")
    expect(ab).toContain("image2-sep")
    expect(ab.match(/canvas-tool:filter:/g)).toHaveLength(4)
  })
})

describe("removeFilterCss", () => {
  it("strips the marker block and keeps everything else", () => {
    const out = removeFilterCss(CSS, "image1")
    expect(out).not.toContain("canvas-tool:filter:image1-blu")
    expect(out).toContain(".hero { color: red; }")
    expect(out).toContain(".footer { color: blue; }")
  })

  it("removes every filter combination belonging to the asset", () => {
    const a = injectFilterCss("", "image1-blu", "filter: blur(2px);")
    const b = injectFilterCss(a, "image1-gra", "filter: grayscale(1);")
    const c = injectFilterCss(b, "image2-sep", "filter: sepia(10%);")
    const out = removeFilterCss(c, "image1")
    expect(out).not.toContain("image1-blu")
    expect(out).not.toContain("image1-gra")
    expect(out).toContain("image2-sep")
  })

  it("does not touch assets whose name shares a prefix", () => {
    const css = injectFilterCss("", "image10-gra", "filter: grayscale(1);")
    expect(removeFilterCss(css, "image1")).toBe(css)
  })

  it("is a no-op when the block is absent", () => {
    expect(removeFilterCss(CSS, "nonexistent")).toBe(CSS)
  })
})

describe("snippets", () => {
  it("builds a plain react img snippet", () => {
    expect(buildReactSnippet("image1")).toBe(
      `<img src={image1} alt="" style={{ width: "100%", height: "auto" }} />`
    )
  })

  it("adds a className to the react snippet", () => {
    expect(buildReactSnippet("image1", "image1-blu")).toBe(
      `<img src={image1} alt="" className="image1-blu" style={{ width: "100%", height: "auto" }} />`
    )
  })

  it("builds a plain vanilla snippet", () => {
    expect(buildVanillaSnippet("image1")).toBe(
      `const img = document.createElement("img")\nimg.src = image1\ndocument.body.appendChild(img)`
    )
  })

  it("sets className in the vanilla snippet", () => {
    expect(buildVanillaSnippet("image1", "image1-blu")).toBe(
      `const img = document.createElement("img")\nimg.src = image1\nimg.className = "image1-blu"\ndocument.body.appendChild(img)`
    )
  })

  it("routes through buildSnippet by kind", () => {
    expect(buildSnippet("image1", "react", "image1-blu")).toContain(
      'className="image1-blu"'
    )
    expect(buildSnippet("image1", "vanilla", "image1-blu")).toContain(
      'img.className = "image1-blu"'
    )
  })
})
