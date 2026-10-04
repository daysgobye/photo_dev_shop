import { afterEach, describe, expect, it, vi } from "vitest"
import { copyToClipboard } from "@/lib/canvas-tool/clipboard"

/**
 * These tests stub `navigator` and `document` by hand rather than pulling in
 * jsdom, so they exercise the fallback logic without a real DOM. They say
 * nothing about whether the copy actually reaches the user's clipboard.
 */
function stubDom(options: {
  writeText?: () => Promise<void>
  execCommand?: (command: string) => boolean
}) {
  const appended: FakeTextArea[] = []
  const removed: FakeTextArea[] = []

  interface FakeTextArea {
    value: string
    style: Record<string, string>
    select: () => void
  }

  function createElement(tag: string): FakeTextArea {
    const el: FakeTextArea = {
      value: "",
      style: {},
      select: vi.fn(),
    }
    if (tag === "textarea") appended.push(el)
    return el
  }

  vi.stubGlobal("navigator", {
    clipboard: {
      writeText: vi.fn(options.writeText ?? (() => Promise.resolve())),
    },
  })

  vi.stubGlobal("document", {
    createElement: vi.fn(createElement),
    body: {
      appendChild: vi.fn((el: FakeTextArea) => el),
      removeChild: vi.fn((el: FakeTextArea) => {
        removed.push(el)
        return el
      }),
    },
    execCommand: vi.fn(options.execCommand ?? (() => true)),
  })

  return { appended, removed, document: globalThis.document, navigator: globalThis.navigator }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("copyToClipboard", () => {
  it("writes via the async clipboard api and reports success", async () => {
    const dom = stubDom({})

    await expect(copyToClipboard("hello")).resolves.toBe(true)
    expect(dom.navigator.clipboard.writeText).toHaveBeenCalledWith("hello")
  })

  it("does not touch the dom when the async api works", async () => {
    const dom = stubDom({})

    await copyToClipboard("hello")

    expect(dom.document.createElement).not.toHaveBeenCalled()
    expect(dom.document.execCommand).not.toHaveBeenCalled()
  })

  describe("when the async clipboard api throws", () => {
    it("falls back to execCommand and reports success", async () => {
      const dom = stubDom({
        writeText: () => Promise.reject(new Error("denied")),
        execCommand: () => true,
      })

      await expect(copyToClipboard("hello")).resolves.toBe(true)
      expect(dom.document.execCommand).toHaveBeenCalledWith("copy")
    })

    it("puts the text in the textarea it selects", async () => {
      const dom = stubDom({ writeText: () => Promise.reject(new Error("denied")) })

      await copyToClipboard("hello world")

      expect(dom.appended).toHaveLength(1)
      expect(dom.appended[0].value).toBe("hello world")
      expect(dom.appended[0].select).toHaveBeenCalled()
    })

    it("keeps the fallback textarea invisible and out of the way", async () => {
      const dom = stubDom({ writeText: () => Promise.reject(new Error("denied")) })

      await copyToClipboard("hello")

      expect(dom.appended[0].style).toMatchObject({ position: "fixed", opacity: "0" })
    })

    it("removes the fallback textarea from the dom afterwards", async () => {
      const dom = stubDom({ writeText: () => Promise.reject(new Error("denied")) })

      await copyToClipboard("hello")

      expect(dom.document.body.appendChild).toHaveBeenCalledWith(dom.appended[0])
      expect(dom.document.body.removeChild).toHaveBeenCalledWith(dom.appended[0])
      expect(dom.removed).toHaveLength(1)
    })

    it("reports failure when execCommand also fails", async () => {
      stubDom({
        writeText: () => Promise.reject(new Error("denied")),
        execCommand: () => false,
      })

      await expect(copyToClipboard("hello")).resolves.toBe(false)
    })

    it("still cleans up the textarea when execCommand fails", async () => {
      const dom = stubDom({
        writeText: () => Promise.reject(new Error("denied")),
        execCommand: () => false,
      })

      await copyToClipboard("hello")

      expect(dom.removed).toHaveLength(1)
    })
  })
})