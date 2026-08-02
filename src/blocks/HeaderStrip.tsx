import { t } from '@/i18n'
import { computeKpis } from '@/lib/compute/totals'
import { formatAmount, formatPctRaw } from '@/lib/utils'
import type { Digest } from '@/lib/schema'

export function HeaderStrip({ digest }: { digest: Digest }) {
  const kpis = computeKpis(digest)

  return (
    <header className="mb-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-ink">{digest.meta.title}</h1>
        <p className="text-lg text-slate">{digest.meta.subtitle}</p>
        {digest.meta.publishedAt && (
          <p className="text-sm text-slate/60">
            Publié le {new Date(digest.meta.publishedAt).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="kpi-chip">
          <span className="text-xs font-medium text-slate">{t.header.revenue}</span>
          <span className="text-xl font-bold text-ink">{formatAmount(kpis.revenue, digest.meta.unit)}</span>
        </div>
        <div className="kpi-chip">
          <span className="text-xs font-medium text-slate">{t.header.coverage}</span>
          <span className={`text-xl font-bold ${kpis.coverage !== null && kpis.coverage >= 0.95 ? 'text-success' : kpis.coverage !== null && kpis.coverage >= 0.8 ? 'text-warning' : 'text-danger'}`}>
            {kpis.coverage !== null ? formatPctRaw(kpis.coverage * 100) : '—'}
          </span>
        </div>
        <div className="kpi-chip">
          <span className="text-xs font-medium text-slate">{t.header.offshore}</span>
          <span className="text-xl font-bold text-ink">{formatPctRaw(kpis.offshore)}</span>
        </div>
        <div className="kpi-chip">
          <span className="text-xs font-medium text-slate">{t.header.projects}</span>
          <span className="text-xl font-bold text-ink">{kpis.activeCount}</span>
        </div>
      </div>
    </header>
  )
}
