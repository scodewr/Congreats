import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { profileService } from '../../services/profileService'
import type { PageResult, ProfileView, WorkspaceView } from '../../types'

export default function AdminWorkspacesPage() {
  const [result, setResult] = useState<PageResult<WorkspaceView> | null>(null)
  const [professionals, setProfessionals] = useState<ProfileView[]>([])
  const [loading, setLoading] = useState(true)
  const [managingId, setManagingId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [memberError, setMemberError] = useState('')

  const load = () =>
    Promise.all([
      adminService.listWorkspaces(),
      profileService.search('', 0, 100),
    ]).then(([ws, profs]) => {
      setResult(ws)
      setProfessionals(profs)
    }).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleArchive = async (id: string) => {
    if (!confirm('Arquivar este workspace? Novos reconhecimentos serão bloqueados.')) return
    try {
      await adminService.archiveWorkspace(id)
      load()
    } catch (err: unknown) {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao arquivar.')
    }
  }

  const handleAddMember = async (workspaceId: string) => {
    if (!selectedUserId) return
    setMemberError('')
    try {
      await adminService.addWorkspaceMember(workspaceId, selectedUserId)
      setSelectedUserId('')
      load()
    } catch (err: unknown) {
      setMemberError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao adicionar.')
    }
  }

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Workspaces</h1>

      <div className="flex flex-col gap-4">
        {result?.content.map((ws) => (
          <div key={ws.id} className={`bg-white rounded-xl border p-5 ${ws.archived ? 'border-gray-200 opacity-70' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{ws.name}</p>
                {ws.description && <p className="text-sm text-gray-500 mt-0.5">{ws.description}</p>}
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span>{ws.memberCount} membro{ws.memberCount !== 1 ? 's' : ''}</span>
                  <span>por {ws.ownerName}</span>
                  {ws.archived && <span className="text-amber-600 font-medium">Arquivado</span>}
                </div>
              </div>
              {!ws.archived && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setManagingId(managingId === ws.id ? null : ws.id)}
                    className="text-xs text-primary-600 hover:text-primary-800 font-medium border border-primary-300 px-2 py-1 rounded">
                    Membros
                  </button>
                  <button onClick={() => handleArchive(ws.id)}
                    className="text-xs text-amber-600 hover:text-amber-800 font-medium border border-amber-300 px-2 py-1 rounded">
                    Arquivar
                  </button>
                </div>
              )}
            </div>

            {managingId === ws.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {memberError && <p className="text-sm text-red-600 mb-2">{memberError}</p>}
                <div className="flex gap-2">
                  <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Adicionar membro...</option>
                    {professionals.map((p) => (
                      <option key={p.userId} value={p.userId}>{p.name}</option>
                    ))}
                  </select>
                  <button onClick={() => handleAddMember(ws.id)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                    Adicionar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {result?.total === 0 && (
          <p className="text-center text-gray-500 py-12">Nenhum workspace criado ainda.</p>
        )}
      </div>
    </div>
  )
}
