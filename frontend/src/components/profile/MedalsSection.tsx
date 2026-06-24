import type { MedalView } from '../../types'

const MILESTONE_ICONS: Record<string, string> = {
  FIRST: '🥇',
  FIFTH: '⭐',
  TENTH: '🌟',
  TWENTY_FIFTH: '💎',
  FIFTIETH: '🏆',
  HUNDREDTH: '👑',
}

interface Props {
  medals: MedalView[]
}

export default function MedalsSection({ medals }: Props) {
  if (medals.length === 0) return null

  return (
    <section>
      <h3 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '1rem' }}>Medalhas</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {medals.map((medal) => (
          <div
            key={medal.id}
            title={new Date(medal.awardedAt).toLocaleDateString('pt-BR')}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: medal.recent ? '#fef9c3' : '#f9fafb',
              border: `1px solid ${medal.recent ? '#fde047' : '#e5e7eb'}`,
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            {medal.recent && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#eab308',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '999px',
                }}
              >
                NOVO
              </span>
            )}
            <span style={{ fontSize: '1.75rem' }}>{MILESTONE_ICONS[medal.milestone] ?? '🏅'}</span>
            <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 500 }}>{medal.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
