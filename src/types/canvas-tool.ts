export type EditorMode = "vanilla" | "react"
export type EditorTabId = "html" | "css" | "js"
export type ImageExportFormat = "png" | "jpeg"

export interface CanvasAsset {
  id: string
  /** Global variable name this asset is exposed as inside the preview, e.g. "image1" */
  varName: string
  fileName: string
  /** base64 data URL — kept inline so a project JSON export is fully self-contained */
  dataUrl: string
}

export interface AspectRatioOption {
  id: string
  label: string
  /** width / height, or null for "Free" */
  ratio: number | null
}

export interface CanvasProject {
  formatVersion: 1
  name: string
  mode: EditorMode
  width: number
  height: number
  aspectRatioId: string
  html: string
  css: string
  js: string
  assets: CanvasAsset[]
}

/* -------------------------------------------------------------------------- */
/* AI Agent                                                                    */
/* -------------------------------------------------------------------------- */

/** Persisted, non-sensitive-by-design settings for the AI agent panel. */
export interface AgentSettings {
  apiKey: string
  model: string
}

/** The subset of a CanvasProject the agent is allowed to rewrite. */
export interface AgentCode {
  html: string
  css: string
  js: string
}

export type AgentLogKind =
  | "user"
  | "assistant"
  | "error"
  | "screenshot"
  | "status"
  | "done"
  | "stopped"

export interface AgentLogEntry {
  id: string
  kind: AgentLogKind
  timestamp: number
  text?: string
  imageDataUrl?: string
}

export type AgentRunStatus = "idle" | "running" | "stopped" | "done" | "error"

/** One parsed turn from the model. */
export interface AgentTurn {
  message: string
  done: boolean
  html?: string
  css?: string
  js?: string
}

/** Result of letting a freshly-applied generation render in the preview iframe. */
export type AgentRenderOutcome = { ok: true } | { ok: false; error: string }
