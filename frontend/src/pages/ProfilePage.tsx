import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { recognitionService } from '../services/recognitionService'
import { useAuth } from '../contexts/AuthContext'
import type { PageResult, ProfileView, RecognitionView } from '../types'

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { user: me } = useAuth()
  const [profile, setProfile] = useState<ProfileView | null>(null)
  const [recognitions, setRecognitions] = useState<PageResult<RecognitionView> | null>(null)
  const [loading, setLoading] = useState(true)

  const isOwner = me?.id === userId

  useEffect(() => {
    if (!userId) return
    Promise.all([
      profileService.getById(userId),
      recognitionService.listByProfessional(userId),
    ])
      .then(([p, r]) => { setProfile(p); setRecognitions(r) })
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div className="text-center text-gray-500 py-12">Carregando perfil...</div>
  if (!profile) return <div className="text-center text-gray-500 py-12">Perfil não encontrado.</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-700">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              {profile.jobTitle && <p className="text-gray-600">{profile.jobTitle}</p>}
              {profile.company && <p className="text-sm text-gray-400">{profile.company}</p>}
            </div>
          </div>
          {isOwner && (
            <Link to="/profile/edit"
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:border-primary-400">
              Editar perfil
            </Link>
          )}
        </div>

        {profile.bio && <p className="mt-4 text-gray-600 text-sm leading-relaxed">{profile.bio}</p>}

        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <span><strong className="text-gray-900">{profile.totalRecognitions}</strong> reconhecimentos</span>
        </div>
      </div>

      {/* Top Skills */}
      {profile.topSkills.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Principais habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {profile.topSkills.map((s) => (
              <span key={s.skill}
                className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full">
                {s.skill}
                <span className="text-xs bg-primary-200 text-primary-800 rounded-full px-1.5 py-0.5">{s.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Projetos</h2>
          <div className="space-y-3">
            {profile.projects.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${p.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams */}
      {profile.teams.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Equipes e Iniciativas</h2>
          <div className="space-y-2">
            {profile.teams.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">{t.name}</span>
                {t.role && <span className="text-gray-400">· {t.role}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recognitions */}
      {recognitions && recognitions.content.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Reconhecimentos</h2>
          <div className="space-y-4">
            {recognitions.content.map((r) => (
              <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-1">
                  <Link to={`/profile/${r.recognizer.userId}`}
                    className="text-sm font-medium text-primary-600 hover:underline">
                    {r.recognizer.name}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {r.skills.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{r.category.name}</span>
                </div>
                <p className="text-sm text-gray-600 italic">"{r.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
