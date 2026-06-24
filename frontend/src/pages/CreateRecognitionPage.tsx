import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { recognitionService } from '../services/recognitionService'
import { workspaceService } from '../services/workspaceService'
import { useAuth } from '../contexts/AuthContext'
import type { Category, ProfileView, WorkspaceView } from '../types'

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

// ─── Professional search ──────────────────────────────────────────────────────

interface UserComboboxProps {
  value: string
  onChange: (userId: string, name: string) => void
  excludeId?: string
}

function UserCombobox({ value, onChange, excludeId }: UserComboboxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProfileView[]>([])
  const [open, setOpen] = useState(false)
  const [selectedName, setSelectedName] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedQuery.length < 1) { setResults([]); return }
    profileService.search(debouncedQuery, 0, 10)
      .then((r) => setResults(r.filter((p) => p.userId !== excludeId)))
      .catch(() => setResults([]))
  }, [debouncedQuery, excludeId])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (p: ProfileView) => {
    setSelectedName(p.name)
    setQuery('')
    setOpen(false)
    onChange(p.userId, p.name)
  }

  const clear = () => { setSelectedName(''); onChange('', ''); setQuery('') }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {selectedName ? (
        <div className="flex items-center justify-between border border-primary-400 rounded-lg px-3 py-2 bg-primary-50">
          <span className="text-sm font-medium text-primary-800">{selectedName}</span>
          <button type="button" onClick={clear} className="text-gray-400 hover:text-gray-600 ml-2">✕</button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Digite o nome do profissional…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
          {results.map((p) => (
            <li key={p.userId}>
              <button
                type="button"
                onMouseDown={() => select(p)}
                className="w-full text-left px-3 py-2 hover:bg-primary-50 text-sm"
              >
                <span className="font-medium text-gray-900">{p.name}</span>
                {p.jobTitle && <span className="text-gray-500 ml-2 text-xs">— {p.jobTitle}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.length >= 1 && results.length === 0 && (
        <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow mt-1 px-3 py-2 text-sm text-gray-400">
          Nenhum profissional encontrado
        </div>
      )}
    </div>
  )
}

// ─── Category autocomplete ───────────────────────────────────────────────────

interface CategoryInputProps {
  value: string
  onChange: (name: string) => void
}

function CategoryInput({ value, onChange }: CategoryInputProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 250)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    recognitionService.searchCategories(debouncedQuery, 8)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
  }, [debouncedQuery])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pick = (name: string) => {
    setQuery(name)
    onChange(name)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Ex: Liderança, Inovação, Colaboração…"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={() => pick(c.name)}
                className="w-full text-left px-3 py-2 hover:bg-primary-50 text-sm"
              >
                <span className="font-medium text-gray-900">{c.name}</span>
                {c.suggestedSkills.length > 0 && (
                  <span className="text-gray-400 ml-2 text-xs">{c.suggestedSkills.slice(0, 3).join(', ')}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CreateRecognitionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [recognizedId, setRecognizedId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [workspaces, setWorkspaces] = useState<WorkspaceView[]>([])
  const [workspaceId, setWorkspaceId] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [testimonial, setTestimonial] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])

  useEffect(() => {
    workspaceService.listMine().then(setWorkspaces).catch(() => setWorkspaces([]))
  }, [])

  // When category changes, fetch suggested skills for that category
  const debouncedCategory = useDebounce(categoryName, 400)
  useEffect(() => {
    if (!debouncedCategory) { setSuggestedSkills([]); return }
    recognitionService.searchCategories(debouncedCategory, 1)
      .then((cats) => {
        const match = cats.find((c) => c.name.toLowerCase() === debouncedCategory.toLowerCase())
        setSuggestedSkills(match?.suggestedSkills ?? [])
      })
      .catch(() => setSuggestedSkills([]))
  }, [debouncedCategory])

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) setSkills((s) => [...s, trimmed])
    setSkillInput('')
  }
  const removeSkill = (skill: string) => setSkills((s) => s.filter((x) => x !== skill))
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!recognizedId) { setError('Selecione um profissional.'); return }
    if (!categoryName.trim()) { setError('Informe uma categoria.'); return }
    if (skills.length === 0) { setError('Adicione pelo menos uma habilidade.'); return }
    if (testimonial.trim().length < 20) { setError('O depoimento deve ter pelo menos 20 caracteres.'); return }

    setLoading(true)
    try {
      const rec = await recognitionService.create({
        recognizedId, categoryName: categoryName.trim(), skills, testimonial,
        workspaceId: workspaceId || undefined,
      })
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

          {/* Professional search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profissional *</label>
            <UserCombobox
              value={recognizedId}
              onChange={(id) => setRecognizedId(id)}
              excludeId={user?.id}
            />
          </div>

          {/* Category autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <CategoryInput value={categoryName} onChange={setCategoryName} />
            <p className="text-xs text-gray-400 mt-1">Digite livremente ou selecione uma sugestão</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades *</label>
            {suggestedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {suggestedSkills.map((s) => (
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
              placeholder="Digite e pressione Enter para adicionar…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Workspace */}
          {workspaces.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workspace <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <select value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Nenhum</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>
          )}

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
              placeholder="Descreva por que está reconhecendo este profissional…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{testimonial.length}/2000</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Enviando…' : 'Enviar reconhecimento'}
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
