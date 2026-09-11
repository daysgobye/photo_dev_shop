import type { FontFormat } from "@/types/canvas-tool"

const EXTENSION_FORMATS: Record<string, FontFormat> = {
  woff2: "woff2",
  woff: "woff",
  ttf: "truetype",
  otf: "opentype",
  eot: "embedded-opentype",
}

export function getFontFormat(fileName: string): FontFormat {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  return EXTENSION_FORMATS[ext] ?? "woff2"
}

/** Turns "My-Cool_Font.woff2" into "My Cool Font" */
export function sanitizeFontFamilyName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^./]+$/, "")
  const cleaned = withoutExt.replace(/[^a-zA-Z0-9]+/g, " ").trim()
  return cleaned || "Custom Font"
}

/** Avoids clobbering an existing font-family name already in the project */
export function nextFontFamilyName(fonts: { fontFamily: string }[], desired: string): string {
  const used = new Set(fonts.map((font) => font.fontFamily))
  if (!used.has(desired)) return desired
  let i = 2
  while (used.has(`${desired} ${i}`)) i++
  return `${desired} ${i}`
}
