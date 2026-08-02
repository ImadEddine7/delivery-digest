import { t } from '@/i18n'
import { useDigest } from '@/lib/context'
import { coverage, coverageStatus, totalRevenue } from '@/lib/compute/totals'
import { formatPct, formatAmount } from '@/lib/utils'
import type { PurchaseOrder } from '@/lib/schema'

export function PoEditor() {
  const { digest, updateDigest } = useDigest()
  const pos = digest.purchaseOrders
  const projects = digest.projects

  const totalPo = pos.reduce((s, po) => s + po.poRequested, 0)
  const totalCa = totalRevenue(projects)
  const poMismatch = projects.length > 0 && Math.abs(totalPo - totalCa) > 0.01

  const addPoLine = (projectId: string) => {
    const newPo: PurchaseOrder = {
      projectId,
      label: '',
      poRequested: 0,
      delivered: 0,
      poReceived: 0,
    }
    updateDigest(d => ({ ...d, purchaseOrders: [...d.purchaseOrders, newPo] }))
  }

  const updatePo = (idx: number, field: keyof PurchaseOrder, value: any) => {
    updateDigest(d => ({
      ...d,
      purchaseOrders: d.purchaseOrders.map((po, i) => i === idx ? { ...po, [field]: value } : po),
    }))
  }

  const deletePo = (idx: number) => {
    updateDigest(d => ({
      ...d,
      purchaseOrders: d.purchaseOrders.filter((_, i) => i !== idx),
    }))
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">{t.admin.nav.po}</h2>
        <p className="text-sm text-slate">
          Total PO demandé : <strong>{formatAmount(totalPo, digest.meta.unit)}</strong>
          {' '} / CA : <strong>{formatAmount(totalCa, digest.meta.unit)}</strong>
        </p>
        {poMismatch && (
          <p className="mt-1 text-sm font-medium text-warning">
            ⚠ Écart : le total PO demandé ({formatAmount(totalPo, digest.meta.unit)}) ne correspond pas au CA ({formatAmount(totalCa, digest.meta.unit)})
          </p>
        )}
      </div>

      {projects.map(project => {
        const projectPos = pos
          .map((po, idx) => ({ ...po, _idx: idx }))
          .filter(po => po.projectId === project.id)
        const projectPoTotal = projectPos.reduce((s, po) => s + po.poRequested, 0)
        const projectMismatch = Math.abs(projectPoTotal - project.revenue) > 0.01

        return (
          <div key={project.id} className="mb-6 rounded-lg border border-slate/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-ink">{project.name || '(sans nom)'}</h3>
                <span className="text-xs text-slate">
                  CA : {formatAmount(project.revenue, digest.meta.unit)}
                  {' '} — PO demandé : {formatAmount(projectPoTotal, digest.meta.unit)}
                  {projectMismatch && <span className="ml-2 text-warning">⚠ écart</span>}
                </span>
              </div>
              <button onClick={() => addPoLine(project.id)} className="btn-secondary text-xs">
                + Ventiler
              </button>
            </div>

            {projectPos.length === 0 && (
              <p className="text-xs text-slate/60">Aucun PO. Cliquez sur "+ Ventiler" pour ajouter une ligne.</p>
            )}

            {projectPos.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate/10">
                    <th className="pb-1 text-left text-xs font-medium text-slate">Label</th>
                    <th className="pb-1 text-right text-xs font-medium text-slate">PO demandé</th>
                    <th className="pb-1 text-right text-xs font-medium text-slate">Délivré</th>
                    <th className="pb-1 text-right text-xs font-medium text-slate">PO reçu</th>
                    <th className="pb-1 text-right text-xs font-medium text-slate">Couverture</th>
                    <th className="pb-1 text-xs"></th>
                  </tr>
                </thead>
                <tbody>
                  {projectPos.map(po => {
                    const cov = coverage(po)
                    const status = coverageStatus(cov, digest.settings.coverageThresholds)
                    return (
                      <tr key={po._idx} className="border-b border-slate/5">
                        <td className="py-1">
                          <input
                            className="input-field w-full"
                            value={po.label}
                            onChange={e => updatePo(po._idx, 'label', e.target.value)}
                            placeholder="ex: PO Q1, add-on..."
                          />
                        </td>
                        <td className="py-1">
                          <input
                            type="number"
                            className="input-field w-24 text-right font-mono"
                            value={po.poRequested}
                            onChange={e => updatePo(po._idx, 'poRequested', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="py-1">
                          <input
                            type="number"
                            className="input-field w-24 text-right font-mono"
                            value={po.delivered}
                            onChange={e => updatePo(po._idx, 'delivered', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="py-1">
                          <input
                            type="number"
                            className="input-field w-24 text-right font-mono"
                            value={po.poReceived}
                            onChange={e => updatePo(po._idx, 'poReceived', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className={`py-1 text-right font-mono text-xs font-bold coverage-${status}`}>
                          {formatPct(cov)}
                        </td>
                        <td className="py-1 text-center">
                          <button
                            onClick={() => deletePo(po._idx)}
                            className="text-xs text-danger"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </div>
  )
}
