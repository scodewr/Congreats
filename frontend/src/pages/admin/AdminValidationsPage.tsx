import { useEffect, useState } from 'react'
import { validationService } from '../../services/validationService'
import { profileService } from '../../services/profileService'
import type { ProfileView, SkillValidationView } from '../../types'
import Button from '../../components/ui/Button'

type TabStatus = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'

const STATUS_TABS: { value: TabStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'APPROVED', label: 'Aprovadas' },
  { value: 'REJECTED', label: 'Rejeitadas' },
]

interface AssignFormProps {
  validationId: string
  onAssign: () => void
}

function AssignForm({ validationId, onAssign }: AssignFormProps) {
  const [users, setUsers] = useState<ProfileView[]>([])
  const [validatorId, setValidatorId] = useState('')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && users.length === 0) {
      profileService.search('', 0, 50).then(setUsers)
    }
  }, [open])

  const handleAssign = async () => {
    if (!validatorId) return
    setSubmitting(true)
    try {
      await validationService.adminAssign(validationId, validatorId)
      onAssign()
      setOpen(false)
      setValidatorId('')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-purple-300 hover:text-purple-200 font-medium">
        + Atribuir validador
      </button>
    )
  }

  return (
    <div className="flex gap-2 mt-2">
      <select
        value={validatorId}
        onChange={e => setValidatorId(e.target.value)}
        className="flex-1 bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      >
        <option value="">Selecione…</option>
        {users.map(u => (
          <option key={u.userId} value={u.userId}>{u.name}</option>
        ))}
      </select>
      <Button variant="primary" size="sm" onClick={handleAssign} disabled={!validatorId || submitting}>
        Atribuir
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
    </div>
  )
}

export default function AdminValidationsPage() {
  const [tab, setTab] = useState<TabStatus>('PENDING')
  const [items, setItems] = useState<SkillValidationView[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    validationService.adminList(tab)
      .then(({ items: i, total: t }) => { setItems(i); setTotal(t) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [tab])

  const handleResolve = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    await validationService.adminResolve(id, decision)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Validações de Habilidades</h1>
        <span className="text-sm text-text-tertiary">{total} resultado(s)</span>
      </div>

      <div className="flex gap-1 border-b border-border-subtle">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.value
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12">Carregando...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-text-secondary py-12">Nenhuma validação encontrada.</div>
      ) : (
        <div className="space-y-4">
          {items.map(v => (
            <div key={v.id} className="bg-surface rounded-2xl border border-border-subtle p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{v.skill}</h3>
                  <p className="text-sm text-text-secondary">Profissional: {v.userName}</p>
                  <p className="text-xs text-text-tertiary">
                    {new Date(v.requestedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {(tab === 'PENDING' || tab === 'IN_PROGRESS') && (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolve(v.id, 'APPROVED')}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleResolve(v.id, 'REJECTED')}
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}
              </div>

              {v.assignments.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-text-tertiary mb-1">Validadores</p>
                  <div className="flex flex-wrap gap-2">
                    {v.assignments.map(a => (
                      <span key={a.id} className="text-xs bg-overlay text-text-secondary px-2 py-1 rounded-full">
                        {a.validatorName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(tab === 'PENDING' || tab === 'IN_PROGRESS') && (
                <AssignForm validationId={v.id} onAssign={load} />
              )}

              {v.questionnaires.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-text-tertiary">Avaliações</p>
                  {v.questionnaires.map(q => (
                    <div key={q.id} className="bg-elevated rounded-xl p-3 text-sm flex items-start justify-between">
                      <div>
                        <span className="font-medium text-text-secondary">{q.validatorName}</span>
                        <span className="text-text-tertiary mx-1">·</span>
                        <span className="text-text-secondary">{q.levelLabel}</span>
                        {q.reasoning && <p className="text-xs text-text-tertiary mt-1 italic">"{q.reasoning}"</p>}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        q.decision === 'APPROVED'
                          ? 'text-success bg-success/10'
                          : 'text-error bg-error/10'
                      }`}>
                        {q.decision === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
