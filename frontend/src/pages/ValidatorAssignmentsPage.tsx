import { useEffect, useState } from 'react'
import { validationService } from '../services/validationService'
import type { SkillValidationView } from '../types'

const LEVEL_OPTIONS = [
  { value: 'BEGINNER', label: 'Iniciante' },
  { value: 'INTERMEDIATE', label: 'Intermediário' },
  { value: 'ADVANCED', label: 'Avançado' },
  { value: 'EXPERT', label: 'Especialista' },
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
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao enviar questionário')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-gray-100 pt-4">
      <p className="text-sm font-medium text-gray-700">Avaliação de <strong>{validation.skill}</strong> — {validation.userName}</p>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" value="APPROVED" checked={decision === 'APPROVED'}
            onChange={() => setDecision('APPROVED')} className="accent-green-600" />
          Aprovar
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" value="REJECTED" checked={decision === 'REJECTED'}
            onChange={() => setDecision('REJECTED')} className="accent-red-600" />
          Rejeitar
        </label>
      </div>

      <select
        value={level}
        onChange={e => setLevel(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        {LEVEL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <textarea
        value={reasoning}
        onChange={e => setReasoning(e.target.value)}
        placeholder="Descreva em que contextos você observou esta habilidade (opcional)…"
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        Enviar Avaliação
      </button>
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

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>

  const pending = assignments.filter(a => a.status === 'PENDING' || a.status === 'IN_PROGRESS')
  const done = assignments.filter(a => a.status === 'APPROVED' || a.status === 'REJECTED')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Validações Atribuídas</h1>

      {pending.length === 0 && done.length === 0 && (
        <div className="text-center text-gray-500 py-12">Nenhuma validação atribuída a você.</div>
      )}

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700">Pendentes</h2>
          {pending.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{v.skill}</h3>
                  <p className="text-sm text-gray-500">Profissional: {v.userName}</p>
                  <p className="text-xs text-gray-400">
                    Solicitado em {new Date(v.requestedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
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
          <h2 className="font-semibold text-gray-700">Concluídas</h2>
          {done.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4 opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{v.skill}</span>
                  <span className="text-sm text-gray-500 ml-2">— {v.userName}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${v.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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
