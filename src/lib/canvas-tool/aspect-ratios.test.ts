import { describe, expect, it } from "vitest"
import { ASPECT_RATIOS, getAspectRatio } from "@/lib/canvas-tool/aspect-ratios"

describe("ASPECT_RATIOS", () => {
  it("is non-empty and starts with the free option", () => {
    expect(ASPECT_RATIOS.length).toBeGreaterThan(0)
    expect(ASPECT_RATIOS[0].id).toBe("free")
    expect(ASPECT_RATIOS[0].ratio).toBeNull()
  })

  it("has unique ids", () => {
    const ids = ASPECT_RATIOS.map((option) => option.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it("gives every constrained ratio a positive number", () => {
    for (const option of ASPECT_RATIOS) {
      if (option.ratio !== null) expect(option.ratio).toBeGreaterThan(0)
    }
  })

  it("keeps every id matching its numeric label", () => {
    for (const option of ASPECT_RATIOS) {
      if (option.id === "free") continue
      expect(option.label).toContain(option.id)
    }
  })

  it("computes each ratio as the canonical fraction", () => {
    const expected: Record<string, number> = {
      "1:1": 1,
      "4:5": 4 / 5,
      "16:9": 16 / 9,
      "9:16": 9 / 16,
      "4:3": 4 / 3,
    }

    for (const [id, ratio] of Object.entries(expected)) {
      expect(getAspectRatio(id).ratio).toBe(ratio)
    }
  })
})

describe("getAspectRatio", () => {
  it("resolves every declared id", () => {
    for (const option of ASPECT_RATIOS) {
      expect(getAspectRatio(option.id)).toBe(option)
    }
  })

  it("falls back to free for an unknown id", () => {
    expect(getAspectRatio("21:9")).toBe(ASPECT_RATIOS[0])
    expect(getAspectRatio("")).toBe(ASPECT_RATIOS[0])
  })
})