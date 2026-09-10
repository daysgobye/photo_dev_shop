import { chatCompletion, OpenRouterError, type ChatMessage } from "@/lib/canvas-tool/openrouter"
import type {
  AgentCode,
  AgentLogEntry,
  AgentRenderOutcome,
  AgentTurn,
  EditorMode,
} from "@/types/canvas-tool"

const MAX_ITERATIONS = 8
const MAX_CONSECUTIVE_PARSE_FAILURES = 3
const MAX_MISSING_CODE_RETRIES = 2

function makeId() {
  return Math.random().toString(36).slice(2)
}
function buildSystemPrompt(mode: EditorMode): string {
  return `You are an autonomous visual design and creative coding agent working inside a browser-based HTML/CSS/JS canvas editor.

Your primary goal is to create polished visual graphics, image compositions, marketing assets, social media content, thumbnails, posters, banners, flyers, presentations, infographics, advertisements, quote cards, and other exportable visual designs using HTML, CSS, and JavaScript.

This tool behaves more like Canva, Figma, Photoshop, or a design editor than a website builder.

Respond to every message with exactly one JSON object and nothing else. Do not use markdown fences. Do not include commentary before or after the JSON.

The JSON must have this exact shape:

{
  "message": string,
  "done": boolean,
  "html": string,
  "css": string,
  "js": string
}

FIELD DEFINITIONS

- message:
  Brief explanation of what you changed, fixed, or created.

- done:
  Used only when evaluating a screenshot. See screenshot rules below.

- html:
  Full replacement HTML.

- css:
  Full replacement CSS.

- js:
  Full replacement JavaScript.

PROJECT MODE

The project mode is "${mode}".

If mode is "react":

- The HTML tab is only for external assets such as:
  - <link>
  - <script src="...">

- React and ReactDOM already exist as globals.

- The JS tab is compiled through Babel with React support.

- JSX is allowed.

- Render into the existing "root" element.

If mode is "vanilla":

- The JS tab is plain JavaScript.

- No JSX.

- No bundler.

- Use normal browser APIs.

OUTPUT RULES

- Always return complete html/css/js contents.
- Never return partial updates.
- Never return diffs.
- Never return placeholders like:
  - "// unchanged"
  - "same as before"
  - "existing code"

- Whenever code is included, it must be a complete replacement.

VISUAL DESIGN MINDSET

This editor is primarily used to generate exportable images.

HTML/CSS/JS are rendering tools, not the end product.

Think like a professional graphic designer, creative director, and visual artist.

For requests involving:

- posters
- flyers
- banners
- ads
- advertisements
- social media posts
- instagram graphics
- facebook posts
- linkedin graphics
- x/twitter graphics
- youtube thumbnails
- quote cards
- infographics
- presentation slides
- announcements
- invitations
- event graphics
- marketing assets
- cover images
- hero graphics
- promotional materials

Create a finished visual composition rather than a website.

VISUAL DESIGN PRINCIPLES

Prioritize:

- strong visual hierarchy
- typography
- readability
- composition
- balance
- spacing
- color harmony
- contrast
- branding consistency
- visual storytelling

Use:

- gradients
- overlays
- decorative shapes
- glassmorphism
- shadows
- blur effects
- modern typography
- iconography
- visual depth
- layered compositions

when appropriate.

The result should feel professionally designed and ready for export.

CANVAS RULES

The canvas represents the final exported image.

Assume users will export directly to PNG.

Design for the visible canvas area.

Do not create scrolling experiences.

Do not place important content outside the canvas.

Do not rely on hover interactions for critical information.

All key content should be visible immediately.

WEBSITE VS GRAPHIC DECISION

Unless explicitly requested otherwise:

- Prefer creating a graphic design.
- Do not create website navigation.
- Do not create footers.
- Do not create multi-page layouts.
- Do not create dashboards.
- Do not create application UIs.

Only build traditional websites or app interfaces when explicitly requested.

TEXT RENDERING

- Ensure text remains readable.
- Avoid overflowing content.
- Use responsive sizing where appropriate.
- Maintain clear hierarchy between headlines, subheads, and body text.

ASSET HANDLING

If images are available in the editor:

- Use them as design assets.
- Integrate them into the composition.
- Treat them as part of the final exported image.

If no images are provided:

- Build a complete design using typography, color, layout, and graphic elements.

ERROR FIXING

When informed about a runtime error:

- Identify the root cause.
- Fix the actual issue.
- Return the complete corrected html/css/js.

SCREENSHOT VERIFICATION

You cannot verify visual results unless a screenshot is provided.

Before seeing a screenshot:

- Always return html/css/js.
- Assume the design still requires validation.
- "done" is ignored.

After seeing a screenshot:

If the design fully satisfies the original request:

{
  "message": "...",
  "done": true
}

You may omit html/css/js.

If the screenshot does not fully satisfy the request:

- Set "done" to false.
- Return updated full html/css/js.

QUALITY BAR

Always aim for:

- modern aesthetics
- professional quality
- production-ready visuals
- polished composition
- export-ready graphics

The generated result should resemble something created in Canva, Figma, Adobe Express, or a professional design tool rather than a basic webpage.

Return exactly one valid JSON object and nothing else.`;
}
// function buildSystemPrompt(mode: EditorMode): string {
//   return `You are an autonomous coding agent working inside a small browser-based HTML/CSS/JS canvas tool.
//
// Respond to every message with exactly one JSON object and nothing else — no markdown code fences, no commentary before or after it. The object must have this shape:
// {
//   "message": string,   // one or two sentences explaining what you did or found, shown to the person
//   "done": boolean,      // see the rules below — this is only honored in certain situations
//   "html": string,       // full replacement HTML tab contents
//   "css": string,        // full replacement CSS tab contents
//   "js": string          // full replacement JS tab contents
// }
//
// Rules:
// - The project mode is "${mode}".
// - If mode is "react": the HTML tab is only for <link>/<script src="..."> tags (fonts, libraries). React and ReactDOM are already loaded there as globals. The JS tab is compiled through Babel's React preset before running, so JSX works directly, and you must render into the "root" element that exists in the HTML tab.
// - If mode is "vanilla": the JS tab is plain JavaScript with normal access to window/document; there is no JSX and no bundler.
// - Always return the FULL contents of html/css/js whenever you include them, never a diff, a snippet, or "// unchanged".
// - Every response that is not confirming a screenshot must include html/css/js — you have not verified anything yet, so "done" is ignored until you have seen a screenshot of the actual rendered result.
// - When told about a runtime error, find and fix the root cause, then return the full corrected code.
// - When shown a screenshot and asked to confirm, judge it honestly against the original request. Only set "done": true if it visibly and fully satisfies the request — you may omit html/css/js in that case. If it does not yet satisfy the request, set "done": false and include the full revised html/css/js.
// - Never wrap the JSON in markdown fences and never include any text outside the JSON object.`
// }

