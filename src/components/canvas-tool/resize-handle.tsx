import { GripVertical } from "lucide-react"
import { Separator } from "react-resizable-panels"

export function ResizeHandle() {
  return (
    <Separator className="group relative mx-1 flex w-2 shrink-0 cursor-col-resize items-center justify-center outline-none">
      <div className="h-full w-px bg-border transition-colors group-hover:bg-primary group-active:bg-primary" />
      <div className="absolute flex size-5 items-center justify-center rounded-sm bg-border text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
        <GripVertical className="size-3" />
      </div>
    </Separator>
  )
}
