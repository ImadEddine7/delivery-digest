import { t } from '@/i18n'
import { useDigest } from '@/lib/context'
import { coverage, coverageStatus } from '@/lib/compute/totals'
import { formatPct } from '@/lib/utils'
import type { PurchaseOrder } from '@/lib/schema'

export function PoEditor() {
  const { digest, updateDigest } = useDigest()
  const pos = digest.purchaseOrders

  const addPo = () => {
    const newPo: PurchaseOrder = {
      projectId: '',
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
    if (!confirm(t.admin.confirmDelete)) return
    updateDigest(d => ({
      ...d,
      purchaseOrders: d.purchaseOrders.filter((_, i) => i !== idx),
    }))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t.admin.nav.po}</h2>
        <button onClick={addPo} className="btn-primary text-sm">
          + {t.admin.addRow}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/10">
              <th className="pb-2 text-left text-xs font-medium text-slate">Projet</th>
              <th className="pb-2 text-right text-xs font-medium text-slate">PO demandé</th>
              <th className="pb-2 text-right text-xs font-medium text-slate">Délivré</th>
              <th className="pb-2 text-right text-xs font-medium text-slate">PO reçu</th>
              <th className="pb-2 text-right text-xs font-medium text-slate">Couverture</th>
              <th className="pb-2 text-xs"></th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po, idx) => {
              const cov = coverage(po)
              const status = coverageStatus(cov, digest.settings.coverageThresholds)
              return (
                <tr key={idx} className="border-b border-slate/5">
                  <td className="py-1.5">
                    <select
                      className="input-field w-full"
                      value={po.projectId}
                      onChange={e => updatePo(idx, 'projectId', e.target.value)}
                    >
                      <option value="">— Sélectionner —</option>
                      {digest.projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1.5">
                    <input
                      type="number"
                      className="input-field w-24 text-right font-mono"
                      value={po.poRequested}
                      onChange={e => updatePo(idx, 'poRequested', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-1.5">
                    <input
                      type="number"
                      className="input-field w-24 text-right font-mono"
                      value={po.delivered}
                      onChange={e => updatePo(idx, 'delivered', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-1.5">
                    <input
                      type="number"
                      className="input-field w-24 text-right font-mono"
                      value={po.poReceived}
                      onChange={e => updatePo(idx, 'poReceived', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className={`py-1.5 text-right font-mono font-bold coverage-${status}`}>
                    {formatPct(cov)}
                  </td>
                  <td className="py-1.5 text-center">
                    <button
                      onClick={() => deletePo(idx)}
                      className="text-xs text-danger hover:underline"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
