import { useDigest } from '@/lib/context'
import { monthLabel } from '@/lib/utils'
import type { HeadcountEntry } from '@/lib/schema'

export function HeadcountEditor() {
  const { digest, updateDigest } = useDigest()
  const data = [...digest.headcount].sort((a, b) => a.month.localeCompare(b.month))

  const addMonth = () => {
    const last = data[data.length - 1]
    let nextMonth: string
    if (last) {
      const [y, m] = last.month.split('-').map(Number)
      const nm = m === 12 ? 1 : m + 1
      const ny = m === 12 ? y + 1 : y
      nextMonth = `${ny}-${String(nm).padStart(2, '0')}`
    } else {
      const now = new Date()
      nextMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }
    const entry: HeadcountEntry = { month: nextMonth, offshore: 0, onshore: 0 }
    updateDigest(d => ({ ...d, headcount: [...d.headcount, entry] }))
  }

  const updateEntry = (month: string, field: 'offshore' | 'onshore', value: number) => {
    updateDigest(d => ({
      ...d,
      headcount: d.headcount.map(h => h.month === month ? { ...h, [field]: value } : h),
    }))
  }

  const deleteEntry = (month: string) => {
    updateDigest(d => ({
      ...d,
      headcount: d.headcount.filter(h => h.month !== month),
    }))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Effectifs (headcount)</h2>
        <button onClick={addMonth} className="btn-primary text-sm">
          + Ajouter un mois
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/10">
              <th className="pb-2 text-left text-xs font-medium text-slate">Mois</th>
              <th className="pb-2 text-left text-xs font-medium text-slate">Offshore</th>
              <th className="pb-2 text-left text-xs font-medium text-slate">Onshore</th>
              <th className="pb-2 text-left text-xs font-medium text-slate">Total</th>
              <th className="pb-2 text-left text-xs font-medium text-slate">% Offshore</th>
              <th className="w-10 pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map(entry => {
              const total = entry.offshore + entry.onshore
              const ratio = total > 0 ? ((entry.offshore / total) * 100).toFixed(1) : '—'
              return (
                <tr key={entry.month} className="border-b border-slate/5">
                  <td className="py-1.5 pr-4 text-sm text-slate">{monthLabel(entry.month)}</td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      className="input-field w-20 font-mono"
                      value={entry.offshore}
                      onChange={e => updateEntry(entry.month, 'offshore', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="number"
                      className="input-field w-20 font-mono"
                      value={entry.onshore}
                      onChange={e => updateEntry(entry.month, 'onshore', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </td>
                  <td className="py-1.5 pr-4 font-mono font-bold">{total}</td>
                  <td className="py-1.5 pr-4 font-mono text-sm">{ratio}{ratio !== '—' && '%'}</td>
                  <td className="py-1.5 text-center">
                    <button
                      onClick={() => deleteEntry(entry.month)}
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
      {data.length === 0 && (
        <p className="mt-4 text-sm text-slate/60">Aucune donnée. Ajoutez des mois pour commencer.</p>
      )}
    </div>
  )
}
