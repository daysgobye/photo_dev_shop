import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CanvasAsset } from "@/types/canvas-tool"

interface AssetManagerProps {
  assets: CanvasAsset[]
  onChange: (assets: CanvasAsset[]) => void
}

type SnippetKind = "react" | "vanilla"

function nextVarName(assets: CanvasAsset[]) {
  const used = new Set(assets.map((asset) => asset.varName))
  let i = 1
  while (used.has(`image${i}`)) i++
  return `image${i}`
}

function buildSnippet(varName: string, kind: SnippetKind) {
  if (kind === "react") {
    return `<img src={${varName}} alt="" style={{ width: "100%", height: "auto" }} />`
  }
  return `const img = document.createElement("img")
img.src = ${varName}
document.body.appendChild(img)`
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for environments without the async clipboard API.
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  }
}

export function AssetManager({ assets, onChange }: AssetManagerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [copied, setCopied] = React.useState<string | null>(null)

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

  const handleCopy = async (asset: CanvasAsset, kind: SnippetKind) => {
    const key = `${asset.id}:${kind}`
    const ok = await copyToClipboard(buildSnippet(asset.varName, kind))
    if (ok) {
      setCopied(key)
      setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Images</span>
        <Button size="xs" variant="outline" onClick={() => inputRef.current?.click()}>
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
            No images yet. Each one you add becomes a global variable (e.g. <code>image1</code>) you can
            reference directly in your JS/JSX — it's just a data URL string.
          </p>
        )}
        {assets.map((asset) => (
          <div key={asset.id} className="flex flex-col gap-2 rounded-md border border-border p-2">
            <div className="flex items-center gap-2">
              <img src={asset.dataUrl} alt={asset.fileName} className="size-8 rounded object-cover" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[11px] text-muted-foreground">{asset.fileName}</span>
                <span className="truncate text-xs">
                  Use in JS as{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-semibold">{asset.varName}</code>
                </span>
              </div>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onChange(assets.filter((a) => a.id !== asset.id))}
              >
                ×
              </Button>
            </div>
            <div className="flex items-center gap-1.5">
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
                Copy React snippet
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
                Copy vanilla snippet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
