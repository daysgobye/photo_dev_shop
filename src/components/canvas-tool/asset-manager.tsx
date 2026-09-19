import * as React from "react"
import { Check, Copy, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import type { CanvasAsset } from "@/types/canvas-tool"
import { copyToClipboard } from "@/lib/canvas-tool/clipboard"
import {
  DROP_SHADOW_DEFAULTS,
  SIMPLE_FILTERS,
  buildFilterCss,
  buildSnippet,
  filterClassName,
  filterFunctions,
  hasActiveFilters,
  injectFilterCss,
  removeFilterCss,
  type FilterDraft,
  type SimpleFilterDefinition,
  type SnippetKind,
} from "@/lib/canvas-tool/image-filter-css"

interface AssetManagerProps {
  assets: CanvasAsset[]
  onChange: (assets: CanvasAsset[]) => void
  css: string
  onCssChange: (css: string) => void
}

function nextVarName(assets: CanvasAsset[]) {
  const used = new Set(assets.map((asset) => asset.varName))
  let i = 1
  while (used.has(`image${i}`)) i++
  return `image${i}`
}

function singleValue(value: number | readonly number[]): number {
  return typeof value === "number" ? value : value[0]
}

function FilterToggle({
  label,
  active,
  valueLabel,
  onToggle,
}: {
  label: string
  active: boolean
  valueLabel?: string
  onToggle: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={active} onCheckedChange={onToggle} />
      <span className="text-[11px] leading-none font-medium">{label}</span>
      <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
        {active ? (valueLabel ?? "on") : "off"}
      </span>
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onValue,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onValue: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(value) => onValue(singleValue(value))}
      />
    </div>
  )
}

function FilterSliderRow({
  label,
  active,
  value,
  min,
  max,
  step,
  unit,
  onToggle,
  onValue,
}: {
  label: string
  active: boolean
  value: number | null
  min: number
  max: number
  step: number
  unit: string
  onToggle: (checked: boolean) => void
  onValue: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <FilterToggle
        label={label}
        active={active}
        valueLabel={active && value !== null ? `${value}${unit}` : undefined}
        onToggle={onToggle}
      />
      {active && value !== null && (
        <SliderRow
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          unit={unit}
          onValue={onValue}
        />
      )}
    </div>
  )
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="size-5 cursor-pointer rounded border border-border bg-transparent p-0"
      />
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
        {value}
      </span>
    </div>
  )
}

interface FilterEditorProps {
  asset: CanvasAsset
  draft: FilterDraft
  onDraftChange: (draft: FilterDraft) => void
}