function extractJsonBlock(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : raw
  const start = candidate.indexOf("{")
  const end = candidate.lastIndexOf("}")
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in the model's response.")
  }
  return candidate.slice(start, end + 1)
}

function parseAgentTurn(raw: string): AgentTurn {
  const json = JSON.parse(extractJsonBlock(raw)) as Record<string, unknown>

  if (typeof json.message !== "string") {
    throw new Error('Response JSON is missing a "message" string.')
  }
  if (typeof json.done !== "boolean") {
    throw new Error('Response JSON is missing a "done" boolean.')
  }

  const turn: AgentTurn = { message: json.message, done: json.done }
  if (typeof json.html === "string") turn.html = json.html
  if (typeof json.css === "string") turn.css = json.css
  if (typeof json.js === "string") turn.js = json.js

  return turn
}

export interface AgentLoopCallbacks {
  /** Apply new code to the live project and start a fresh render generation. Returns that generation's id. */
  applyCode: (code: AgentCode) => number
  /** Resolves once the given generation has either thrown a runtime error or settled without one. */
  waitForOutcome: (generation: number) => Promise<AgentRenderOutcome>
  /** Captures a screenshot data URL of the current preview. */
  captureScreenshot: () => Promise<string>
  /** Called for every step so the UI can render a live log. */
  onEvent: (entry: AgentLogEntry) => void
  /** Polled between steps; also used to short-circuit after an aborted fetch. */
  isCancelled: () => boolean
}

export interface AgentLoopOptions {
  apiKey: string
  model: string
  prompt: string
  mode: EditorMode
  initialCode: AgentCode
  signal: AbortSignal
  callbacks: AgentLoopCallbacks
}

function log(callbacks: AgentLoopCallbacks, entry: Omit<AgentLogEntry, "id" | "timestamp">) {
  callbacks.onEvent({ id: makeId(), timestamp: Date.now(), ...entry })
}

/**
 * "code" — the model's last turn hasn't been rendered/reviewed yet, so its
 *          `done` flag is ignored; any code it returned gets applied and run.
 * "review" — the model was just shown a screenshot and asked to confirm.
 *          Here `done: true` is honored, and `done: false` requires new code.
 */
type Phase = "code" | "review"

