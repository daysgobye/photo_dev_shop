type EsbuildModule = typeof import("esbuild-wasm/esm/browser.js")

let esbuildPromise: Promise<EsbuildModule> | null = null

/**
 * Lazily loads esbuild (WASM + browser build) on first use — i.e. the first
 * HTML export. Runs on the main thread to avoid needing a blob:-worker CSP
 * allowance; transforms are sized in KB and only happen during export.
 */
function loadEsbuild(): Promise<EsbuildModule> {
  if (!esbuildPromise) {
    esbuildPromise = (async () => {
      const esbuild = await import("esbuild-wasm/esm/browser.js")
      const { default: wasmUrl } = await import("esbuild-wasm/esbuild.wasm?url")
      await esbuild.initialize({ wasmURL: wasmUrl, worker: false })
      return esbuild
    })()
  }
  return esbuildPromise
}

/** Compiles JSX (classic React.createElement, matching the preview's Babel preset) and minifies. */
export async function minifyJs(code: string): Promise<string> {
  const esbuild = await loadEsbuild()
  const result = await esbuild.transform(code, {
    loader: "jsx",
    jsx: "transform",
    minify: true,
    target: ["es2019"],
  })
  return result.code
}

/** Minifies CSS (no @import resolution — the exported doc is fully inlined). */
export async function minifyCss(code: string): Promise<string> {
  const esbuild = await loadEsbuild()
  const result = await esbuild.transform(code, { loader: "css", minify: true })
  return result.code
}
