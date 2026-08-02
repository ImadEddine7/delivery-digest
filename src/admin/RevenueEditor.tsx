import { t } from '@/i18n'
import { useDigest } from '@/lib/context'
import { generateId } from '@/lib/utils'
import type { Project } from '@/lib/schema'

export function RevenueEditor() {
  const { digest, updateDigest } = useDigest()
  const projects = digest.projects

  const addProject = () => {
    const newProject: Project = {
      id: generateId('prj'),
      name: '',
      program: '',
      active: true,
      revenue: 0,
      offshorePct: 50,
      comment: '',
    }
    updateDigest(d => ({ ...d, projects: [...d.projects, newProject] }))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    updateDigest(d => ({
      ...d,
      projects: d.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }))
  }

  const deleteProject = (id: string) => {
    if (!confirm(t.admin.confirmDelete)) return
    updateDigest(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t.admin.nav.revenue}</h2>
        <button onClick={addProject} className="btn-primary text-sm">
          + {t.admin.addRow}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/10">
              <th className="pb-2 text-left text-xs font-medium text-slate">Projet</th>
              <th className="pb-2 text-left text-xs font-medium text-slate">Programme</th>
              <th className="pb-2 text-right text-xs font-medium text-slate">CA (k€)</th>
              <th className="pb-2 text-right text-xs font-medium text-slate">% Offshore</th>
              <th className="pb-2 text-center text-xs font-medium text-slate">Actif</th>
              <th className="pb-2 text-xs font-medium text-slate"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b border-slate/5">
                <td className="py-1.5">
                  <input
                    className="input-field w-full"
                    value={p.name}
                    onChange={e => updateProject(p.id, 'name', e.target.value)}
                    placeholder="Nom du projet"
                  />
                </td>
                <td className="py-1.5">
                  <input
                    className="input-field w-24"
                    value={p.program || ''}
                    onChange={e => updateProject(p.id, 'program', e.target.value)}
                    placeholder="—"
                  />
                </td>
                <td className="py-1.5">
                  <input
                    type="number"
                    className="input-field w-24 text-right font-mono"
                    value={p.revenue}
                    onChange={e => updateProject(p.id, 'revenue', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </td>
                <td className="py-1.5">
                  <input
                    type="number"
                    className="input-field w-20 text-right font-mono"
                    value={p.offshorePct}
                    onChange={e => updateProject(p.id, 'offshorePct', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                </td>
                <td className="py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={e => updateProject(p.id, 'active', e.target.checked)}
                    className="h-4 w-4 rounded border-slate/20 text-accent"
                  />
                </td>
                <td className="py-1.5 text-center">
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-xs text-danger hover:underline"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
