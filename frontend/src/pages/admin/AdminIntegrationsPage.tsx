import { useEffect, useState } from 'react'
import { integrationService } from '../../services/integrationService'
import type { IntegrationView } from '../../types'
import Button from '../../components/ui/Button'

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

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Integrações</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          + Nova Integração
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ color: 'rgb(232,48,80)', background: 'rgba(232,48,80,0.1)', border: '1px solid rgba(232,48,80,0.25)' }}>{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-surface border border-border-subtle rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-text-primary">Nova Integração</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Plataforma</label>
              <select
                value={form.platform}
                onChange={e => setForm(f => ({ ...f, platform: e.target.value as typeof form.platform }))}
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Nome</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="ex: Repo Backend"
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={creating} isLoading={creating}>
              {creating ? 'Criando...' : 'Criar'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {integrations.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-8">Nenhuma integração configurada ainda.</p>
      ) : (
        <div className="space-y-3">
          {integrations.map(i => (
            <div key={i.id}
              className={`bg-surface border border-border-subtle rounded-2xl p-5 ${!i.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary">{i.name}</span>
                    <span className="text-xs bg-overlay text-text-secondary px-2 py-0.5 rounded-full">{i.platformLabel}</span>
                    {!i.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: 'rgb(232,48,80)', background: 'rgba(232,48,80,0.1)' }}>Desativada</span>
                    )}
                  </div>
                  {i.categoryName && (
                    <p className="text-xs text-text-tertiary">Categoria: {i.categoryName}</p>
                  )}
                  {i.workspaceName && (
                    <p className="text-xs text-text-tertiary">Workspace: {i.workspaceName}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs bg-elevated border border-border-subtle rounded-lg px-2 py-1 text-text-secondary font-mono truncate max-w-xs">
                      {integrationService.webhookUrl(i.platform, i.webhookSecret)}
                    </code>
                    <button
                      onClick={() => copyUrl(i)}
                      className="text-xs text-purple-300 hover:text-purple-200"
                    >
                      {copiedId === i.id ? 'Copiado!' : 'Copiar URL'}
                    </button>
                  </div>
                </div>
                {i.active && (
                  <Button variant="destructive" size="sm" onClick={() => handleDeactivate(i.id)}>
                    Desativar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