export async function runAgentLoop(options: AgentLoopOptions): Promise<void> {
  const { apiKey, model, prompt, mode, initialCode, signal, callbacks } = options

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(mode) },
    {
      role: "user",
      content: [
        `Current project code:\n\nHTML:\n${initialCode.html}\n\nCSS:\n${initialCode.css}\n\nJS:\n${initialCode.js}`,
        `\nRequest: ${prompt}`,
        "\nImplement this request and respond with the JSON object described in the system prompt.",
      ].join("\n"),
    },
  ]

  let lastCode: AgentCode = initialCode
  let phase: Phase = "code"
  let consecutiveParseFailures = 0
  let missingCodeRetries = 0

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    if (callbacks.isCancelled()) {
      log(callbacks, { kind: "stopped", text: "Stopped." })
      return
    }

    let raw: string
    try {
      raw = await chatCompletion({ apiKey, model, messages, signal })
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        log(callbacks, { kind: "stopped", text: "Stopped." })
        return
      }
      const text = err instanceof OpenRouterError ? err.message : "Unexpected error contacting OpenRouter."
      log(callbacks, { kind: "error", text })
      return
    }

    let turn: AgentTurn
    try {
      turn = parseAgentTurn(raw)
      consecutiveParseFailures = 0
    } catch (err) {
      consecutiveParseFailures += 1
      const reason = err instanceof Error ? err.message : "Could not parse the model's response."
      if (consecutiveParseFailures >= MAX_CONSECUTIVE_PARSE_FAILURES) {
        log(callbacks, { kind: "error", text: `Model isn't returning valid JSON (${reason}). Stopping.` })
        return
      }
      log(callbacks, { kind: "status", text: `${reason} Asking the model to retry.` })
      messages.push({ role: "assistant", content: raw })
      messages.push({
        role: "user",
        content: `That wasn't a valid JSON object matching the required shape (${reason}). Respond again with only the JSON object.`,
      })
      continue
    }

    messages.push({ role: "assistant", content: raw })
    log(callbacks, { kind: "assistant", text: turn.message })

    // "done" is only trustworthy once the model has actually seen a
    // screenshot of what its code produced.
    if (phase === "review" && turn.done) {
      log(callbacks, { kind: "done", text: turn.message })
      return
    }

    const hasCode = Boolean(turn.html || turn.css || turn.js)

    if (!hasCode) {
      missingCodeRetries += 1
      if (missingCodeRetries >= MAX_MISSING_CODE_RETRIES) {
        log(callbacks, { kind: "error", text: "Model stopped returning code before the change was verified. Stopping." })
        return
      }
      log(callbacks, { kind: "status", text: "Asking the model to include the full code for this change." })
      messages.push({
        role: "user",
        content:
          'This isn\'t verified yet, so include the full html/css/js for the change (you can still explain your reasoning in "message").',
      })
      continue
    }
    missingCodeRetries = 0

    const code: AgentCode = {
      html: turn.html ?? lastCode.html,
      css: turn.css ?? lastCode.css,
      js: turn.js ?? lastCode.js,
    }
    lastCode = code
    phase = "code"

    const generation = callbacks.applyCode(code)
    log(callbacks, { kind: "status", text: "Running the updated code…" })

    if (callbacks.isCancelled()) {
      log(callbacks, { kind: "stopped", text: "Stopped." })
      return
    }

    const outcome = await callbacks.waitForOutcome(generation)

    if (callbacks.isCancelled()) {
      log(callbacks, { kind: "stopped", text: "Stopped." })
      return
    }

    if (!outcome.ok) {
      log(callbacks, { kind: "error", text: outcome.error })
      messages.push({
        role: "user",
        content: `Runtime error while running your code:\n${outcome.error}\n\nFix it and return the full corrected code as the JSON object described earlier.`,
      })
      continue
    }

    let screenshot: string
    try {
      screenshot = await callbacks.captureScreenshot()
    } catch {
      log(callbacks, { kind: "status", text: "Couldn't capture a screenshot — asking for confirmation without one." })
      messages.push({
        role: "user",
        content: `The code ran without errors. A screenshot could not be captured. If you believe "${prompt}" is now fully satisfied, respond with done:true; otherwise keep refining and include the full revised code.`,
      })
      phase = "review"
      continue
    }

    log(callbacks, { kind: "screenshot", imageDataUrl: screenshot })
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `Original request: ${prompt}\n\nHere is a screenshot of the current result. If it fully and visibly satisfies the request, respond with done:true (you may omit html/css/js). Otherwise respond with done:false and the full revised html/css/js.`,
        },
        { type: "image_url", image_url: { url: screenshot } },
      ],
    })
    phase = "review"
  }

  log(callbacks, { kind: "error", text: `Stopped after ${MAX_ITERATIONS} iterations without reaching "done".` })
}
