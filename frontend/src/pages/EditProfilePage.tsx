import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { useAuth } from '../contexts/AuthContext'
import type { ProfileProject, ProfileTeam, ProfileView } from '../types'

export default function EditProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ProfileView | null>(null)
  const [bio, setBio] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [projects, setProjects] = useState<ProfileProject[]>([])
  const [teams, setTeams] = useState<ProfileTeam[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    profileService.getMe().then((p) => {
      setProfile(p)
      setBio(p.bio ?? '')
      setJobTitle(p.jobTitle ?? '')
      setCompany(p.company ?? '')
      setProjects(p.projects)
      setTeams(p.teams)
    })
  }, [user])

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      await profileService.uploadPhoto(user.id, file)
      const updated = await profileService.getMe()
      setProfile(updated)
    } catch {
      setError('Erro ao enviar foto.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')
    try {
      await profileService.update(user.id, { bio, jobTitle, company, projects, teams })
      navigate(`/profile/${user.id}`)
    } catch {
      setError('Erro ao salvar perfil.')
    } finally {
      setSaving(false)
    }
  }

  const addProject = () => setProjects([...projects, { name: '', status: 'ACTIVE' }])
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i))
  const updateProject = (i: number, field: keyof ProfileProject, value: string) =>
    setProjects(projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p))

  const addTeam = () => setTeams([...teams, { name: '' }])
  const removeTeam = (i: number) => setTeams(teams.filter((_, idx) => idx !== i))
  const updateTeam = (i: number, field: keyof ProfileTeam, value: string) =>
    setTeams(teams.map((t, idx) => idx === i ? { ...t, [field]: value } : t))

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar perfil</h1>

      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      {/* Photo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Foto de perfil</h2>
        <div className="flex items-center gap-4">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Foto" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:border-primary-400 disabled:opacity-50"
            >
              {uploading ? 'Enviando...' : 'Alterar foto'}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG ou PNG, máx 5MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Informações básicas</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título profissional</label>
            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex: Engenheiro de Software Sênior"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Acme Corp"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sobre</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Fale um pouco sobre você..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Projetos</h2>
            <button type="button" onClick={addProject}
              className="text-sm text-primary-600 hover:underline">+ Adicionar</button>
          </div>
          {projects.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 mb-2 space-y-2">
              <div className="flex gap-2">
                <input value={p.name} onChange={(e) => updateProject(i, 'name', e.target.value)}
                  placeholder="Nome do projeto"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <select value={p.status} onChange={(e) => updateProject(i, 'status', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="ACTIVE">Ativo</option>
                  <option value="PAST">Passado</option>
                </select>
                <button type="button" onClick={() => removeProject(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
              </div>
              <input value={p.description ?? ''} onChange={(e) => updateProject(i, 'description', e.target.value)}
                placeholder="Descrição (opcional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
        </div>

        {/* Teams */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Equipes e Iniciativas</h2>
            <button type="button" onClick={addTeam}
              className="text-sm text-primary-600 hover:underline">+ Adicionar</button>
          </div>
          {teams.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={t.name} onChange={(e) => updateTeam(i, 'name', e.target.value)}
                placeholder="Nome da equipe"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input value={t.role ?? ''} onChange={(e) => updateTeam(i, 'role', e.target.value)}
                placeholder="Papel (opcional)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button type="button" onClick={() => removeTeam(i)}
                className="text-red-400 hover:text-red-600 text-sm px-2">×</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="px-6 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
