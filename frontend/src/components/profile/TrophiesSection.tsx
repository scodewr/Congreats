import type { TrophyView } from '../../types'

const LEVEL_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  BRONZE: { bg: '#fdf6ec', border: '#d97706', badge: '#92400e' },
  SILVER: { bg: '#f8fafc', border: '#94a3b8', badge: '#475569' },
  GOLD: { bg: '#fffbeb', border: '#f59e0b', badge: '#92400e' },
}

const LEVEL_ICONS: Record<string, string> = {
  BRONZE: '🥉',
  SILVER: '🥈',
  GOLD: '🥇',
}

function groupBySkill(trophies: TrophyView[]): Record<string, TrophyView[]> {
  return trophies.reduce<Record<string, TrophyView[]>>((acc, t) => {
    if (!acc[t.skill]) acc[t.skill] = []
    acc[t.skill].push(t)
    return acc
  }, {})
}

interface Props {
  trophies: TrophyView[]
}

export default function TrophiesSection({ trophies }: Props) {
  if (trophies.length === 0) return null

  const grouped = groupBySkill(trophies)

  return (
    <section>
      <h3 style={{ marginBottom: '0.75rem', fontWeight: 600, fontSize: '1rem' }}>Troféus por Habilidade</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Object.entries(grouped).map(([skill, skillTrophies]) => (
          <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 500, color: '#374151', minWidth: '120px', fontSize: '0.875rem' }}>
              {skill}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {skillTrophies.map((trophy) => {
                const colors = LEVEL_COLORS[trophy.level] ?? LEVEL_COLORS.BRONZE
                return (
                  <div
                    key={trophy.id}
                    title={`${trophy.levelLabel} — conquistado em ${new Date(trophy.awardedAt).toLocaleDateString('pt-BR')}`}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '999px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: colors.badge,
                    }}
                  >
                    {LEVEL_ICONS[trophy.level]}
                    <span>{trophy.levelLabel}</span>
                    {trophy.recent && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-4px',
                          background: '#eab308',
                          color: '#fff',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          padding: '1px 4px',
                          borderRadius: '999px',
                        }}
                      >
                        NOVO
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
