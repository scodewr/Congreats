import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import type { PageResult, UserAdminView } from '../../types'

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

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          + Novo usuário
        </button>
      </div>

      {createdPassword && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800 font-medium">Usuário criado com sucesso!</p>
          <p className="text-sm text-green-700 mt-1">
            Senha temporária: <code className="font-mono bg-green-100 px-2 py-0.5 rounded">{createdPassword}</code>
          </p>
          <button onClick={() => setCreatedPassword('')} className="text-xs text-green-600 mt-2 underline">Fechar</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Criar usuário</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Nome</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">E-mail</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Perfil</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {result?.content.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                    u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.active && (
                    <button onClick={() => handleDeactivate(u.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium">
                      Desativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {result && result.total === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum usuário encontrado.</p>
        )}
      </div>

      {result && result.hasNext && (
        <div className="mt-4 text-center">
          <button onClick={() => load(result.page + 1)}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium">
            Carregar mais
          </button>
        </div>
      )}
    </div>
  )
}
