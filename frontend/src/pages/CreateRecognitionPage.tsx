import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { recognitionService } from '../services/recognitionService'
import { useAuth } from '../contexts/AuthContext'
import type { Category, ProfileView } from '../types'

export default function CreateRecognitionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [professionals, setProfessionals] = useState<ProfileView[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recognizedId, setRecognizedId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [testimonial, setTestimonial] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      profileService.search(0, 100),
      recognitionService.listCategories(),
    ]).then(([p, c]) => {
      setProfessionals(p.filter((prof) => prof.userId !== user?.id))
      setCategories(c)
    })
  }, [user])

  const selectedCategory = categories.find((c) => c.id === categoryId)

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
    }
    setSkillInput('')
  }

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill))

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!recognizedId) { setError('Selecione um profissional.'); return }
    if (!categoryId) { setError('Selecione uma categoria.'); return }
    if (skills.length === 0) { setError('Adicione pelo menos uma habilidade.'); return }
    if (testimonial.trim().length < 20) { setError('O depoimento deve ter pelo menos 20 caracteres.'); return }

    setLoading(true)
    try {
      const rec = await recognitionService.create({ recognizedId, categoryId, skills, testimonial })
      navigate(`/profile/${rec.recognized.userId}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao criar reconhecimento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reconhecer profissional</h1>

      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {/* Professional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profissional *</label>
            <select value={recognizedId} onChange={(e) => setRecognizedId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Selecione...</option>
              {professionals.map((p) => (
                <option key={p.userId} value={p.userId}>{p.name}{p.jobTitle ? ` — ${p.jobTitle}` : ''}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades *</label>
            {selectedCategory?.suggestedSkills && selectedCategory.suggestedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedCategory.suggestedSkills.map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      skills.includes(s)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 text-gray-600 hover:border-primary-400'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mb-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-primary-900">×</button>
                </span>
              ))}
            </div>
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Digite e pressione Enter para adicionar..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Testimonial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depoimento * <span className="text-gray-400 font-normal">(mínimo 20 caracteres)</span>
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Descreva por que está reconhecendo este profissional..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{testimonial.length}/2000</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar reconhecimento'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="px-6 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
