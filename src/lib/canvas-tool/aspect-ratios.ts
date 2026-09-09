import type { AspectRatioOption } from "@/types/canvas-tool"

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "Square · 1:1", ratio: 1 },
  { id: "4:5", label: "Portrait · 4:5", ratio: 4 / 5 },
  { id: "16:9", label: "Widescreen · 16:9", ratio: 16 / 9 },
  { id: "9:16", label: "Story · 9:16", ratio: 9 / 16 },
  { id: "4:3", label: "Standard · 4:3", ratio: 4 / 3 },
]

export function getAspectRatio(id: string): AspectRatioOption {
  return ASPECT_RATIOS.find((option) => option.id === id) ?? ASPECT_RATIOS[0]
}