function FilterEditor({ asset, draft, onDraftChange }: FilterEditorProps) {
  const filter = filterFunctions(draft) || undefined
  const active = hasActiveFilters(draft)
  const className = active ? filterClassName(asset.varName, draft) : null

  const toggleSimple = (def: SimpleFilterDefinition, checked: boolean) => {
    onDraftChange({
      ...draft,
      [def.id]: checked ? def.slider.default : undefined,
    })
  }

  const setSimple = (def: SimpleFilterDefinition, value: number) => {
    onDraftChange({ ...draft, [def.id]: value })
  }

  const toggleDropShadow = (checked: boolean) => {
    onDraftChange({
      ...draft,
      dropShadow: checked ? { ...DROP_SHADOW_DEFAULTS } : undefined,
    })
  }

  const patchNested = (
    key: "dropShadow",
    patch: Partial<NonNullable<FilterDraft[typeof key]>>
  ) => {
    const current = draft[key]
    if (!current) return
    onDraftChange({ ...draft, [key]: { ...current, ...patch } })
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-2">
      <img
        src={asset.dataUrl}
        alt="Filter preview"
        className="aspect-square w-full rounded border border-border object-cover"
        style={{ filter }}
      />

      <div className="flex flex-col gap-1.5">
        {SIMPLE_FILTERS.map((def) => {
          const active = draft[def.id] !== undefined
          return (
            <FilterSliderRow
              key={def.id}
              label={def.label}
              active={active}
              value={active ? (draft[def.id] as number) : null}
              min={def.slider.min}
              max={def.slider.max}
              step={def.slider.step}
              unit={def.slider.unit}
              onToggle={(checked) => toggleSimple(def, checked)}
              onValue={(value) => setSimple(def, value)}
            />
          )
        })}

        <FilterToggle
          label="Drop shadow"
          active={draft.dropShadow !== undefined}
          onToggle={toggleDropShadow}
        />
        {draft.dropShadow && (
          <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2">
            <SliderRow
              label="Offset X"
              value={draft.dropShadow.x}
              min={-100}
              max={100}
              step={1}
              unit="px"
              onValue={(value) => patchNested("dropShadow", { x: value })}
            />
            <SliderRow
              label="Offset Y"
              value={draft.dropShadow.y}
              min={-100}
              max={100}
              step={1}
              unit="px"
              onValue={(value) => patchNested("dropShadow", { y: value })}
            />
            <SliderRow
              label="Blur"
              value={draft.dropShadow.blur}
              min={0}
              max={100}
              step={1}
              unit="px"
              onValue={(value) => patchNested("dropShadow", { blur: value })}
            />
            <ColorRow
              label="Color"
              value={draft.dropShadow.color}
              onChange={(color) => patchNested("dropShadow", { color })}
            />
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground">
        Copy a snippet below to write this rule into the CSS tab as{" "}
        <code className="rounded bg-muted px-1">
          {className ? `.${className}` : `.${asset.varName}-<filters>`}
        </code>
        .
      </p>
    </div>
  )
}

export function AssetManager({
  assets,
  onChange,
  css,
  onCssChange,
}: AssetManagerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [copied, setCopied] = React.useState<string | null>(null)
  const [openDrafts, setOpenDrafts] = React.useState<
    Record<string, FilterDraft>
  >({})

  // One-shot drafts live only in this component. Drafts whose asset disappears
  // (e.g. a template/project load) become unreachable and are simply dropped on
  // the next edit — no cleanup state sync needed.

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const asset: CanvasAsset = {
        id: Math.random().toString(36).slice(2),
        varName: nextVarName(assets),
        fileName: file.name,
        dataUrl: String(reader.result),
      }
      onChange([...assets, asset])
    }
    reader.readAsDataURL(file)
  }

  const updateDraft = (
    id: string,
    updater: (draft: FilterDraft) => FilterDraft
  ) => {
    setOpenDrafts((current) => ({
      ...current,
      [id]: updater(current[id] ?? {}),
    }))
  }

  const toggleEditor = (id: string) => {
    setOpenDrafts((current) => {
      const next = { ...current }
      if (next[id]) delete next[id]
      else next[id] = {}
      return next
    })
  }

  const handleCopy = async (asset: CanvasAsset, kind: SnippetKind) => {
    const draft = openDrafts[asset.id] ?? {}
    const active = hasActiveFilters(draft)
    const className = active ? filterClassName(asset.varName, draft) : undefined
    const snippet = buildSnippet(asset.varName, kind, className)
    const ok = await copyToClipboard(snippet)
    if (ok) {
      const nextCss =
        active && className
          ? injectFilterCss(css, className, buildFilterCss(draft))
          : removeFilterCss(css, asset.varName)
      if (nextCss !== css) onCssChange(nextCss)
      const key = `${asset.id}:${kind}`
      setCopied(key)
      setTimeout(
        () => setCopied((current) => (current === key ? null : current)),
        1500
      )
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Images
        </span>
        <Button
          size="xs"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          + Add image
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
            event.target.value = ""
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {assets.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No images yet. Each one you add becomes a global variable (e.g.{" "}
            <code>image1</code>) you can reference directly in your JS/JSX —
            it's just a data URL string.
          </p>
        )}
        {assets.map((asset) => {
          const draft = openDrafts[asset.id]
          const editing = draft !== undefined
          return (
            <div
              key={asset.id}
              className="flex flex-col gap-2 rounded-md border border-border p-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={asset.dataUrl}
                  alt={asset.fileName}
                  className="size-8 rounded object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[11px] text-muted-foreground">
                    {asset.fileName}
                  </span>
                  <span className="truncate text-xs">
                    Use in JS as{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-semibold">
                      {asset.varName}
                    </code>
                  </span>
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => {
                    if (editing) {
                      setOpenDrafts((current) => {
                        const next = { ...current }
                        delete next[asset.id]
                        return next
                      })
                    }
                    const nextCss = removeFilterCss(css, asset.varName)
                    if (nextCss !== css) onCssChange(nextCss)
                    onChange(assets.filter((a) => a.id !== asset.id))
                  }}
                >
                  ×
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="xs"
                  variant={editing ? "secondary" : "outline"}
                  className="flex-1 gap-1"
                  onClick={() => toggleEditor(asset.id)}
                >
                  <SlidersHorizontal className="size-3" />
                  Filters
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => handleCopy(asset, "react")}
                >
                  {copied === `${asset.id}:react` ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  Copy React
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => handleCopy(asset, "vanilla")}
                >
                  {copied === `${asset.id}:vanilla` ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  Copy vanilla
                </Button>
              </div>
              {editing && (
                <FilterEditor
                  asset={asset}
                  draft={draft}
                  onDraftChange={(next) => updateDraft(asset.id, () => next)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
