import * as React from "react"
import { Group, Panel, useDefaultLayout } from "react-resizable-panels"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/canvas-tool/code-editor"
import { PreviewFrame, type PreviewFrameHandle } from "@/components/canvas-tool/preview-frame"
import { DocumentControls } from "@/components/canvas-tool/document-controls"
import { AssetManager } from "@/components/canvas-tool/asset-manager"
import { ProjectIO } from "@/components/canvas-tool/project-io"
import { ResizeHandle } from "@/components/canvas-tool/resize-handle"
import { createDefaultProject } from "@/lib/canvas-tool/templates"
import type { CanvasProject, EditorTabId, ImageExportFormat } from "@/types/canvas-tool"

export function CanvasTool() {
  const [project, setProject] = React.useState<CanvasProject>(() => createDefaultProject("react"))
  const previewRef = React.useRef<PreviewFrameHandle>(null)
  const [exportFormat, setExportFormat] = React.useState<ImageExportFormat>("png")
  const [busy, setBusy] = React.useState(false)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "canvas-tool-panels",
    storage: window.localStorage,
  })

  const patch = (next: Partial<CanvasProject>) => setProject((prev) => ({ ...prev, ...next }))
  const updateCode = (tab: EditorTabId, value: string) =>
    patch({ [tab]: value } as Partial<CanvasProject>)

  const handleExportImage = async () => {
    setBusy(true)
    try {
      const dataUrl = await previewRef.current?.capture(exportFormat, 0.92, exportFormat === "png")
      if (!dataUrl) return
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `${project.name || "canvas-export"}.${exportFormat === "jpeg" ? "jpg" : "png"}`
      a.click()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex h-svh flex-col gap-3 bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <DocumentControls project={project} onChange={patch} />
        <div className="flex items-center gap-2">
          <ProjectIO project={project} onLoad={setProject} />
          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={exportFormat}
            onChange={(event) => setExportFormat(event.target.value as ImageExportFormat)}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
          <Button size="sm" onClick={handleExportImage} disabled={busy}>
            {busy ? "Exporting…" : "Export image"}
          </Button>
        </div>
      </div>

      <Group
        orientation="horizontal"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
        className="min-h-0 flex-1"
      >
        <Panel id="editor" defaultSize="38%" minSize="20%" className="min-h-0" collapsible={true}>
          <CodeEditor html={project.html} css={project.css} js={project.js} onChange={updateCode} />
        </Panel>
        <ResizeHandle />
        <Panel id="preview" defaultSize="42%" minSize="20%" className="min-h-0" collapsible={true}>
          <PreviewFrame ref={previewRef} project={project} />
        </Panel>
        <ResizeHandle />
        <Panel id="assets" defaultSize="20%" minSize="14%" maxSize="45%" className="min-h-0" collapsible={true}  >
          <div className="h-full overflow-auto rounded-lg border border-border bg-card p-3">
            <AssetManager assets={project.assets} onChange={(assets) => patch({ assets })} />
          </div>
        </Panel>
      </Group>
    </div>
  )
}
