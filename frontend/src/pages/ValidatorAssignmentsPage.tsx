import { useEffect, useState } from 'react'
import { validationService } from '../services/validationService'
import type { SkillValidationView } from '../types'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'

const LEVEL_OPTIONS = [
  { value: 'BEGINNER',     label: 'Iniciante' },
  { value: 'INTERMEDIATE', label: 'Intermediário' },
  { value: 'ADVANCED',     label: 'Avançado' },
  { value: 'EXPERT',       label: 'Especialista' },
]

interface QuestionnaireFormProps {
  validation: SkillValidationView
  onSubmit: () => void
}

function QuestionnaireForm({ validation, onSubmit }: QuestionnaireFormProps) {
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED')
  const [level, setLevel] = useState('INTERMEDIATE')
  const [reasoning, setReasoning] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await validationService.submitQuestionnaire(validation.id, { decision, level, reasoning })
      onSubmit()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao enviar questionário')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-border-subtle pt-4">
      <p className="text-sm font-medium text-text-secondary">
        Avaliação de <strong className="text-text-primary">{validation.skill}</strong> — {validation.userName}
      </p>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer text-text-secondary">
          <input
            type="radio"
            value="APPROVED"
            checked={decision === 'APPROVED'}
            onChange={() => setDecision('APPROVED')}
            className="accent-success"
          />
          <span style={{ color: decision === 'APPROVED' ? '#2EAF6A' : undefined }}>Aprovar</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer text-text-secondary">
          <input
            type="radio"
            value="REJECTED"
            checked={decision === 'REJECTED'}
            onChange={() => setDecision('REJECTED')}
            className="accent-error"
          />
          <span style={{ color: decision === 'REJECTED' ? '#E83050' : undefined }}>Rejeitar</span>
        </label>
      </div>

      <Select
        value={level}
        onChange={e => setLevel(e.target.value)}
      >
        {LEVEL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>

      <Textarea
        value={reasoning}
        onChange={e => setReasoning(e.target.value)}
        placeholder="Descreva em que contextos você observou esta habilidade (opcional)…"
        rows={3}
      />

      {error && <p className="text-sm" style={{ color: '#E83050' }}>{error}</p>}

      <Button type="submit" variant="primary" isLoading={submitting}>
        Enviar Avaliação
      </Button>
    </form>
  )
}

export default function ValidatorAssignmentsPage() {
  const [assignments, setAssignments] = useState<SkillValidationView[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    validationService.getAssignments()
      .then(setAssignments)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>

  const pending = assignments.filter(a => a.status === 'PENDING' || a.status === 'IN_PROGRESS')
  const done    = assignments.filter(a => a.status === 'APPROVED' || a.status === 'REJECTED')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Validações Atribuídas</h1>

      {pending.length === 0 && done.length === 0 && (
        <div className="text-center text-text-secondary py-12">Nenhuma validação atribuída a você.</div>
      )}

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-text-secondary">Pendentes</h2>
          {pending.map(v => (
            <div key={v.id} className="bg-surface border border-border-subtle rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{v.skill}</h3>
                  <p className="text-sm text-text-secondary">Profissional: {v.userName}</p>
                  <p className="text-xs text-text-tertiary">
                    Solicitado em {new Date(v.requestedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(184,127,239,0.1)', color: '#B87FEF', border: '1px solid rgba(184,127,239,0.3)' }}
                >
                  Aguardando sua avaliação
                </span>
              </div>
              <QuestionnaireForm validation={v} onSubmit={load} />
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-text-secondary">Concluídas</h2>
          {done.map(v => (
            <div key={v.id} className="bg-surface border border-border-subtle rounded-2xl p-4 opacity-60">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-text-primary">{v.skill}</span>
                  <span className="text-sm text-text-secondary ml-2">— {v.userName}</span>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={v.status === 'APPROVED'
                    ? { backgroundColor: 'rgba(46,175,106,0.1)', color: '#2EAF6A' }
                    : { backgroundColor: 'rgba(232,48,80,0.1)', color: '#E83050' }
                  }
                >
                  {v.status === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
