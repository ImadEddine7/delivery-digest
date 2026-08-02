import { t } from '@/i18n'
import { totalRevenue, revenueShare } from '@/lib/compute/totals'
import { formatAmount, formatPctRaw } from '@/lib/utils'
import type { Digest } from '@/lib/schema'

export function Revenue({ digest }: { digest: Digest }) {
  const total = totalRevenue(digest.projects)
  const activeProjects = digest.projects.filter(p => p.active)

  if (activeProjects.length === 0) return null

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
              <th className="pb-2 text-right font-medium text-slate">{t.revenue.amount}</th>
              <th className="pb-2 text-right font-medium text-slate">{t.revenue.share}</th>
            </tr>
          </thead>
          <tbody>
            {activeProjects.map(project => (
              <tr key={project.id} className="border-b border-slate/5">
                <td className="py-2 font-medium">{project.name}</td>
                <td className="py-2 text-right font-mono">{formatAmount(project.revenue, digest.meta.unit)}</td>
                <td className="py-2 text-right font-mono">{formatPctRaw(revenueShare(project, total) * 100)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink/10 font-bold">
              <td className="py-2">{t.revenue.total}</td>
              <td className="py-2 text-right font-mono">{formatAmount(total, digest.meta.unit)}</td>
              <td className="py-2 text-right font-mono">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
