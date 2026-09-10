import * as React from "react"
import { AlertTriangle, Check, Loader2, RefreshCw, Send, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { runAgentLoop } from "@/lib/canvas-tool/agent-loop"
import { listOpenRouterModels, type OpenRouterModelSummary } from "@/lib/canvas-tool/openrouter"
import type { AgentCode, AgentLogEntry, AgentRenderOutcome, CanvasProject } from "@/types/canvas-tool"

const STORAGE_KEY = "canvas-tool:agent-settings"

interface StoredSettings {
  apiKey?: string
  model?: string
}

function loadStoredSettings(): StoredSettings {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as StoredSettings
  } catch {
    return {}
  }
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

interface AiAgentPanelProps {
  project: CanvasProject
  onApplyCode: (code: AgentCode) => number
  waitForOutcome: (generation: number) => Promise<AgentRenderOutcome>
  captureScreenshot: () => Promise<string>
}

export function AiAgentPanel({ project, onApplyCode, waitForOutcome, captureScreenshot }: AiAgentPanelProps) {
  const [apiKey, setApiKey] = React.useState(() => loadStoredSettings().apiKey ?? "")
  const [model, setModel] = React.useState(() => loadStoredSettings().model ?? "")
  const [models, setModels] = React.useState<OpenRouterModelSummary[]>([])
  const [loadingModels, setLoadingModels] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")
  const [running, setRunning] = React.useState(false)
  const [log, setLog] = React.useState<AgentLogEntry[]>([])

  const abortControllerRef = React.useRef<AbortController | null>(null)
  const cancelledRef = React.useRef(false)
  const logScrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey, model }))
  }, [apiKey, model])

  React.useEffect(() => {
    logScrollRef.current?.scrollTo({ top: logScrollRef.current.scrollHeight })
  }, [log])

  const pushLog = React.useCallback((entry: Omit<AgentLogEntry, "id" | "timestamp">) => {
    setLog((prev) => [...prev, { id: makeId(), timestamp: Date.now(), ...entry }])
  }, [])

  const handleLoadModels = async () => {
    setLoadingModels(true)
    try {
      setModels(await listOpenRouterModels(apiKey || undefined))
    } catch {
      // The model field always accepts free text, so a failed fetch isn't fatal.
    } finally {
      setLoadingModels(false)
    }
  }

  const handleStop = () => {
    cancelledRef.current = true
    abortControllerRef.current?.abort()
  }

  const handleRun = async () => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || running) return

    if (!apiKey.trim() || !model.trim()) {
      pushLog({ kind: "error", text: "Add an OpenRouter API key and a model before building." })
      return
    }

    setRunning(true)
    pushLog({ kind: "user", text: trimmedPrompt })

    const controller = new AbortController()
    abortControllerRef.current = controller
    cancelledRef.current = false

    try {
      await runAgentLoop({
        apiKey,
        model,
        prompt: trimmedPrompt,
        mode: project.mode,
        initialCode: { html: project.html, css: project.css, js: project.js },
        signal: controller.signal,
        callbacks: {
          applyCode: onApplyCode,
          waitForOutcome,
          captureScreenshot,
          onEvent: pushLog,
          isCancelled: () => cancelledRef.current,
        },
      })
    } finally {
      setRunning(false)
      abortControllerRef.current = null
    }
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">OpenRouter API key</span>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="sk-or-..."
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">Model</span>
          <input
            list="canvas-tool-openrouter-models"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="e.g. anthropic/claude-3.5-sonnet"
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          />
          <datalist id="canvas-tool-openrouter-models">
            {models.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </datalist>
        </label>
        <Button size="xs" variant="outline" className="gap-1" onClick={handleLoadModels} disabled={loadingModels}>
          <RefreshCw className={loadingModels ? "size-3 animate-spin" : "size-3"} />
          {loadingModels ? "Loading models…" : "Refresh model list"}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-lg border border-border bg-card p-3">
        <div ref={logScrollRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {log.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Describe what you'd like built or changed. The agent will write the code, run it, fix any
              errors, and check a screenshot before calling it done.
            </p>
          )}
          {log.map((entry) => (
            <LogEntryView key={entry.id} entry={entry} />
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-2">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe what to build or change…"
            rows={3}
            disabled={running}
            className="resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs disabled:opacity-60"
          />
          {running ? (
            <Button size="sm" variant="destructive" className="gap-1" onClick={handleStop}>
              <Square className="size-3" />
              Stop
            </Button>
          ) : (
            <Button size="sm" className="gap-1" onClick={handleRun} disabled={!prompt.trim()}>
              <Send className="size-3" />
              Build
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function LogEntryView({ entry }: { entry: AgentLogEntry }) {
  switch (entry.kind) {
    case "user":
      return (
        <div className="ml-6 rounded-md bg-primary px-2 py-1.5 text-xs text-primary-foreground">
          {entry.text}
        </div>
      )
    case "assistant":
      return (
        <div className="mr-6 rounded-md bg-muted px-2 py-1.5 text-xs text-foreground">{entry.text}</div>
      )
    case "status":
      return (
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground italic">
          <Loader2 className="size-3 animate-spin" />
          {entry.text}
        </div>
      )
    case "screenshot":
      return (
        <img
          src={entry.imageDataUrl}
          alt="Agent run screenshot"
          className="max-h-40 w-auto self-start rounded-md border border-border"
        />
      )
    case "error":
      return (
        <div className="flex items-start gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 size-3 shrink-0" />
          <span>{entry.text}</span>
        </div>
      )
    case "done":
      return (
        <div className="flex items-start gap-1.5 rounded-md border border-border bg-accent px-2 py-1.5 text-xs text-accent-foreground">
          <Check className="mt-0.5 size-3 shrink-0" />
          <span>{entry.text}</span>
        </div>
      )
    case "stopped":
      return <div className="px-1 text-[11px] text-muted-foreground">{entry.text}</div>
    default:
      return null
  }
}
