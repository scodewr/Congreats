import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import type { ProfileView } from '../types'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<ProfileView[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    profileService.search('', 0, 20)
      .then(setProfiles)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="text-text-secondary text-xl block mb-1">Bem-vindo ao</span>
          <span className="brand-gradient">Congreats</span>
        </h1>
        <p className="text-text-secondary mt-2">Reconheça os talentos ao seu redor</p>
      </div>

      {/* CTA card */}
      <div className="bg-gradient-to-br from-purple-900 to-purple-700/30 border border-purple-700/50 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-text-primary font-semibold text-lg">Reconheça alguém hoje</p>
          <p className="text-text-secondary text-sm mt-1">Destaque o talento de um colega</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/recognitions/new')}>
          + Reconhecer
        </Button>
      </div>

      {/* Section title */}
      <h2 className="text-xl font-semibold text-text-primary mb-4">Profissionais</h2>

      {loading ? (
        <div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="shimmer rounded-2xl h-32 mb-4" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <p className="text-text-secondary text-center py-12">Nenhum profissional encontrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Link
              key={p.userId}
              to={`/profile/${p.userId}`}
              className="bg-surface border border-border-subtle rounded-2xl p-5 hover:border-purple-700/60 hover:shadow-purple-glow transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={p.name} size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary truncate">{p.name}</p>
                  {p.jobTitle && (
                    <p className="text-xs text-text-secondary truncate">{p.jobTitle}</p>
                  )}
                </div>
              </div>
              {p.topSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {p.topSkills.slice(0, 3).map((s) => (
                    <Badge key={s.skill} variant="category">{s.skill}</Badge>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-text-tertiary">
                {p.totalRecognitions} reconhecimento{p.totalRecognitions !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
