import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { profileService } from '../../services/profileService'
import type { PageResult, ProfileView, WorkspaceView } from '../../types'
import Button from '../../components/ui/Button'

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

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Workspaces</h1>

      <div className="flex flex-col gap-4">
        {result?.content.map((ws) => (
          <div key={ws.id} className={`bg-surface rounded-2xl border border-border-subtle p-5 ${ws.archived ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-text-primary">{ws.name}</p>
                {ws.description && <p className="text-sm text-text-tertiary mt-0.5">{ws.description}</p>}
                <div className="flex gap-3 mt-2 text-xs text-text-tertiary">
                  <span>{ws.memberCount} membro{ws.memberCount !== 1 ? 's' : ''}</span>
                  <span>por {ws.ownerName}</span>
                  {ws.archived && <span className="font-medium" style={{ color: 'rgb(251,191,36)' }}>Arquivado</span>}
                </div>
              </div>
              {!ws.archived && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setManagingId(managingId === ws.id ? null : ws.id)}
                  >
                    Membros
                  </Button>
                  <button
                    onClick={() => handleArchive(ws.id)}
                    className="text-xs font-medium border px-2 py-1 rounded-xl transition-colors"
                    style={{ color: 'rgb(251,191,36)', borderColor: 'rgba(251,191,36,0.4)' }}
                  >
                    Arquivar
                  </button>
                </div>
              )}
            </div>

            {managingId === ws.id && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                {memberError && <p className="text-sm mb-2" style={{ color: 'rgb(232,48,80)' }}>{memberError}</p>}
                <div className="flex gap-2">
                  <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
                    className="flex-1 bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                    <option value="">Adicionar membro...</option>
                    {professionals.map((p) => (
                      <option key={p.userId} value={p.userId}>{p.name}</option>
                    ))}
                  </select>
                  <Button variant="primary" size="sm" onClick={() => handleAddMember(ws.id)}>
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {result?.total === 0 && (
          <p className="text-text-secondary text-center py-12">Nenhum workspace criado ainda.</p>
        )}
      </div>
    </div>
  )
}
