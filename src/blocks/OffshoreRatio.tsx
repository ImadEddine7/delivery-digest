import { t } from '@/i18n'
import { globalOffshorePct } from '@/lib/compute/totals'
import { formatPctRaw } from '@/lib/utils'
import type { Digest } from '@/lib/schema'

export function OffshoreRatio({ digest }: { digest: Digest }) {
  const global = globalOffshorePct(digest.projects)
  const onshore = 100 - global

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-ink">{t.offshore.title}</h2>
      <div className="mb-2 flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-accent">{t.offshore.offshoreLabel} — {formatPctRaw(global)}</span>
            <span className="font-medium text-slate">{t.offshore.onshoreLabel} — {formatPctRaw(onshore)}</span>
          </div>
          <div className="h-6 w-full overflow-hidden rounded-full bg-slate/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${global}%` }}
              title={t.offshore.tooltip}
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate/60" title={t.offshore.tooltip}>
        {t.offshore.global}
      </p>
    </section>
  )
}
