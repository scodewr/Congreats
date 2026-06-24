import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { workspaceService } from '../services/workspaceService'
import { profileService } from '../services/profileService'
import { useAuth } from '../contexts/AuthContext'
import type { PageResult, ProfileView, RecognitionView, WorkspaceView } from '../types'

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
      // refresh workspace info
      workspaceService.listMine().then((wss) => setWorkspace(wss.find((ws) => ws.id === id) ?? null))
    } catch {
      setMemberError('Erro ao adicionar membro.')
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>
  if (!workspace) return <div className="text-center text-gray-500 py-12">Workspace não encontrado.</div>

  const isOwner = workspace.ownerId === user?.id

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <Link to="/workspaces" className="text-sm text-gray-400 hover:text-gray-600">← Workspaces</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{workspace.name}</h1>
          {workspace.description && <p className="text-gray-500 text-sm mt-1">{workspace.description}</p>}
        </div>
        {isOwner && (
          <button
            onClick={() => setAddingMember(!addingMember)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex-shrink-0"
          >
            + Adicionar membro
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-6">
        {workspace.memberCount} membro{workspace.memberCount !== 1 ? 's' : ''} · criado por {workspace.ownerName}
      </p>

      {addingMember && (
        <form onSubmit={handleAddMember} className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Adicionar membro</h3>
          {memberError && <p className="text-sm text-red-600 mb-2">{memberError}</p>}
          <div className="flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecione um profissional...</option>
              {professionals.map((p) => (
                <option key={p.userId} value={p.userId}>{p.name}</option>
              ))}
            </select>
            <button type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
              Adicionar
            </button>
          </div>
        </form>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Feed do workspace</h2>

      {!feed || feed.content.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>Nenhum reconhecimento neste workspace ainda.</p>
          <Link to="/recognitions/new"
            className="mt-3 inline-block bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
            Criar reconhecimento
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {feed.content.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-700">
                <Link to={`/profile/${r.recognizer.userId}`} className="font-semibold hover:text-primary-600">
                  {r.recognizer.name}
                </Link>
                {' reconheceu '}
                <Link to={`/profile/${r.recognized.userId}`} className="font-semibold hover:text-primary-600">
                  {r.recognized.name}
                </Link>
              </p>
              <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                {r.category.name}
              </span>
              {r.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.skills.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600 italic">"{r.testimonial}"</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
