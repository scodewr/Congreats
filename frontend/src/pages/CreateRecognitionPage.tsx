import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { recognitionService } from '../services/recognitionService'
import { workspaceService } from '../services/workspaceService'
import { useAuth } from '../contexts/AuthContext'
import type { Category, ProfileView, WorkspaceView } from '../types'
import Button from '../components/ui/Button'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'

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

function UserCombobox({ onChange, excludeId }: UserComboboxProps) {
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
        <div className="bg-purple-900 border border-purple-500 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-purple-300 font-medium">{selectedName}</span>
          <button type="button" onClick={clear} className="text-text-secondary hover:text-text-primary ml-2">✕</button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Digite o nome do profissional…"
          className="w-full bg-elevated border border-border-dim rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 w-full bg-elevated border border-border-subtle rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto">
          {results.map((p) => (
            <li key={p.userId}>
              <button
                type="button"
                onMouseDown={() => select(p)}
                className="w-full text-left px-4 py-3 hover:bg-overlay text-text-primary text-sm"
              >
                <span className="font-medium">{p.name}</span>
                {p.jobTitle && <span className="text-text-tertiary ml-2 text-xs">— {p.jobTitle}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.length >= 1 && results.length === 0 && (
        <div className="absolute z-20 w-full bg-elevated border border-border-subtle rounded-xl mt-1 px-4 py-3 text-sm text-text-tertiary">
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
        className="w-full bg-elevated border border-border-dim rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-elevated border border-border-subtle rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={() => pick(c.name)}
                className="w-full text-left px-4 py-3 hover:bg-overlay text-text-primary text-sm"
              >
                <span className="font-medium">{c.name}</span>
                {c.suggestedSkills.length > 0 && (
                  <span className="text-text-tertiary ml-2 text-xs">{c.suggestedSkills.slice(0, 3).join(', ')}</span>
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
      <h1 className="text-3xl font-bold text-text-primary mb-6">Reconhecer profissional</h1>

      {error && (
        <div className="mb-4 text-sm px-4 py-3 rounded-xl border" style={{ backgroundColor: 'rgba(232,48,80,0.1)', color: '#E83050', borderColor: 'rgba(232,48,80,0.2)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-surface border border-border-subtle rounded-2xl p-6 space-y-5">

          {/* Profissional */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Profissional *</label>
            <UserCombobox
              value={recognizedId}
              onChange={(id) => setRecognizedId(id)}
              excludeId={user?.id}
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Categoria *</label>
            <CategoryInput value={categoryName} onChange={setCategoryName} />
            <p className="text-xs text-text-tertiary mt-1">Digite livremente ou selecione uma sugestão</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Habilidades *</label>
            {suggestedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {suggestedSkills.map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      skills.includes(s)
                        ? 'bg-purple-900 border-purple-500 text-purple-300'
                        : 'border-border-dim text-text-secondary hover:border-purple-700 hover:text-purple-300'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mb-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 bg-purple-900 border border-purple-700/50 text-purple-300 text-xs px-3 py-1 rounded-full">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-text-primary ml-1">×</button>
                </span>
              ))}
            </div>
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Digite e pressione Enter para adicionar…"
              className="w-full bg-elevated border border-border-dim rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Workspace */}
          {workspaces.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Workspace <span className="text-text-tertiary font-normal">(opcional)</span>
              </label>
              <Select value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}>
                <option value="">Nenhum</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </Select>
            </div>
          )}

          {/* Depoimento */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Depoimento * <span className="text-text-tertiary font-normal">(mínimo 20 caracteres)</span>
            </label>
            <Textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Descreva por que está reconhecendo este profissional…"
            />
            <p className="text-xs text-text-tertiary text-right mt-1">{testimonial.length}/2000</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" isLoading={loading} className="flex-1">
            Enviar reconhecimento
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
