import { ASPECT_RATIOS, getAspectRatio } from "@/lib/canvas-tool/aspect-ratios"
import type { CanvasProject } from "@/types/canvas-tool"

interface DocumentControlsProps {
  project: CanvasProject
  onChange: (patch: Partial<CanvasProject>) => void
}

export function DocumentControls({ project, onChange }: DocumentControlsProps) {
  const ratio = getAspectRatio(project.aspectRatioId)

  const setWidth = (width: number) => {
    if (!Number.isFinite(width) || width <= 0) return
    if (ratio.ratio) onChange({ width, height: Math.round(width / ratio.ratio) })
    else onChange({ width })
  }

  const setHeight = (height: number) => {
    if (!Number.isFinite(height) || height <= 0) return
    if (ratio.ratio) onChange({ height, width: Math.round(height * ratio.ratio) })
    else onChange({ height })
  }

  const setRatio = (id: string) => {
    const next = getAspectRatio(id)
    if (next.ratio) onChange({ aspectRatioId: id, height: Math.round(project.width / next.ratio) })
    else onChange({ aspectRatioId: id })
  }

  return (
    <div className="flex flex-wrap items-end gap-3 text-xs">
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Project name</span>
        <input
          type="text"
          value={project.name}
          onChange={(event) => onChange({ name: event.target.value })}
          className="h-8 w-40 rounded-md border border-border bg-background px-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Aspect ratio</span>
        <select
          value={project.aspectRatioId}
          onChange={(event) => setRatio(event.target.value)}
          className="h-8 rounded-md border border-border bg-background px-2"
        >
          {ASPECT_RATIOS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Width (px)</span>
        <input
          type="number"
          min={1}
          value={project.width}
          onChange={(event) => setWidth(Number(event.target.value))}
          className="h-8 w-24 rounded-md border border-border bg-background px-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Height (px)</span>
        <input
          type="number"
          min={1}
          value={project.height}
          onChange={(event) => setHeight(Number(event.target.value))}
          className="h-8 w-24 rounded-md border border-border bg-background px-2"
        />
      </label>
    </div>
  )
}
