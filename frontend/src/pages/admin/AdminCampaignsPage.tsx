import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { recognitionService } from '../../services/recognitionService'
import type { CampaignView, Category } from '../../types'

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignView[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', categoryId: '', startsAt: '', endsAt: '' })

  const load = () =>
    Promise.all([
      adminService.getActiveCampaigns(),
      recognitionService.listCategories(),
    ]).then(([c, cats]) => {
      setCampaigns(c)
      setCategories(cats)
    }).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.categoryId || !form.startsAt || !form.endsAt) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setCreating(true)
    try {
      await adminService.createCampaign({
        name: form.name, description: form.description || undefined,
        categoryId: form.categoryId,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      })
      setForm({ name: '', description: '', categoryId: '', startsAt: '', endsAt: '' })
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao criar campanha.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          + Nova campanha
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Criar campanha</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                placeholder="ex: Semana de Inovação"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Selecione...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início *</label>
              <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim *</label>
              <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Opcional"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={creating}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {creating ? 'Criando...' : 'Criar'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {campaigns.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhuma campanha ativa no momento.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-primary-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  {c.description && <p className="text-sm text-gray-500 mt-0.5">{c.description}</p>}
                  <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                    {c.categoryName}
                  </span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                  Ativa
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(c.startsAt).toLocaleDateString('pt-BR')} até {new Date(c.endsAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
