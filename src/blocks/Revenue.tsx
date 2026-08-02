import { t } from '@/i18n'
import { totalRevenue, revenueShare } from '@/lib/compute/totals'
import { formatAmount, formatPctRaw } from '@/lib/utils'
import type { Digest } from '@/lib/schema'

export function Revenue({ digest }: { digest: Digest }) {
  const total = totalRevenue(digest.projects)
  const activeProjects = digest.projects.filter(p => p.active)
  const programs = [...new Set(activeProjects.map(p => p.program).filter(Boolean))]

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-ink">{t.revenue.title}</h2>
      <div className="mb-4">
        <span className="text-4xl font-bold text-ink">{formatAmount(total, digest.meta.unit)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/10">
              <th className="pb-2 text-left font-medium text-slate">{t.revenue.project}</th>
              <th className="pb-2 text-left font-medium text-slate">{t.revenue.program}</th>
              <th className="pb-2 text-right font-medium text-slate">{t.revenue.amount}</th>
              <th className="pb-2 text-right font-medium text-slate">{t.revenue.share}</th>
              <th className="pb-2 text-right font-medium text-slate">{t.revenue.offshore}</th>
            </tr>
          </thead>
          <tbody>
            {activeProjects.map(project => (
              <tr key={project.id} className="border-b border-slate/5">
                <td className="py-2 font-medium">{project.name}</td>
                <td className="py-2 text-slate">{project.program || '—'}</td>
                <td className="py-2 text-right font-mono">{formatAmount(project.revenue, digest.meta.unit)}</td>
                <td className="py-2 text-right font-mono">{formatPctRaw(revenueShare(project, total) * 100)}</td>
                <td className="py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-slate/10">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${project.offshorePct}%` }} />
                    </div>
                    <span className="font-mono text-xs">{project.offshorePct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink/10 font-bold">
              <td className="py-2">{t.revenue.total}</td>
              <td></td>
              <td className="py-2 text-right font-mono">{formatAmount(total, digest.meta.unit)}</td>
              <td className="py-2 text-right font-mono">100%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
