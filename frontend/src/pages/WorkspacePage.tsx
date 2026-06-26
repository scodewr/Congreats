import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { workspaceService } from '../services/workspaceService'
import { profileService } from '../services/profileService'
import { useAuth } from '../contexts/AuthContext'
import type { PageResult, ProfileView, RecognitionView, WorkspaceView } from '../types'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [workspace, setWorkspace] = useState<WorkspaceView | null>(null)
  const [feed, setFeed] = useState<PageResult<RecognitionView> | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingMember, setAddingMember] = useState(false)
  const [professionals, setProfessionals] = useState<ProfileView[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [memberError, setMemberError] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      workspaceService.listMine(),
      workspaceService.getFeed(id),
      profileService.search('', 0, 100),
    ]).then(([workspaces, feedData, profs]) => {
      setWorkspace(workspaces.find((ws) => ws.id === id) ?? null)
      setFeed(feedData)
      setProfessionals(profs)
    }).finally(() => setLoading(false))
  }, [id])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMemberError('')
    if (!selectedUserId || !id) return
    try {
      await workspaceService.addMember(id, selectedUserId)
      setSelectedUserId('')
      setAddingMember(false)
      workspaceService.listMine().then((wss) => setWorkspace(wss.find((ws) => ws.id === id) ?? null))
    } catch {
      setMemberError('Erro ao adicionar membro.')
    }
  }

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>
  if (!workspace) return <div className="text-center text-text-secondary py-12">Workspace não encontrado.</div>

  const isOwner = workspace.ownerId === user?.id

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <Link to="/workspaces" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            ← Workspaces
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-1">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-text-secondary text-sm mt-1">{workspace.description}</p>
          )}
        </div>
        {isOwner && (
          <Button variant="secondary" onClick={() => setAddingMember(!addingMember)}>
            + Adicionar membro
          </Button>
        )}
      </div>

      <p className="text-xs text-text-tertiary mb-6">
        {workspace.memberCount} membro{workspace.memberCount !== 1 ? 's' : ''} · criado por {workspace.ownerName}
      </p>

      {/* Add member form */}
      {addingMember && (
        <form onSubmit={handleAddMember} className="bg-surface border border-border-subtle rounded-2xl p-5 mb-6">
          <h3 className="font-medium text-text-primary mb-3">Adicionar membro</h3>
          {memberError && (
            <p className="text-sm mb-2" style={{ color: '#E83050' }}>{memberError}</p>
          )}
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Selecione um profissional...</option>
                {professionals.map((p) => (
                  <option key={p.userId} value={p.userId}>{p.name}</option>
                ))}
              </Select>
            </div>
            <Button type="submit" variant="primary">Adicionar</Button>
          </div>
        </form>
      )}

      {/* Feed */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Feed do workspace</h2>

      {!feed || feed.content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Nenhum reconhecimento neste workspace ainda.</p>
          <Link to="/recognitions/new">
            <Button variant="primary" className="mt-4">Criar reconhecimento</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {feed.content.map((r) => (
            <div key={r.id} className="bg-surface border-l-4 border-l-purple-500 border border-border-subtle rounded-2xl p-5">
              <p className="text-sm text-text-primary mb-2">
                <Link to={`/profile/${r.recognizer.userId}`} className="font-semibold text-purple-300 hover:text-purple-400">
                  {r.recognizer.name}
                </Link>
                {' reconheceu '}
                <Link to={`/profile/${r.recognized.userId}`} className="font-semibold text-purple-300 hover:text-purple-400">
                  {r.recognized.name}
                </Link>
              </p>
              <Badge variant="category">{r.category.name}</Badge>
              {r.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.skills.map((s) => (
                    <span key={s} className="text-xs bg-overlay text-text-secondary px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-text-secondary italic">"{r.testimonial}"</p>
              <p className="mt-2 text-xs text-text-tertiary">
                {new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
