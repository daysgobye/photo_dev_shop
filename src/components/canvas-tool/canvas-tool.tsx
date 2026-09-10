import * as React from "react"
import { Group, Panel, useDefaultLayout, type PanelImperativeHandle } from "react-resizable-panels"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/canvas-tool/code-editor"
import { PreviewFrame, type PreviewFrameHandle } from "@/components/canvas-tool/preview-frame"
import { DocumentControls } from "@/components/canvas-tool/document-controls"
import { AssetManager } from "@/components/canvas-tool/asset-manager"
import { ProjectIO } from "@/components/canvas-tool/project-io"
import { ResizeHandle } from "@/components/canvas-tool/resize-handle"
import { AiAgentPanel } from "@/components/canvas-tool/ai-agent-panel"
import { PanelShell } from "@/components/canvas-tool/panel-shell"
import { createDefaultProject } from "@/lib/canvas-tool/templates"
import type {
  AgentCode,
  AgentRenderOutcome,
  CanvasProject,
  EditorTabId,
  ImageExportFormat,
} from "@/types/canvas-tool"

/** How long to wait, after applying new code, for a runtime error before assuming it rendered fine. */
const RENDER_SETTLE_MS = 1200
/** Pixel width of a collapsed panel's icon-only rail. */
const COLLAPSED_PANEL_SIZE = 40

/** Keeps a Panel's collapsed boolean in sync, however the collapse was triggered (button or drag). */
function usePanelCollapse() {
  const panelRef = React.useRef<PanelImperativeHandle>(null)
  const [collapsed, setCollapsed] = React.useState(false)

  const handleResize = React.useCallback(() => {
    setCollapsed(panelRef.current?.isCollapsed() ?? false)
  }, [])

  const toggle = React.useCallback(() => {
    if (panelRef.current?.isCollapsed()) panelRef.current?.expand()
    else panelRef.current?.collapse()
  }, [])

  return { panelRef, collapsed, handleResize, toggle }
}

export function CanvasTool() {
  const [project, setProject] = React.useState<CanvasProject>(() => createDefaultProject("react"))
  const previewRef = React.useRef<PreviewFrameHandle>(null)
  const [exportFormat, setExportFormat] = React.useState<ImageExportFormat>("png")
  const [busy, setBusy] = React.useState(false)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "canvas-tool-panels",
    storage: window.localStorage,
  })

  const editorPanel = usePanelCollapse()
  const previewPanel = usePanelCollapse()
  const assetsPanel = usePanelCollapse()
  const agentPanel = usePanelCollapse()

  // Bumped every time the AI agent applies a new revision, so a runtime error
  // (which arrives async, via postMessage) can be matched to the attempt it
  // came from rather than a stale, already-superseded one.
  const [previewGeneration, setPreviewGeneration] = React.useState(0)
  const generationRef = React.useRef(0)
  const outcomeWaiters = React.useRef(new Map<number, (outcome: AgentRenderOutcome) => void>())

  const patch = React.useCallback(
    (next: Partial<CanvasProject>) => setProject((prev) => ({ ...prev, ...next })),
    []
  )
  const updateCode = React.useCallback(
    (tab: EditorTabId, value: string) => patch({ [tab]: value } as Partial<CanvasProject>),
    [patch]
  )

  const handleRuntimeError = React.useCallback((message: string, generation: number) => {
    const waiter = outcomeWaiters.current.get(generation)
    if (!waiter) return
    outcomeWaiters.current.delete(generation)
    waiter({ ok: false, error: message })
  }, [])

  const applyAgentCode = React.useCallback(
    (code: AgentCode) => {
      generationRef.current += 1
      const generation = generationRef.current
      setPreviewGeneration(generation)
      patch(code)
      return generation
    },
    [patch]
  )

  const waitForOutcome = React.useCallback((generation: number): Promise<AgentRenderOutcome> => {
    return new Promise((resolve) => {
      outcomeWaiters.current.set(generation, resolve)
      setTimeout(() => {
        if (!outcomeWaiters.current.has(generation)) return
        outcomeWaiters.current.delete(generation)
        resolve({ ok: true })
      }, RENDER_SETTLE_MS)
    })
  }, [])

  const captureAgentScreenshot = React.useCallback((): Promise<string> => {
    const capture = previewRef.current?.capture("png", 0.92, false)
    return capture ?? Promise.reject(new Error("Preview isn't ready yet"))
  }, [])

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
        <Panel
          id="editor"
          defaultSize="28%"
          minSize="16%"
          collapsible
          collapsedSize={COLLAPSED_PANEL_SIZE}
          panelRef={editorPanel.panelRef}
          onResize={editorPanel.handleResize}
          className="min-h-0"
        >
          <PanelShell title="Editor" collapsed={editorPanel.collapsed} onToggle={editorPanel.toggle}>
            <CodeEditor html={project.html} css={project.css} js={project.js} onChange={updateCode} />
          </PanelShell>
        </Panel>
        <ResizeHandle />
        <Panel
          id="preview"
          defaultSize="32%"
          minSize="18%"
          collapsible
          collapsedSize={COLLAPSED_PANEL_SIZE}
          panelRef={previewPanel.panelRef}
          onResize={previewPanel.handleResize}
          className="min-h-0"
        >
          <PanelShell title="Preview" collapsed={previewPanel.collapsed} onToggle={previewPanel.toggle}>
            <PreviewFrame
              ref={previewRef}
              project={project}
              generation={previewGeneration}
              onRuntimeError={handleRuntimeError}
            />
          </PanelShell>
        </Panel>
        <ResizeHandle />
        <Panel
          id="assets"
          defaultSize="16%"
          minSize="12%"
          maxSize="35%"
          collapsible
          collapsedSize={COLLAPSED_PANEL_SIZE}
          panelRef={assetsPanel.panelRef}
          onResize={assetsPanel.handleResize}
          className="min-h-0"
        >
          <PanelShell title="Assets" collapsed={assetsPanel.collapsed} onToggle={assetsPanel.toggle}>
            <div className="h-full overflow-auto rounded-lg border border-border bg-card p-3">
              <AssetManager assets={project.assets} onChange={(assets) => patch({ assets })} />
            </div>
          </PanelShell>
        </Panel>
        <ResizeHandle />
        <Panel
          id="agent"
          defaultSize="24%"
          minSize="18%"
          maxSize="45%"
          collapsible
          collapsedSize={COLLAPSED_PANEL_SIZE}
          panelRef={agentPanel.panelRef}
          onResize={agentPanel.handleResize}
          className="min-h-0"
        >
          <PanelShell title="AI Agent" collapsed={agentPanel.collapsed} onToggle={agentPanel.toggle}>
            <AiAgentPanel
              project={project}
              onApplyCode={applyAgentCode}
              waitForOutcome={waitForOutcome}
              captureScreenshot={captureAgentScreenshot}
            />
          </PanelShell>
        </Panel>
      </Group>
    </div>
  )
}
