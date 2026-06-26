import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { workspaceService } from '../services/workspaceService'
import type { WorkspaceView } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="shimmer rounded-2xl h-36" />)}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Workspaces</h1>
        <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
          + Novo workspace
        </Button>
      </div>

      {/* Form de criação */}
      {showForm && (
        <div className="bg-surface border border-border-subtle rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-text-primary mb-4">Criar workspace</h2>
          {error && (
            <p className="text-sm mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(232,48,80,0.1)', color: '#E83050' }}>
              {error}
            </p>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Nome *"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex: Equipe Frontend"
            />
            <Input
              label="Descrição"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Opcional"
            />
            <div className="flex gap-3">
              <Button type="submit" variant="primary" isLoading={creating}>
                Criar
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {workspaces.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary">Você ainda não pertence a nenhum workspace.</p>
          <p className="text-text-tertiary text-sm mt-1">Crie um para começar a colaborar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <Link key={ws.id} to={`/workspaces/${ws.id}`}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-surface border border-border-subtle rounded-2xl p-5 hover:border-purple-700/50 hover:shadow-purple-glow transition-shadow h-full"
              >
                {/* Ícone/inicial do workspace */}
                <div className="w-10 h-10 rounded-xl bg-purple-900 flex items-center justify-center text-purple-300 font-bold text-lg mb-3">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-text-primary truncate">{ws.name}</p>
                {ws.description && (
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{ws.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-text-tertiary">
                  <span>{ws.memberCount} membro{ws.memberCount !== 1 ? 's' : ''}</span>
                  <span>por {ws.ownerName}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
