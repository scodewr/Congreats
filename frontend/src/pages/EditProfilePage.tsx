import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { useAuth } from '../contexts/AuthContext'
import type { ProfileProject, ProfileTeam, ProfileView } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Avatar from '../components/ui/Avatar'

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

  const addProject    = () => setProjects([...projects, { name: '', status: 'ACTIVE' }])
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i))
  const updateProject = (i: number, field: keyof ProfileProject, value: string) =>
    setProjects(projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p))

  const addTeam    = () => setTeams([...teams, { name: '' }])
  const removeTeam = (i: number) => setTeams(teams.filter((_, idx) => idx !== i))
  const updateTeam = (i: number, field: keyof ProfileTeam, value: string) =>
    setTeams(teams.map((t, idx) => idx === i ? { ...t, [field]: value } : t))

  const inputBase = 'w-full bg-elevated border border-border-dim rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-tertiary outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all duration-200'
  const selectBase = `${inputBase} appearance-none cursor-pointer`

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Editar perfil</h1>

      {error && (
        <div className="mb-4 text-sm px-4 py-3 rounded-xl border" style={{ backgroundColor: 'rgba(232,48,80,0.1)', color: '#E83050', borderColor: 'rgba(232,48,80,0.2)' }}>
          {error}
        </div>
      )}

      {/* Photo */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-6 mb-4">
        <h2 className="font-semibold text-text-primary mb-3">Foto de perfil</h2>
        <div className="flex items-center gap-4">
          <Avatar src={profile?.photoUrl} name={user?.name ?? ''} size="lg" />
          <div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              isLoading={uploading}
            >
              Alterar foto
            </Button>
            <p className="text-xs text-text-tertiary mt-1">JPG ou PNG, máx 5MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Basic info */}
        <div className="bg-surface border border-border-subtle rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-text-primary">Informações básicas</h2>
          <Input
            label="Título profissional"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Ex: Engenheiro de Software Sênior"
          />
          <Input
            label="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ex: Acme Corp"
          />
          <Textarea
            label="Sobre"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Fale um pouco sobre você..."
          />
        </div>

        {/* Projects */}
        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Projetos</h2>
            <button type="button" onClick={addProject} className="text-sm text-purple-300 hover:text-purple-400 transition-colors">
              + Adicionar
            </button>
          </div>
          {projects.map((p, i) => (
            <div key={i} className="bg-elevated border border-border-dim rounded-xl p-3 mb-2 space-y-2">
              <div className="flex gap-2">
                <input
                  value={p.name}
                  onChange={(e) => updateProject(i, 'name', e.target.value)}
                  placeholder="Nome do projeto"
                  className={`flex-1 ${inputBase}`}
                />
                <select
                  value={p.status}
                  onChange={(e) => updateProject(i, 'status', e.target.value)}
                  className={selectBase}
                  style={{ width: 'auto', paddingRight: '2rem' }}
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="PAST">Passado</option>
                </select>
                <button type="button" onClick={() => removeProject(i)}
                  className="text-text-tertiary hover:text-error transition-colors text-sm px-2">
                  ×
                </button>
              </div>
              <input
                value={p.description ?? ''}
                onChange={(e) => updateProject(i, 'description', e.target.value)}
                placeholder="Descrição (opcional)"
                className={inputBase}
              />
            </div>
          ))}
        </div>

        {/* Teams */}
        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Equipes e Iniciativas</h2>
            <button type="button" onClick={addTeam} className="text-sm text-purple-300 hover:text-purple-400 transition-colors">
              + Adicionar
            </button>
          </div>
          {teams.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={t.name}
                onChange={(e) => updateTeam(i, 'name', e.target.value)}
                placeholder="Nome da equipe"
                className={`flex-1 ${inputBase}`}
              />
              <input
                value={t.role ?? ''}
                onChange={(e) => updateTeam(i, 'role', e.target.value)}
                placeholder="Papel (opcional)"
                className={`flex-1 ${inputBase}`}
              />
              <button type="button" onClick={() => removeTeam(i)}
                className="text-text-tertiary hover:text-error transition-colors text-sm px-2">
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" isLoading={saving} className="flex-1">
            Salvar perfil
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
