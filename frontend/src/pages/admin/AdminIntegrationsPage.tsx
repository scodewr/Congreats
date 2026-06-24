import { useEffect, useState } from 'react'
import { integrationService } from '../../services/integrationService'
import type { IntegrationView } from '../../types'

const PLATFORMS = [
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'JIRA', label: 'Jira' },
  { value: 'LINEAR', label: 'Linear' },
] as const

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ platform: 'GITHUB' as const, name: '', categoryId: '', workspaceId: '' })
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setIntegrations(await integrationService.list())
    } catch {
      setError('Erro ao carregar integrações.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const created = await integrationService.create({
        platform: form.platform,
        name: form.name,
        categoryId: form.categoryId || undefined,
        workspaceId: form.workspaceId || undefined,
      })
      setIntegrations(prev => [created, ...prev])
      setShowForm(false)
      setForm({ platform: 'GITHUB', name: '', categoryId: '', workspaceId: '' })
    } catch {
      setError('Erro ao criar integração.')
    } finally {
      setCreating(false)
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Desativar esta integração?')) return
    try {
      await integrationService.deactivate(id)
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, active: false } : i))
    } catch {
      setError('Erro ao desativar integração.')
    }
  }

  function copyUrl(integration: IntegrationView) {
    const url = integrationService.webhookUrl(integration.platform, integration.webhookSecret)
    navigator.clipboard.writeText(url)
    setCopiedId(integration.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return <div className="p-6 text-gray-500">Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Nova Integração
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-gray-800">Nova Integração</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Plataforma</label>
              <select
                value={form.platform}
                onChange={e => setForm(f => ({ ...f, platform: e.target.value as typeof form.platform }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="ex: Repo Backend"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={creating}
              className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {creating ? 'Criando...' : 'Criar'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="text-gray-500 text-sm hover:text-gray-700">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {integrations.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhuma integração configurada ainda.</p>
      ) : (
        <div className="space-y-3">
          {integrations.map(i => (
            <div key={i.id}
              className={`bg-white border rounded-lg p-4 ${!i.active ? 'opacity-50' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{i.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{i.platformLabel}</span>
                    {!i.active && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Desativada</span>
                    )}
                  </div>
                  {i.categoryName && (
                    <p className="text-xs text-gray-500">Categoria: {i.categoryName}</p>
                  )}
                  {i.workspaceName && (
                    <p className="text-xs text-gray-500">Workspace: {i.workspaceName}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-700 font-mono truncate max-w-xs">
                      {integrationService.webhookUrl(i.platform, i.webhookSecret)}
                    </code>
                    <button
                      onClick={() => copyUrl(i)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      {copiedId === i.id ? 'Copiado!' : 'Copiar URL'}
                    </button>
                  </div>
                </div>
                {i.active && (
                  <button
                    onClick={() => handleDeactivate(i.id)}
                    className="text-xs text-red-500 hover:text-red-700 ml-4 shrink-0"
                  >
                    Desativar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
