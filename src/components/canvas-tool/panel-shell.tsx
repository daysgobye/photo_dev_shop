import * as React from "react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PanelShellProps {
  title: string
  collapsed: boolean
  onToggle: () => void
  children: React.ReactNode
}

/**
 * Wraps a Panel's content with a small title bar (with a collapse toggle) and,
 * when collapsed, swaps the content out for a slim icon-only rail so the
 * panel still occupies its `collapsedSize` without rendering unusable content.
 */
export function PanelShell({ title, collapsed, onToggle, children }: PanelShellProps) {
  if (collapsed) {
    return (
      <div className="flex h-full w-full flex-col items-center gap-2 rounded-lg border border-border bg-card py-2">
        <Button size="icon-xs" variant="ghost" title={`Expand ${title}`} onClick={onToggle}>
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between rounded-md border border-border bg-card px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <Button size="icon-xs" variant="ghost" title={`Collapse ${title}`} onClick={onToggle}>
          <ChevronsLeft className="size-3.5" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
