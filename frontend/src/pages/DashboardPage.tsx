import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profileService } from '../services/profileService'
import type { ProfileView } from '../types'

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<ProfileView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileService.search('', 0, 20)
      .then(setProfiles)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center text-gray-500 py-12">Carregando profissionais...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
        <Link
          to="/recognitions/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Reconhecer
        </Link>
      </div>

      {profiles.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Nenhum profissional encontrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Link
              key={p.userId}
              to={`/profile/${p.userId}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                  {p.jobTitle && <p className="text-xs text-gray-500 truncate">{p.jobTitle}</p>}
                </div>
              </div>
              {p.topSkills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.topSkills.slice(0, 3).map((s) => (
                    <span key={s.skill} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                      {s.skill}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">{p.totalRecognitions} reconhecimento{p.totalRecognitions !== 1 ? 's' : ''}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
