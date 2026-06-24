import { useEffect, useState } from 'react'
import { validationService } from '../../services/validationService'
import { profileService } from '../../services/profileService'
import type { ProfileView, SkillValidationView } from '../../types'

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
      <button onClick={() => setOpen(true)} className="text-xs text-blue-600 hover:underline">
        + Atribuir validador
      </button>
    )
  }

  return (
    <div className="flex gap-2 mt-2">
      <select
        value={validatorId}
        onChange={e => setValidatorId(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
      >
        <option value="">Selecione…</option>
        {users.map(u => (
          <option key={u.userId} value={u.userId}>{u.name}</option>
        ))}
      </select>
      <button onClick={handleAssign} disabled={!validatorId || submitting}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50">
        Atribuir
      </button>
      <button onClick={() => setOpen(false)} className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
        Cancelar
      </button>
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
        <h1 className="text-2xl font-bold text-gray-900">Validações de Habilidades</h1>
        <span className="text-sm text-gray-500">{total} resultado(s)</span>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.value
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Carregando...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-12">Nenhuma validação encontrada.</div>
      ) : (
        <div className="space-y-4">
          {items.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{v.skill}</h3>
                  <p className="text-sm text-gray-500">Profissional: {v.userName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(v.requestedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {(tab === 'PENDING' || tab === 'IN_PROGRESS') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolve(v.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleResolve(v.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>

              {v.assignments.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Validadores</p>
                  <div className="flex flex-wrap gap-2">
                    {v.assignments.map(a => (
                      <span key={a.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
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
                  <p className="text-xs font-medium text-gray-500">Avaliações</p>
                  {v.questionnaires.map(q => (
                    <div key={q.id} className="bg-gray-50 rounded-lg p-3 text-sm flex items-start justify-between">
                      <div>
                        <span className="font-medium text-gray-700">{q.validatorName}</span>
                        <span className="text-gray-400 mx-1">·</span>
                        <span className="text-gray-600">{q.levelLabel}</span>
                        {q.reasoning && <p className="text-xs text-gray-500 mt-1 italic">"{q.reasoning}"</p>}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        q.decision === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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
