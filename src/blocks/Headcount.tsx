import { monthLabel } from '@/lib/utils'
import type { Digest } from '@/lib/schema'

export function Headcount({ digest }: { digest: Digest }) {
  const data = [...digest.headcount].sort((a, b) => a.month.localeCompare(b.month))

  if (data.length === 0) return null

  const totals = data.map(d => d.offshore + d.onshore)
  const max = Math.max(...totals)
  const lastEntry = data[data.length - 1]
  const lastTotal = lastEntry.offshore + lastEntry.onshore
  const lastRatio = lastTotal > 0 ? ((lastEntry.offshore / lastTotal) * 100).toFixed(1) : '—'

  const chartHeight = 180
  const chartWidth = 600
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerW = chartWidth - padding.left - padding.right
  const innerH = chartHeight - padding.top - padding.bottom

  const barWidth = data.length > 0 ? Math.min(40, (innerW / data.length) * 0.7) : 40
  const barGap = data.length > 0 ? innerW / data.length : 0

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-ink">Effectifs</h2>
      <div className="mb-4 flex flex-wrap items-baseline gap-6">
        <div>
          <span className="text-3xl font-bold text-ink">{lastTotal}</span>
          <span className="ml-2 text-sm text-slate">personnes</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-accent">{lastEntry.offshore} offshore</span>
          <span className="mx-2 text-slate/40">|</span>
          <span className="font-medium text-slate">{lastEntry.onshore} onshore</span>
          <span className="mx-2 text-slate/40">|</span>
          <span className="font-medium text-ink">{lastRatio}% offshore</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[600px]" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = padding.top + innerH - pct * innerH
          const val = Math.round(pct * max)
          return (
            <g key={pct}>
              <line x1={padding.left} x2={padding.left + innerW} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              <text x={padding.left - 5} y={y + 3} textAnchor="end" className="text-[9px] fill-slate/60">{val}</text>
            </g>
          )
        })}

        {/* Stacked bars */}
        {data.map((d, i) => {
          const total = d.offshore + d.onshore
          const offshoreH = max > 0 ? (d.offshore / max) * innerH : 0
          const onshoreH = max > 0 ? (d.onshore / max) * innerH : 0
          const x = padding.left + i * barGap + (barGap - barWidth) / 2

          return (
            <g key={d.month}>
              {/* Onshore (bottom) */}
              <rect
                x={x}
                y={padding.top + innerH - onshoreH - offshoreH}
                width={barWidth}
                height={onshoreH}
                fill="#94a3b8"
                rx="2"
              />
              {/* Offshore (top) */}
              <rect
                x={x}
                y={padding.top + innerH - offshoreH}
                width={barWidth}
                height={offshoreH}
                fill="#2f6f6b"
                rx="2"
              />
              {/* Total on top */}
              {total > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={padding.top + innerH - onshoreH - offshoreH - 4}
                  textAnchor="middle"
                  className="text-[9px] fill-ink font-medium"
                >
                  {total}
                </text>
              )}
              {/* Month label */}
              <text x={x + barWidth / 2} y={padding.top + innerH + 14} textAnchor="middle" className="text-[9px] fill-slate/60">
                {d.month.slice(5)}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex items-center gap-4 text-xs text-slate">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-accent" />
          <span>Offshore</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-slate/40" />
          <span>Onshore</span>
        </div>
      </div>
    </section>
  )
}
