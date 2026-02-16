/**
 * Returns an HSL color string interpolated from red (low) to green (high).
 */
export function getHeatmapColor(
  value: number,
  min: number,
  max: number,
): string {
  const range = max - min
  const ratio = range === 0 ? 0.5 : Math.max(0, Math.min(1, (value - min) / range))

  // Hue: 0 (red) -> 120 (green)
  const hue = Math.round(ratio * 120)
  return `hsl(${hue}, 70%, 45%)`
}

const CHART_PALETTE = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
  '#a855f7', // purple-500
] as const

/**
 * Returns an array of distinguishable colors for chart segments.
 */
export function getChartColors(count: number): readonly string[] {
  if (count <= CHART_PALETTE.length) {
    return CHART_PALETTE.slice(0, count)
  }

  const colors: string[] = [...CHART_PALETTE]
  for (let i = CHART_PALETTE.length; i < count; i++) {
    const hue = (i * 137.508) % 360 // golden angle for even distribution
    colors.push(`hsl(${Math.round(hue)}, 65%, 50%)`)
  }

  return colors
}
