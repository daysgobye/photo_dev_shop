import { describe, expect, it } from "vitest"
import {
  getFontFormat,
  nextFontFamilyName,
  sanitizeFontFamilyName,
} from "@/lib/canvas-tool/fonts"

describe("getFontFormat", () => {
  it("maps every supported extension to its css format keyword", () => {
    expect(getFontFormat("MyFont.woff2")).toBe("woff2")
    expect(getFontFormat("MyFont.woff")).toBe("woff")
    expect(getFontFormat("MyFont.ttf")).toBe("truetype")
    expect(getFontFormat("MyFont.otf")).toBe("opentype")
    expect(getFontFormat("MyFont.eot")).toBe("embedded-opentype")
  })

  it("is case-insensitive about the extension", () => {
    expect(getFontFormat("MyFont.WOFF2")).toBe("woff2")
    expect(getFontFormat("MyFont.TTF")).toBe("truetype")
  })

  it("only reads the last extension", () => {
    expect(getFontFormat("archive.tar.woff2")).toBe("woff2")
  })

  it("defaults to woff2 for unknown or missing extensions", () => {
    expect(getFontFormat("MyFont")).toBe("woff2")
    expect(getFontFormat("MyFont.xyz")).toBe("woff2")
    expect(getFontFormat("")).toBe("woff2")
  })
})

describe("sanitizeFontFamilyName", () => {
  it("turns a filename into a css font-family name", () => {
    expect(sanitizeFontFamilyName("My-Cool_Font.woff2")).toBe("My Cool Font")
  })

  it("collapses every run of punctuation and separators into one space", () => {
    expect(sanitizeFontFamilyName("  __Deep--Space__Font__.ttf ")).toBe("Deep Space Font")
  })

  it("keeps letters and digits", () => {
    expect(sanitizeFontFamilyName("Inter2.woff2")).toBe("Inter2")
  })

  it("drops only the final extension, so inner dots survive as separators", () => {
    expect(sanitizeFontFamilyName("My.Font.v2.woff2")).toBe("My Font v2")
  })

  it("falls back to a usable name when nothing printable remains", () => {
    expect(sanitizeFontFamilyName("___.woff2")).toBe("Custom Font")
    expect(sanitizeFontFamilyName("")).toBe("Custom Font")
  })
})

describe("nextFontFamilyName", () => {
  const font = (fontFamily: string) => ({ fontFamily })

  it("returns the desired name when it is free", () => {
    expect(nextFontFamilyName([], "My Font")).toBe("My Font")
    expect(nextFontFamilyName([font("Other")], "My Font")).toBe("My Font")
  })

  it("suffixes a counter when the name is taken", () => {
    expect(nextFontFamilyName([font("My Font")], "My Font")).toBe("My Font 2")
    expect(
      nextFontFamilyName([font("My Font"), font("My Font 2")], "My Font")
    ).toBe("My Font 3")
  })

  it("fills the first free slot rather than counting up", () => {
    expect(
      nextFontFamilyName(
        [font("My Font"), font("My Font 3"), font("My Font 4")],
        "My Font"
      )
    ).toBe("My Font 2")
  })

  it("compares names case-sensitively, though css resolves them case-insensitively", () => {
    // Known sharp edge: uploading "my font.otf" after "My Font.otf" yields the
    // family "my font", which css then treats as the same family as "My Font".
    // Locked in here so the behaviour is deliberate rather than accidental —
    // a fix should make this comparison case-insensitive.
    expect(nextFontFamilyName([font("My Font")], "my font")).toBe("my font")
  })
})