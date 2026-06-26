import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import type { PageResult, UserAdminView } from '../../types'
import Button from '../../components/ui/Button'

export default function AdminUsersPage() {
  const [result, setResult] = useState<PageResult<UserAdminView> | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER')
  const [error, setError] = useState('')
  const [createdPassword, setCreatedPassword] = useState('')

  const load = (page = 0) =>
    adminService.listUsers(page).then(setResult).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      const res = await adminService.createUser({ name, email, role })
      setCreatedPassword(res.temporaryPassword)
      setName(''); setEmail(''); setRole('USER'); setShowForm(false)
      load()
    } catch {
      setError('Erro ao criar usuário.')
    } finally {
      setCreating(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    if (!confirm('Desativar este usuário?')) return
    try {
      await adminService.deactivateUser(id)
      load()
    } catch (err: unknown) {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Erro ao desativar.')
    }
  }

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Usuários</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          + Novo usuário
        </Button>
      </div>

      {createdPassword && (
        <div className="border rounded-xl p-4 mb-6" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)' }}>
          <p className="text-sm font-medium" style={{ color: 'rgb(134,239,172)' }}>Usuário criado com sucesso!</p>
          <p className="text-sm mt-1" style={{ color: 'rgb(134,239,172)' }}>
            Senha temporária: <code className="font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.15)' }}>{createdPassword}</code>
          </p>
          <button onClick={() => setCreatedPassword('')} className="text-xs mt-2 underline" style={{ color: 'rgb(134,239,172)' }}>Fechar</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-2xl border border-border-subtle p-6 mb-6 space-y-3">
          <h2 className="font-semibold text-text-primary">Criar usuário</h2>
          {error && (
            <p className="text-sm px-3 py-2 rounded" style={{ color: 'rgb(232,48,80)', background: 'rgba(232,48,80,0.1)' }}>{error}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Nome *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">E-mail *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Perfil</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}
                className="w-full bg-elevated border border-border-dim rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
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

      <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-elevated border-b border-border-subtle">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">E-mail</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Perfil</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {result?.content.map((u) => (
              <tr key={u.id} className="border-b border-border-subtle last:border-0 hover:bg-overlay">
                <td className="px-4 py-3 text-sm font-medium text-text-primary">{u.name}</td>
                <td className="px-4 py-3 text-sm text-text-tertiary">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === 'ADMIN'
                      ? 'text-purple-300 bg-purple-500/15'
                      : 'text-text-tertiary bg-overlay'}`}>
                    {u.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                    u.active
                      ? 'text-success bg-success/10'
                      : 'text-error bg-error/10'}`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.active && (
                    <Button variant="destructive" size="sm" onClick={() => handleDeactivate(u.id)}>
                      Desativar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {result && result.total === 0 && (
          <p className="text-text-secondary text-center py-8">Nenhum usuário encontrado.</p>
        )}
      </div>

      {result && result.hasNext && (
        <div className="mt-4 text-center">
          <button onClick={() => load(result.page + 1)}
            className="text-sm text-purple-300 hover:text-purple-200 font-medium">
            Carregar mais
          </button>
        </div>
      )}
    </div>
  )
}
