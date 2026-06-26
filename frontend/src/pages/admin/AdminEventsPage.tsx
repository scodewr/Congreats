import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { recognitionService } from '../../services/recognitionService'
import type { Category, EventView } from '../../types'
import Button from '../../components/ui/Button'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventView[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', categoryId: '', startsAt: '', endsAt: '' })

  useEffect(() => {
    recognitionService.listCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.categoryId || !form.startsAt || !form.endsAt) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setCreating(true)
    try {
      const ev = await adminService.createEvent({
        name: form.name, description: form.description || undefined,
        categoryId: form.categoryId,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      })
      setEvents((prev) => [ev, ...prev])
      setForm({ name: '', description: '', categoryId: '', startsAt: '', endsAt: '' })
      setShowForm(false)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao criar evento.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Eventos</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          + Novo evento
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-2xl border border-border-subtle p-6 mb-6 space-y-3">
          <h2 className="font-semibold text-text-primary">Criar evento</h2>
          {error && (
            <p className="text-sm px-3 py-2 rounded" style={{ color: 'rgb(232,48,80)', background: 'rgba(232,48,80,0.1)' }}>{error}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Nome *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                placeholder="ex: Hackathon Q3"
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Categoria *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                <option value="">Selecione...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Início *</label>
              <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Fim *</label>
              <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">Descrição</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Opcional"
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="sm" disabled={creating} isLoading={creating}>
              {creating ? 'Criando...' : 'Criar'}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {events.length === 0 ? (
        <p className="text-text-secondary text-center py-12">Nenhum evento criado nesta sessão. Os eventos são listados após criação.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-surface rounded-2xl border border-border-subtle p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-text-primary">{ev.name}</p>
                  {ev.description && <p className="text-sm text-text-tertiary mt-0.5">{ev.description}</p>}
                  <span className="inline-block mt-1 text-xs text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full">
                    {ev.categoryName}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  ev.active ? 'text-success bg-success/10' : 'text-text-tertiary bg-overlay'}`}>
                  {ev.active ? 'Ativo' : 'Encerrado'}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">
                {new Date(ev.startsAt).toLocaleDateString('pt-BR')} até {new Date(ev.endsAt).toLocaleDateString('pt-BR')}
              </p>
              <Link to={`/events/${ev.id}/ranking`}
                className="mt-2 inline-block text-xs text-purple-300 hover:text-purple-200 font-medium">
                Ver ranking →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
