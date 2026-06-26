import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { recognitionService } from '../services/recognitionService'
import { useAuth } from '../contexts/AuthContext'
import type { AchievementsView, MedalView, PageResult, ProfileView, RecognitionView, TrophyView } from '../types'
import { MedalBadge, TrophyBadge } from '../components/ui/AchievementBadge'
import TabNav from '../components/ui/TabNav'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

// ── Tab content components ────────────────────────────────────────────────────

function RecognitionsTab({ recognitions }: { recognitions: PageResult<RecognitionView> | null }) {
  if (!recognitions || recognitions.content.length === 0) {
    return <p className="text-text-secondary text-center py-8">Nenhum reconhecimento ainda.</p>
  }

  return (
    <div>
      {recognitions.content.map((r) => (
        <div
          key={r.id}
          className="bg-surface border-l-4 border-l-purple-500 border border-border-subtle rounded-2xl p-5 mb-3"
        >
          <div className="flex items-start justify-between mb-2">
            <Link
              to={`/profile/${r.recognizer.userId}`}
              className="text-sm font-medium text-purple-300 hover:text-purple-400"
            >
              {r.recognizer.name}
            </Link>
            <span className="text-xs text-text-tertiary">
              {new Date(r.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <Badge variant="category">{r.category.name}</Badge>
          {r.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {r.skills.map((s) => (
                <span key={s} className="text-xs bg-overlay text-text-secondary px-2 py-0.5 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-text-secondary mt-2 italic">"{r.testimonial}"</p>
        </div>
      ))}
    </div>
  )
}

function SkillsTab({ skills }: { skills: ProfileView['topSkills'] }) {
  if (skills.length === 0) {
    return <p className="text-text-secondary text-center py-8">Nenhuma habilidade reconhecida ainda.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s.skill}
          className="flex items-center gap-2 bg-purple-900 border border-purple-700/50 text-purple-300 px-3 py-1.5 rounded-full text-sm"
        >
          {s.skill}
          <span className="bg-purple-700 text-purple-200 text-xs px-1.5 py-0.5 rounded-full">{s.count}</span>
        </span>
      ))}
    </div>
  )
}

function MedalsTab({ medals }: { medals: MedalView[] }) {
  if (medals.length === 0) {
    return (
      <p className="text-text-secondary text-center py-8">
        Nenhuma medalha ainda. Continue sendo reconhecido!
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {medals.map((m) => (
        <div key={m.id} className="flex flex-col items-center gap-2">
          <MedalBadge label={m.milestone.charAt(0)} size="lg" />
          <p className="text-gold-300 text-xs text-center">{m.label}</p>
        </div>
      ))}
    </div>
  )
}

function TrophiesTab({ trophies }: { trophies: TrophyView[] }) {
  if (trophies.length === 0) {
    return (
      <p className="text-text-secondary text-center py-8">
        Nenhum troféu ainda. Continue recebendo reconhecimentos!
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {trophies.map((t) => (
        <TrophyBadge
          key={t.id}
          label={t.level.charAt(0)}
          name={`${t.skill} — ${t.levelLabel}`}
          size="lg"
        />
      ))}
    </div>
  )
}

// ── ProfilePage ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { user: me } = useAuth()
  const [profile, setProfile] = useState<ProfileView | null>(null)
  const [recognitions, setRecognitions] = useState<PageResult<RecognitionView> | null>(null)
  const [achievements, setAchievements] = useState<AchievementsView | null>(null)
  const [loading, setLoading] = useState(true)

  const isOwner = me?.id === userId

  useEffect(() => {
    if (!userId) return
    Promise.all([
      profileService.getById(userId),
      recognitionService.listByProfessional(userId),
      profileService.getAchievements(userId),
    ])
      .then(([p, r, a]) => { setProfile(p); setRecognitions(r); setAchievements(a) })
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div className="text-center text-text-secondary py-12">Carregando perfil...</div>
  if (!profile) return <div className="text-center text-text-secondary py-12">Perfil não encontrado.</div>

  return (
    <div className="space-y-6">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-br from-purple-900/60 via-purple-900/30 to-wine-900/40 border border-purple-700/30 rounded-2xl p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar
            src={profile.photoUrl}
            name={profile.name}
            size="xl"
            border={achievements?.trophies.length ? 'gold' : 'default'}
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-text-primary">{profile.name}</h1>
            {profile.jobTitle && <p className="text-text-secondary mt-1">{profile.jobTitle}</p>}
            {profile.company && <p className="text-text-tertiary text-sm">{profile.company}</p>}
            {profile.bio && (
              <p className="text-text-secondary text-sm mt-3 leading-relaxed">{profile.bio}</p>
            )}
          </div>
          {isOwner && (
            <Link to="/profile/edit">
              <Button variant="secondary" size="sm">Editar Perfil</Button>
            </Link>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 mt-6 pt-6 border-t border-purple-700/30">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-300">{profile.totalRecognitions}</p>
            <p className="text-xs text-text-secondary">Reconhecimentos</p>
          </div>
          <div className="w-px bg-border-subtle" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gold-400">{achievements?.medals.length ?? 0}</p>
            <p className="text-xs text-text-secondary">Medalhas</p>
          </div>
          <div className="w-px bg-border-subtle" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gold-400">{achievements?.trophies.length ?? 0}</p>
            <p className="text-xs text-text-secondary">Troféus</p>
          </div>
        </div>
      </div>

      {/* TabNav com 4 tabs */}
      <TabNav
        defaultTab="recognitions"
        tabs={[
          {
            id: 'recognitions',
            label: 'Reconhecimentos',
            content: <RecognitionsTab recognitions={recognitions} />,
          },
          {
            id: 'skills',
            label: 'Habilidades',
            content: <SkillsTab skills={profile.topSkills} />,
          },
          {
            id: 'medals',
            label: 'Medalhas',
            content: <MedalsTab medals={achievements?.medals ?? []} />,
          },
          {
            id: 'trophies',
            label: 'Troféus',
            content: <TrophiesTab trophies={achievements?.trophies ?? []} />,
          },
        ]}
      />
    </div>
  )
}
