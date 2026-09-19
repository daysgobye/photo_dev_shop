export type SnippetKind = "react" | "vanilla"

export type SimpleFilterKey =
  | "blur"
  | "brightness"
  | "contrast"
  | "grayscale"
  | "sepia"
  | "saturate"
  | "hueRotate"
  | "invert"
  | "opacity"

export interface DropShadowDraft {
  x: number
  y: number
  blur: number
  color: string
}

/** Session-only filter settings for one asset. Absent keys = filter off. */
export interface FilterDraft {
  blur?: number
  brightness?: number
  contrast?: number
  grayscale?: number
  sepia?: number
  saturate?: number
  hueRotate?: number
  invert?: number
  opacity?: number
  dropShadow?: DropShadowDraft
}

export interface SimpleFilterDefinition {
  id: SimpleFilterKey
  label: string
  cssFunction: string
  slider: {
    min: number
    max: number
    step: number
    default: number
    unit: string
  }
}

export const SIMPLE_FILTERS: SimpleFilterDefinition[] = [
  {
    id: "blur",
    label: "Blur",
    cssFunction: "blur",
    slider: { min: 0, max: 20, step: 1, default: 0, unit: "px" },
  },
  {
    id: "brightness",
    label: "Brightness",
    cssFunction: "brightness",
    slider: { min: 0, max: 300, step: 5, default: 100, unit: "%" },
  },
  {
    id: "contrast",
    label: "Contrast",
    cssFunction: "contrast",
    slider: { min: 0, max: 300, step: 5, default: 100, unit: "%" },
  },
  {
    id: "grayscale",
    label: "Grayscale",
    cssFunction: "grayscale",
    slider: { min: 0, max: 100, step: 1, default: 0, unit: "%" },
  },
  {
    id: "sepia",
    label: "Sepia",
    cssFunction: "sepia",
    slider: { min: 0, max: 100, step: 1, default: 0, unit: "%" },
  },
  {
    id: "saturate",
    label: "Saturate",
    cssFunction: "saturate",
    slider: { min: 0, max: 300, step: 5, default: 100, unit: "%" },
  },
  {
    id: "hueRotate",
    label: "Hue rotate",
    cssFunction: "hue-rotate",
    slider: { min: 0, max: 360, step: 1, default: 0, unit: "deg" },
  },
  {
    id: "invert",
    label: "Invert",
    cssFunction: "invert",
    slider: { min: 0, max: 100, step: 1, default: 0, unit: "%" },
  },
  {
    id: "opacity",
    label: "Opacity",
    cssFunction: "opacity",
    slider: { min: 0, max: 100, step: 1, default: 100, unit: "%" },
  },
]

export const DROP_SHADOW_DEFAULTS: DropShadowDraft = {
  x: 4,
  y: 4,
  blur: 16,
  color: "#000000",
}

export function hasActiveFilters(draft: FilterDraft): boolean {
  return (
    SIMPLE_FILTERS.some((def) => draft[def.id] !== undefined) ||
    draft.dropShadow !== undefined
  )
}

/** The `filter:` value (without the declaration), e.g. "blur(4px) grayscale(50%)". */
export function filterFunctions(draft: FilterDraft): string {
  const parts: string[] = []
  for (const def of SIMPLE_FILTERS) {
    const value = draft[def.id]
    if (value === undefined) continue
    parts.push(`${def.cssFunction}(${value}${def.slider.unit})`)
  }
  const ds = draft.dropShadow
  if (ds) {
    parts.push(`drop-shadow(${ds.x}px ${ds.y}px ${ds.blur}px ${ds.color})`)
  }
  return parts.join(" ")
}

/** The declarations that go inside a generated class rule, e.g. "filter: …;". */
export function buildFilterCss(draft: FilterDraft): string {
  const filter = filterFunctions(draft)
  return filter ? `filter: ${filter};` : ""
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * A short, deterministic slug for a filter combination: the first three letters
 * of each active filter in catalog order (drop-shadow last), e.g. "blu-gra".
 * Empty when no filters are active.
 */
export function filterSlug(draft: FilterDraft): string {
  const parts = SIMPLE_FILTERS.filter(
    (def) => draft[def.id] !== undefined
  ).map((def) => def.id.slice(0, 3))
  if (draft.dropShadow) parts.push("dro")
  return parts.join("-")
}

/**
 * Unique class name for an asset's filter combination, e.g. "image1-blu-gra".
 * Encoding the combination means a different set of filters gets a different
 * class instead of overwriting the previous one.
 */
export function filterClassName(varName: string, draft: FilterDraft): string {
  return `${varName}-${filterSlug(draft)}`
}

function exactBlockPattern(className: string): RegExp {
  const name = escapeRegExp(className)
  return new RegExp(
    `\\/\\* canvas-tool:filter:${name} \\*\\/[\\s\\S]*?\\/\\* \\/canvas-tool:filter:${name} \\*\\/\\n?`
  )
}

/** The full marker-wrapped rule a filter is stored as inside the project's CSS tab. */
export function buildFilterRuleBlock(
  className: string,
  declarations: string
): string {
  const indented = declarations
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n")
  return (
    `/* canvas-tool:filter:${className} */\n` +
    `.${className} {\n${indented}\n}\n` +
    `/* /canvas-tool:filter:${className} */`
  )
}

/**
 * Upserts a filter rule for a class into a CSS string: replaces the existing
 * marker block if present, otherwise appends it at the end. Idempotent — running
 * it again with unchanged declarations is a no-op.
 */
export function injectFilterCss(
  css: string,
  className: string,
  declarations: string
): string {
  const block = buildFilterRuleBlock(className, declarations)
  const pattern = exactBlockPattern(className)
  if (pattern.test(css)) {
    return css.replace(pattern, () => `${block}\n`)
  }
  const trimmed = css.trimEnd()
  return trimmed ? `${trimmed}\n${block}\n` : `${block}\n`
}

/**
 * Removes every filter rule belonging to an asset, regardless of which filter
 * combination it was generated for. Used when filters are cleared and when an
 * asset is deleted.
 */
export function removeFilterCss(css: string, varName: string): string {
  const pattern =
    /\/\* canvas-tool:filter:([^\s*]+) \*\/[\s\S]*?\/\* \/canvas-tool:filter:[^\s*]+ \*\/\n?/g
  return css.replace(pattern, (match, className: string) =>
    className === varName || className.startsWith(`${varName}-`) ? "" : match
  )
}

export function buildReactSnippet(varName: string, className?: string): string {
  const cls = className ? ` className="${className}"` : ""
  return `<img src={${varName}} alt=""${cls} style={{ width: "100%", height: "auto" }} />`
}

export function buildVanillaSnippet(
  varName: string,
  className?: string
): string {
  const classLine = className
    ? `img.className = ${JSON.stringify(className)}\n`
    : ""
  return `const img = document.createElement("img")\nimg.src = ${varName}\n${classLine}document.body.appendChild(img)`
}

export function buildSnippet(
  varName: string,
  kind: SnippetKind,
  className?: string
): string {
  return kind === "react"
    ? buildReactSnippet(varName, className)
    : buildVanillaSnippet(varName, className)
}
