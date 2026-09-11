import * as React from "react"
import { Check, ChevronDown, ClipboardCopy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/lib/canvas-tool/clipboard"
import { buildEditProjectPrompt, buildNewProjectPrompt } from "@/lib/canvas-tool/prompt-builder"
import type { CanvasProject } from "@/types/canvas-tool"

interface PromptMenuProps {
  project: CanvasProject
}

type CopyState = "new" | "edit" | null

export function PromptMenu({ project }: PromptMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState<CopyState>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  const handleCopy = async (kind: "new" | "edit") => {
    const prompt = kind === "new" ? buildNewProjectPrompt(project) : buildEditProjectPrompt(project)
    const ok = await copyToClipboard(prompt)
    if (ok) {
      setCopied(kind)
      setTimeout(() => setCopied((current) => (current === kind ? null : current)), 1500)
    }
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen((v) => !v)}>
        <ClipboardCopy className="size-3.5" />
        Copy AI prompt
        <ChevronDown className="size-3.5" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border border-border bg-popover p-1 shadow-md">
          <button
            type="button"
            onClick={() => handleCopy("new")}
            className="flex w-full flex-col items-start gap-0.5 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium">
              {copied === "new" ? <Check className="size-3" /> : <ClipboardCopy className="size-3" />}
              New project prompt
            </span>
            <span className="text-[11px] text-muted-foreground">
              Explains the sandbox and lists current images/fonts, ends where you describe what to build.
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleCopy("edit")}
            className="flex w-full flex-col items-start gap-0.5 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium">
              {copied === "edit" ? <Check className="size-3" /> : <ClipboardCopy className="size-3" />}
              Edit current project prompt
            </span>
            <span className="text-[11px] text-muted-foreground">
              Includes your current HTML/CSS/JS so the agent edits in place instead of starting over.
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
