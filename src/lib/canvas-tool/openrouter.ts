const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

export class OpenRouterError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = "OpenRouterError"
    this.status = status
  }
}

export interface OpenRouterModelSummary {
  id: string
  name: string
}

export interface ChatTextPart {
  type: "text"
  text: string
}

export interface ChatImagePart {
  type: "image_url"
  image_url: { url: string }
}

export type ChatContentPart = ChatTextPart | ChatImagePart

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string | ChatContentPart[]
}

/**
 * Fetches the public OpenRouter model catalog. Used only to populate the
 * model autocomplete list in the UI — the field always accepts free text too,
 * so a failure here should never block the agent from running.
 */
export async function listOpenRouterModels(apiKey?: string): Promise<OpenRouterModelSummary[]> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
  })

  if (!response.ok) {
    throw new OpenRouterError(`Could not load model list (HTTP ${response.status}).`, response.status)
  }

  const body = (await response.json()) as { data?: Array<{ id: string; name?: string }> }
  return (body.data ?? []).map((model) => ({ id: model.id, name: model.name || model.id }))
}

/**
 * Sends one chat turn to OpenRouter and returns the assistant's raw text
 * content. Throws OpenRouterError with a human-readable message on any
 * network, auth, or API-level failure.
 */
export async function chatCompletion(options: {
  apiKey: string
  model: string
  messages: ChatMessage[]
  signal?: AbortSignal
}): Promise<string> {
  const { apiKey, model, messages, signal } = options

  if (!apiKey.trim()) {
    throw new OpenRouterError("Add your OpenRouter API key first.")
  }
  if (!model.trim()) {
    throw new OpenRouterError("Choose a model first.")
  }

  let response: Response
  try {
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Optional but recommended by OpenRouter for attributing usage.
        "HTTP-Referer": typeof location !== "undefined" ? location.origin : "https://localhost",
        "X-Title": "Canvas Tool AI Agent",
      },
      body: JSON.stringify({ model, messages }),
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err
    throw new OpenRouterError(
      "Couldn't reach OpenRouter. Check your connection and try again."
    )
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "")
    let detail = bodyText
    try {
      const parsed = JSON.parse(bodyText) as { error?: { message?: string } }
      detail = parsed.error?.message || bodyText
    } catch {
      // bodyText wasn't JSON — use as-is
    }

    if (response.status === 401) {
      throw new OpenRouterError("OpenRouter rejected that API key.", 401)
    }
    if (response.status === 402) {
      throw new OpenRouterError("OpenRouter account is out of credits.", 402)
    }
    if (response.status === 429) {
      throw new OpenRouterError("Rate limited by OpenRouter — try again shortly.", 429)
    }
    throw new OpenRouterError(detail || `OpenRouter request failed (HTTP ${response.status}).`, response.status)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== "string" || !content.trim()) {
    throw new OpenRouterError("Model returned an empty response.")
  }
  return content
}
