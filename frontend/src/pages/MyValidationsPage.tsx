import { useEffect, useState } from 'react'
import { validationService } from '../services/validationService'
import { profileService } from '../services/profileService'
import { useAuth } from '../contexts/AuthContext'
import type { SkillValidationView } from '../types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: '#92400e' },
  IN_PROGRESS: { label: 'Em andamento', color: '#1d4ed8' },
  APPROVED: { label: 'Aprovada', color: '#15803d' },
  REJECTED: { label: 'Rejeitada', color: '#b91c1c' },
}

export default function MyValidationsPage() {
  const { user } = useAuth()
  const [validations, setValidations] = useState<SkillValidationView[]>([])
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [selectedSkill, setSelectedSkill] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([
      validationService.getMine(),
      profileService.getById(user.id),
    ]).then(([v, profile]) => {
      setValidations(v)
      const validated = new Set(v.filter(x => x.status === 'PENDING' || x.status === 'IN_PROGRESS').map(x => x.skill))
      setAvailableSkills(profile.topSkills.map(s => s.skill).filter(s => !validated.has(s)))
    }).finally(() => setLoading(false))
  }, [user])

  const handleRequest = async () => {
    if (!selectedSkill) return
    setSubmitting(true)
    setError('')
    try {
      await validationService.requestValidation(selectedSkill)
      const updated = await validationService.getMine()
      setValidations(updated)
      setSelectedSkill('')
      setAvailableSkills(prev => prev.filter(s => s !== selectedSkill))
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erro ao solicitar validação')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Minhas Validações</h1>

      {availableSkills.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Solicitar Validação</h2>
          <div className="flex gap-3">
            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecione uma habilidade…</option>
              {availableSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleRequest}
              disabled={!selectedSkill || submitting}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              Solicitar
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}

      {validations.length === 0 ? (
        <div className="text-center text-gray-500 py-12">Nenhuma solicitação de validação ainda.</div>
      ) : (
        <div className="space-y-4">
          {validations.map(v => {
            const st = STATUS_LABELS[v.status]
            return (
              <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.skill}</h3>
                    <p className="text-xs text-gray-400">
                      Solicitada em {new Date(v.requestedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span
                    style={{ color: st.color, background: `${st.color}18`, border: `1px solid ${st.color}40` }}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {st.label}
                  </span>
                </div>

                {v.assignments.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Validadores atribuídos</p>
                    <div className="flex flex-wrap gap-2">
                      {v.assignments.map(a => (
                        <span key={a.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {a.validatorName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {v.questionnaires.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500">Avaliações recebidas</p>
                    {v.questionnaires.map(q => (
                      <div key={q.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{q.validatorName}</span>
                          <span className={q.decision === 'APPROVED' ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                            {q.decision === 'APPROVED' ? 'Aprovado' : 'Rejeitado'} · {q.levelLabel}
                          </span>
                        </div>
                        {q.reasoning && <p className="text-gray-600 text-xs italic">"{q.reasoning}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
