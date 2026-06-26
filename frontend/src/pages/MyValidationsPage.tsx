import { useEffect, useState } from 'react'
import { validationService } from '../services/validationService'
import { profileService } from '../services/profileService'
import { useAuth } from '../contexts/AuthContext'
import type { SkillValidationView } from '../types'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:     { label: 'Pendente',      color: '#E8A020' },
  IN_PROGRESS: { label: 'Em andamento',  color: '#B87FEF' },
  APPROVED:    { label: 'Aprovada',      color: '#2EAF6A' },
  REJECTED:    { label: 'Rejeitada',     color: '#E83050' },
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
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao solicitar validação')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Minhas Validações</h1>

      {availableSkills.length > 0 && (
        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <h2 className="font-semibold text-text-primary mb-4">Solicitar Validação</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
              >
                <option value="">Selecione uma habilidade…</option>
                {availableSkills.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <Button
              variant="primary"
              onClick={handleRequest}
              disabled={!selectedSkill || submitting}
              isLoading={submitting}
            >
              Solicitar
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-sm" style={{ color: '#E83050' }}>{error}</p>
          )}
        </div>
      )}

      {validations.length === 0 ? (
        <div className="text-center text-text-secondary py-12">Nenhuma solicitação de validação ainda.</div>
      ) : (
        <div className="space-y-4">
          {validations.map(v => {
            const st = STATUS_LABELS[v.status]
            return (
              <div key={v.id} className="bg-surface border border-border-subtle rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">{v.skill}</h3>
                    <p className="text-xs text-text-tertiary">
                      Solicitada em {new Date(v.requestedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span
                    style={{
                      color: st.color,
                      backgroundColor: `${st.color}18`,
                      border: `1px solid ${st.color}40`,
                    }}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {st.label}
                  </span>
                </div>

                {v.assignments.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-1">Validadores atribuídos</p>
                    <div className="flex flex-wrap gap-2">
                      {v.assignments.map(a => (
                        <span key={a.id} className="text-xs bg-overlay text-text-secondary px-2 py-1 rounded-full">
                          {a.validatorName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {v.questionnaires.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-text-secondary">Avaliações recebidas</p>
                    {v.questionnaires.map(q => (
                      <div key={q.id} className="bg-elevated border border-border-subtle rounded-xl p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-text-primary">{q.validatorName}</span>
                          <span style={{ color: q.decision === 'APPROVED' ? '#2EAF6A' : '#E83050' }} className="font-semibold">
                            {q.decision === 'APPROVED' ? 'Aprovado' : 'Rejeitado'} · {q.levelLabel}
                          </span>
                        </div>
                        {q.reasoning && (
                          <p className="text-text-secondary text-xs italic">"{q.reasoning}"</p>
                        )}
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
