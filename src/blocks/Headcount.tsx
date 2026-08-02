import { t } from '@/i18n'
import { monthLabel } from '@/lib/utils'
import type { Digest } from '@/lib/schema'

export function Headcount({ digest }: { digest: Digest }) {
  const data = [...digest.headcount].sort((a, b) => a.month.localeCompare(b.month))

  if (data.length === 0) return null

  const max = Math.max(...data.map(d => d.count))
  const min = Math.min(...data.map(d => d.count))
  const range = max - min || 1

  const chartHeight = 160
  const chartWidth = 600
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerW = chartWidth - padding.left - padding.right
  const innerH = chartHeight - padding.top - padding.bottom

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: padding.top + innerH - ((d.count - min) / range) * innerH,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-ink">Effectifs</h2>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-ink">{data[data.length - 1].count}</span>
        <span className="text-sm text-slate">personnes ({monthLabel(data[data.length - 1].month)})</span>
        {data.length > 1 && (
          <span className={`text-sm font-medium ${data[data.length - 1].count >= data[data.length - 2].count ? 'text-success' : 'text-danger'}`}>
            {data[data.length - 1].count >= data[data.length - 2].count ? '+' : ''}{data[data.length - 1].count - data[data.length - 2].count} vs mois précédent
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[600px]" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = padding.top + innerH - pct * innerH
          const val = Math.round(min + pct * range)
          return (
            <g key={pct}>
              <line x1={padding.left} x2={padding.left + innerW} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              <text x={padding.left - 5} y={y + 3} textAnchor="end" className="text-[9px] fill-slate/60">{val}</text>
            </g>
          )
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#headcount-gradient)" opacity="0.3" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#2f6f6b" strokeWidth="2" strokeLinejoin="round" />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="#2f6f6b" />
            <text x={p.x} y={padding.top + innerH + 15} textAnchor="middle" className="text-[8px] fill-slate/60">
              {p.month.slice(5)}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="headcount-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2f6f6b" />
            <stop offset="100%" stopColor="#2f6f6b" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  )
}
