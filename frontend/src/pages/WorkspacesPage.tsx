import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { workspaceService } from '../services/workspaceService'
import type { WorkspaceView } from '../types'

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceView[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = () =>
    workspaceService.listMine().then(setWorkspaces).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Nome é obrigatório.'); return }
    setCreating(true)
    try {
      await workspaceService.create({ name: name.trim(), description: description.trim() || undefined })
      setName('')
      setDescription('')
      setShowForm(false)
      load()
    } catch {
      setError('Erro ao criar workspace.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Novo workspace
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Criar workspace</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Equipe Frontend"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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

      {workspaces.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Você ainda não pertence a nenhum workspace.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              to={`/workspaces/${ws.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-gray-900 truncate">{ws.name}</p>
              {ws.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ws.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{ws.memberCount} membro{ws.memberCount !== 1 ? 's' : ''}</span>
                <span>por {ws.ownerName}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
