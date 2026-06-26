import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoveryService } from '../services/discoveryService'
import { adminService } from '../services/adminService'
import type { CampaignView, PageResult, ProfileView, RecognitionView } from '../types'
import TabNav from '../components/ui/TabNav'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { RankingBadge } from '../components/ui/AchievementBadge'

export default function DiscoveryPage() {
  const [feed, setFeed] = useState<PageResult<RecognitionView> | null>(null)
  const [ranking, setRanking] = useState<PageResult<ProfileView> | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignView[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminService.getActiveCampaigns().then(setCampaigns).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      discoveryService.getFeed(0, 20),
      discoveryService.getRanking(0, 20),
    ])
      .then(([f, r]) => { setFeed(f); setRanking(r) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Descobrir</h1>

      {campaigns.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/50 to-wine-900/30 border border-purple-700/40 rounded-2xl p-5 mb-6">
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2">Campanha ativa</p>
          {campaigns.map(c => (
            <div key={c.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">{c.name}</p>
                {c.description && <p className="text-sm text-text-secondary mt-0.5">{c.description}</p>}
                <p className="text-xs text-text-tertiary mt-1">
                  {c.categoryName} · até {new Date(c.endsAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Link to="/recognitions/new">
                <Button variant="primary" size="sm">Reconhecer</Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <TabNav
        defaultTab="feed"
        tabs={[
          { id: 'feed', label: 'Feed', content: <FeedTab feed={feed} loading={loading} /> },
          { id: 'ranking', label: 'Ranking', content: <RankingTab ranking={ranking} loading={loading} /> },
        ]}
      />
    </div>
  )
}

function FeedTab({ feed, loading }: { feed: PageResult<RecognitionView> | null; loading: boolean }) {
  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="shimmer rounded-2xl h-32" />
      ))}
    </div>
  )
  if (!feed || feed.content.length === 0) {
    return <p className="text-text-secondary text-center py-12">Nenhum reconhecimento ainda.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {feed.content.map(r => (
        <div key={r.id} className="bg-surface border-l-4 border-l-purple-500 border border-border-subtle rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Avatar name={r.recognizer.name} src={r.recognizer.photoUrl} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                <Link to={`/profile/${r.recognizer.userId}`} className="font-semibold text-purple-300 hover:text-purple-400">
                  {r.recognizer.name}
                </Link>
                {' reconheceu '}
                <Link to={`/profile/${r.recognized.userId}`} className="font-semibold text-purple-300 hover:text-purple-400">
                  {r.recognized.name}
                </Link>
              </p>
              <Badge variant="category" className="mt-1">{r.category.name}</Badge>
              {r.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.skills.map(s => (
                    <span key={s} className="text-xs bg-overlay text-text-secondary px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-text-secondary italic">"{r.testimonial}"</p>
              <p className="mt-1 text-xs text-text-tertiary">
                {new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RankingTab({ ranking, loading }: { ranking: PageResult<ProfileView> | null; loading: boolean }) {
  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="shimmer rounded-2xl h-16" />
      ))}
    </div>
  )
  if (!ranking || ranking.content.length === 0) {
    return <p className="text-text-secondary text-center py-12">Ainda não há dados de ranking.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {ranking.content.map((p, index) => (
        <Link
          key={p.userId}
          to={`/profile/${p.userId}`}
          className="bg-surface border border-border-subtle rounded-2xl p-4 hover:border-purple-700/50 hover:shadow-purple-glow transition-all flex items-center gap-4"
        >
          <RankingBadge position={index + 1} />
          <Avatar name={p.name} src={p.photoUrl} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary truncate">{p.name}</p>
            {p.jobTitle && <p className="text-xs text-text-secondary truncate">{p.jobTitle}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-purple-300">{p.totalRecognitions}</p>
            <p className="text-xs text-text-tertiary">reconhecimentos</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
