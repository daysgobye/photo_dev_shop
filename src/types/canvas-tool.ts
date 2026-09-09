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
