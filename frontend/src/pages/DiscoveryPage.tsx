import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoveryService } from '../services/discoveryService'
import { adminService } from '../services/adminService'
import type { CampaignView, PageResult, ProfileView, RecognitionView } from '../types'

type Tab = 'feed' | 'ranking'

export default function DiscoveryPage() {
  const [tab, setTab] = useState<Tab>('feed')
  const [feed, setFeed] = useState<PageResult<RecognitionView> | null>(null)
  const [ranking, setRanking] = useState<PageResult<ProfileView> | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignView[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminService.getActiveCampaigns().then(setCampaigns).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    if (tab === 'feed') {
      discoveryService.getFeed(0, 20)
        .then(setFeed)
        .finally(() => setLoading(false))
    } else {
      discoveryService.getRanking(0, 20)
        .then(setRanking)
        .finally(() => setLoading(false))
    }
  }, [tab])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Descobrir</h1>
      </div>

      {campaigns.length > 0 && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-4">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Campanha ativa</p>
          {campaigns.map((c) => (
            <div key={c.id} className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-primary-800">{c.name}</p>
                {c.description && <p className="text-sm text-primary-700 mt-0.5">{c.description}</p>}
                <p className="text-xs text-primary-600 mt-1">
                  Categoria: {c.categoryName} · até {new Date(c.endsAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Link to="/recognitions/new"
                className="flex-shrink-0 bg-primary-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-primary-700">
                Reconhecer
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <TabButton active={tab === 'feed'} onClick={() => setTab('feed')}>Feed</TabButton>
        <TabButton active={tab === 'ranking'} onClick={() => setTab('ranking')}>Ranking</TabButton>
      </div>

      {loading && (
        <div className="text-center text-gray-500 py-12">Carregando...</div>
      )}

      {!loading && tab === 'feed' && <FeedList feed={feed} />}
      {!loading && tab === 'ranking' && <RankingList ranking={ranking} />}
    </div>
  )
}

function TabButton({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

function FeedList({ feed }: { feed: PageResult<RecognitionView> | null }) {
  if (!feed || feed.content.length === 0) {
    return <p className="text-gray-500 text-center py-12">Nenhum reconhecimento ainda.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {feed.content.map((r) => (
        <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start gap-3">
            <Avatar name={r.recognizer.name} photoUrl={r.recognizer.photoUrl} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                <Link to={`/profile/${r.recognizer.userId}`} className="font-semibold hover:text-primary-600">
                  {r.recognizer.name}
                </Link>
                {' reconheceu '}
                <Link to={`/profile/${r.recognized.userId}`} className="font-semibold hover:text-primary-600">
                  {r.recognized.name}
                </Link>
              </p>
              <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                {r.category.name}
              </span>
              {r.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.skills.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600 italic">"{r.testimonial}"</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RankingList({ ranking }: { ranking: PageResult<ProfileView> | null }) {
  if (!ranking || ranking.content.length === 0) {
    return <p className="text-gray-500 text-center py-12">Ainda não há dados de ranking.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {ranking.content.map((p, index) => (
        <Link
          key={p.userId}
          to={`/profile/${p.userId}`}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-4"
        >
          <span className="w-8 text-center text-lg font-bold text-gray-400 flex-shrink-0">
            {index + 1}
          </span>
          <Avatar name={p.name} photoUrl={p.photoUrl} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{p.name}</p>
            {p.jobTitle && <p className="text-xs text-gray-500 truncate">{p.jobTitle}</p>}
            {p.topSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {p.topSkills.slice(0, 3).map((s) => (
                  <span key={s.skill} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                    {s.skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-primary-600">{p.totalRecognitions}</p>
            <p className="text-xs text-gray-400">reconhecimentos</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
  }
  return (
    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
