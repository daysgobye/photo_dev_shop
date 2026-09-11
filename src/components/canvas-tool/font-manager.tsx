import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFontFormat, nextFontFamilyName, sanitizeFontFamilyName } from "@/lib/canvas-tool/fonts"
import type { CanvasFontAsset } from "@/types/canvas-tool"
import { copyToClipboard } from "@/lib/canvas-tool/clipboard"
interface FontManagerProps {
  fonts: CanvasFontAsset[]
  onChange: (fonts: CanvasFontAsset[]) => void
}


export function FontManager({ fonts, onChange }: FontManagerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const desired = sanitizeFontFamilyName(file.name)
      const font: CanvasFontAsset = {
        id: Math.random().toString(36).slice(2),
        fontFamily: nextFontFamilyName(fonts, desired),
        fileName: file.name,
        format: getFontFormat(file.name),
        dataUrl: String(reader.result),
      }
      onChange([...fonts, font])
    }
    reader.readAsDataURL(file)
  }

  const handleRename = (id: string, name: string) => {
    onChange(fonts.map((font) => (font.id === id ? { ...font, fontFamily: name } : font)))
  }

  const handleCopy = async (font: CanvasFontAsset) => {
    const ok = await copyToClipboard(`.${font.fontFamily.replaceAll(" ", "-").toLowerCase()}{\nfont-family: ${JSON.stringify(font.fontFamily)};\n}`)
    if (ok) {
      setCopied(font.id)
      setTimeout(() => setCopied((current) => (current === font.id ? null : current)), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Fonts</span>
        <Button size="xs" variant="outline" onClick={() => inputRef.current?.click()}>
          + Add font
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".woff,.woff2,.ttf,.otf,.eot,font/woff,font/woff2,font/ttf,font/otf"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
            event.target.value = ""
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {fonts.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No custom fonts yet. Upload a <code>.woff2</code>, <code>.woff</code>, <code>.ttf</code>,
            or <code>.otf</code> file — it's embedded as a <code>@font-face</code> in the preview, so
            you can use it anywhere with <code>font-family</code>. Handy for fonts that aren't on
            Google Fonts.
          </p>
        )}
        {fonts.map((font) => (
          <div key={font.id} className="flex flex-col gap-2 rounded-md border border-border p-2">
            {/* Scoped @font-face just so we can render a live "Aa" preview glyph below */}
            <style>{`@font-face { font-family: "preview-${font.id}"; src: url(${JSON.stringify(font.dataUrl)}) format(${JSON.stringify(font.format)}); }`}</style>
            <div className="flex items-center gap-2">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-sm"
                style={{ fontFamily: `preview-${font.id}` }}
              >
                Aa
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[11px] text-muted-foreground">{font.fileName}</span>
                <input
                  type="text"
                  value={font.fontFamily}
                  onChange={(event) => handleRename(font.id, event.target.value)}
                  className="h-6 w-full rounded border border-border bg-background px-1 text-xs font-semibold"
                />
              </div>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onChange(fonts.filter((f) => f.id !== font.id))}
              >
                ×
              </Button>
            </div>
            <Button size="xs" variant="outline" className="gap-1" onClick={() => handleCopy(font)}>
              {copied === font.id ? <Check className="size-3" /> : <Copy className="size-3" />}
              Copy font-family CSS
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
