import { describe, it, expect } from "vitest"
import { TEMPLATES } from "./templates"
import { getAspectRatio } from "./aspect-ratios"
import type { CanvasProject } from "@/types/canvas-tool"

function ratioConsistent(project: CanvasProject) {
  const ratio = getAspectRatio(project.aspectRatioId)
  if (ratio.ratio === null) return true
  return Math.abs(project.height - Math.round(project.width / ratio.ratio)) <= 1
}

describe("template catalog", () => {
  const builds = Object.entries(TEMPLATES)

  it("registers every template", () => {
    expect(builds.length).toBeGreaterThan(0)
  })

  it("has a mix of react and vanilla templates", () => {
    const modes = builds.map(([, build]) => build().mode)
    expect(modes).toContain("react")
    expect(modes).toContain("vanilla")
  })

  for (const [key, build] of builds) {
    describe(key, () => {
      const project = build()

      it("is a valid canvas project", () => {
        expect(project.formatVersion).toBe(1)
        expect(project.width).toBeGreaterThan(0)
        expect(project.height).toBeGreaterThan(0)
        expect(["react", "vanilla"]).toContain(project.mode)
        expect(project.name.length).toBeGreaterThan(0)
        expect(project.html.trim().length).toBeGreaterThan(0)
        expect(project.css.trim().length).toBeGreaterThan(0)
        expect(project.js.trim().length).toBeGreaterThan(0)
      })

      it("dimensions match its chosen aspect ratio", () => {
        expect(ratioConsistent(project)).toBe(true)
      })

      it("has a distinct name", () => {
        const duplicates = builds.filter(([, b]) => b().name === project.name)
        expect(duplicates.length).toBe(1)
      })

      it("names include the framework", () => {
        const suffix = project.mode === "react" ? "(React)" : "(Vanilla)"
        expect(project.name.endsWith(suffix)).toBe(true)
      })

      it("placeholder photos use a swap-able placehold.co URL", () => {
        const authored = project.mode === "react" ? project.js : project.html
        if (authored.includes("photo-fill")) {
          expect(authored).toMatch(/placehold\.co/)
          expect(authored).toMatch(/PHOTO/)
        }
      })

      it("is responsive: scalable units + aspect-ratio reflow", () => {
        expect(project.css).toMatch(/clamp\(|vmin/)
        expect(project.css).toMatch(/@media\s*\([^)]*aspect-ratio/)
      })

      it("fills the frame: html/body are full-height and react mounts into a full-height #root", () => {
        expect(project.css).toMatch(/height:\s*100%\s*;/)
        if (project.mode === "react") {
          expect(project.css).toMatch(/#root/)
        }
      })

      if (project.mode === "react") {
        it("boots react via CDN and mounts with createRoot", () => {
          expect(project.html).toMatch(/unpkg\.com\/react@/)
          expect(project.js).toMatch(/ReactDOM\.createRoot/)
        })
      } else {
        it("doesn't depend on a framework", () => {
          expect(project.html).not.toMatch(/unpkg\.com\/react@/)
        })
      }
    })
  }
})