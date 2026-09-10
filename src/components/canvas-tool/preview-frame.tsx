import * as React from "react"
import type { CanvasProject, ImageExportFormat } from "@/types/canvas-tool"
import { buildPreviewDocument } from "@/lib/canvas-tool/build-preview-doc"

export interface PreviewFrameHandle {
  capture: (format: ImageExportFormat, quality?: number, transparent?: boolean) => Promise<string>
}

interface PreviewFrameProps {
  project: CanvasProject
  /** Bump this whenever project code changes for a reason callers need to track (e.g. the AI agent). */
  generation?: number
  /** Fired when the current generation's code throws, synchronously or asynchronously. */
  onRuntimeError?: (message: string, generation: number) => void
}

export const PreviewFrame = React.forwardRef<PreviewFrameHandle, PreviewFrameProps>(
  function PreviewFrame({ project, generation = 0, onRuntimeError }, ref) {
    const iframeRef = React.useRef<HTMLIFrameElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [scale, setScale] = React.useState(1)
    const pendingCaptures = React.useRef(
      new Map<string, { resolve: (value: string) => void; reject: (error: Error) => void }>()
    )

    const srcDoc = React.useMemo(
      () => buildPreviewDocument(project, generation),
      [project, generation]
    )

    // Keep the preview scaled to fit its container, capped at 1:1.
    React.useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const update = () => {
        const pad = 32
        const availW = el.clientWidth - pad
        const availH = el.clientHeight - pad
        const next = Math.min(availW / project.width, availH / project.height, 1)
        setScale(next > 0 ? next : 1)
      }
      update()
      const ro = new ResizeObserver(update)
      ro.observe(el)
      return () => ro.disconnect()
    }, [project.width, project.height])

    // Route capture results/errors back to whoever asked for them.
    React.useEffect(() => {
      const handler = (event: MessageEvent) => {
        const data = event.data
        if (!data || typeof data !== "object") return

        if (data.type === "canvas-tool:runtime-error") {
          onRuntimeError?.(String(data.message), Number(data.generation))
          return
        }

        if (data.type !== "canvas-tool:capture-result" && data.type !== "canvas-tool:capture-error") return
        const pending = pendingCaptures.current.get(data.requestId)
        if (!pending) return
        pendingCaptures.current.delete(data.requestId)
        if (data.type === "canvas-tool:capture-result") pending.resolve(data.dataUrl)
        else pending.reject(new Error(data.message || "Capture failed"))
      }
      window.addEventListener("message", handler)
      return () => window.removeEventListener("message", handler)
    }, [onRuntimeError])

    React.useImperativeHandle(ref, () => ({
      capture: (format, quality = 0.92, transparent = false) => {
        return new Promise<string>((resolve, reject) => {
          const win = iframeRef.current?.contentWindow
          if (!win) {
            reject(new Error("Preview isn't ready yet"))
            return
          }
          const requestId = Math.random().toString(36).slice(2)
          pendingCaptures.current.set(requestId, { resolve, reject })
          win.postMessage(
            { type: "canvas-tool:capture", requestId, payload: { format, quality, transparent } },
            "*"
          )
          setTimeout(() => {
            if (pendingCaptures.current.has(requestId)) {
              pendingCaptures.current.delete(requestId)
              reject(new Error("Capture timed out"))
            }
          }, 8000)
        })
      },
    }))

    return (
      <div
        ref={containerRef}
        className="flex h-full w-full items-center justify-center overflow-auto rounded-lg border border-border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#ffffff_0%_50%)] bg-[length:20px_20px] p-4"
      >
        <div style={{ width: project.width * scale, height: project.height * scale }} className="shadow-lg">
          <iframe
            ref={iframeRef}
            title="Canvas preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: project.width,
              height: project.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: "none",
              background: "white",
              display: "block",
            }}
          />
        </div>
      </div>
    )
  }
)
