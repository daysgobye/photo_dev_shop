import * as React from "react"
import { cn } from "cn"
import CodeMirror, { type Extension } from "@uiw/react-codemirror"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import type { EditorTabId } from "@/types/canvas-tool"

interface CodeEditorProps {
  html: string
  css: string
  js: string
  onChange: (tab: EditorTabId, value: string) => void
}

const TABS: { id: EditorTabId; label: string; key: string }[] = [
  { id: "html", label: "HTML", key: "1" },
  { id: "css", label: "CSS", key: "2" },
  { id: "js", label: "JS / JSX", key: "3" },
]

const TAB_BY_KEY: Record<string, EditorTabId> = Object.fromEntries(
  TABS.map((tab) => [tab.key, tab.id])
)

// Built once — language packages provide their own basic completion
// (tags/attributes for HTML, properties/values for CSS, keywords+scope for JS).
const LANGUAGE_EXTENSIONS: Record<EditorTabId, Extension[]> = {
  html: [html()],
  css: [css()],
  js: [javascript({ jsx: true })],
}

/** Tracks the `dark` class on <html> so the editor theme follows the app's theme toggle. */
function useIsDarkMode() {
  const [isDark, setIsDark] = React.useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )
  React.useEffect(() => {
    const target = document.documentElement
    const observer = new MutationObserver(() => setIsDark(target.classList.contains("dark")))
    observer.observe(target, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

export function CodeEditor({ html: htmlValue, css: cssValue, js: jsValue, onChange }: CodeEditorProps) {
  const [active, setActive] = React.useState<EditorTabId>("html")
  const isDark = useIsDarkMode()
  const values: Record<EditorTabId, string> = { html: htmlValue, css: cssValue, js: jsValue }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            title={`Ctrl/Cmd + Shift + ${tab.key}`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors",
              active === tab.id
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        <CodeMirror
          key={active}
          value={values[active]}
          height="100%"
          theme={isDark ? githubDark : githubLight}
          extensions={LANGUAGE_EXTENSIONS[active]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
          }}
          onChange={(value) => onChange(active, value)}
          style={{ height: "100%", fontSize: 13 }}
        />
      </div>
    </div>
  )
}
