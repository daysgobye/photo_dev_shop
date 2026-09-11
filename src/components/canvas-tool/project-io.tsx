import * as React from "react"
import { Button } from "@/components/ui/button"
import type { CanvasProject } from "@/types/canvas-tool"
import { TEMPLATES, TEMPLATE_GROUPS } from "@/lib/canvas-tool/templates"
interface ProjectIOProps {
  project: CanvasProject
  onLoad: (project: CanvasProject) => void
}

export function ProjectIO({ project, onLoad }: ProjectIOProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name || "canvas-project"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CanvasProject
        onLoad({ ...parsed })
      } catch {
        alert("That file isn't a valid canvas project JSON.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
        value=""
        onChange={(event) => {
          const key = event.target.value
          if (key && TEMPLATES[key]) onLoad(TEMPLATES[key]())
        }}
      >
        <option value="">Load template…</option>
        {TEMPLATE_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option.key} value={option.key}>
                {group.label} — {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) handleImportFile(file)
          event.target.value = ""
        }}
      />
      <Button size="sm" variant="outline" onClick={handleExport}>
        Export project
      </Button>
    </div>
  )
}
