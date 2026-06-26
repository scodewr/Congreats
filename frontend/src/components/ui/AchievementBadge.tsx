import { motion } from 'framer-motion'

const GOLD_GRADIENT = 'radial-gradient(circle at 30% 30%, #E8C56A, #C9A84C, #7A5C10)'
const GOLD_BORDER = '2px solid rgba(245, 226, 154, 0.4)'
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

// ── MedalBadge ──────────────────────────────────────────────────────────────

interface MedalBadgeProps {
  label?: string
  size?: 'md' | 'lg'
  className?: string
}

function MedalBadge({ label, size = 'md', className = '' }: MedalBadgeProps) {
  const px = size === 'lg' ? 80 : 64

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`inline-flex items-center justify-center rounded-full shadow-gold-glow animate-gold-pulse ${className}`}
      style={{
        width: px,
        height: px,
        background: GOLD_GRADIENT,
        border: GOLD_BORDER,
      }}
    >
      {label && (
        <span className="font-bold text-text-inverse select-none">{label}</span>
      )}
    </motion.div>
  )
}

// ── TrophyBadge ─────────────────────────────────────────────────────────────

interface TrophyBadgeProps {
  label?: string
  name?: string
  size?: 'md' | 'lg'
  className?: string
}

function TrophyBadge({ label, name, size = 'md', className = '' }: TrophyBadgeProps) {
  const px = size === 'lg' ? 80 : 64

  return (
    <div className="inline-flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`inline-flex items-center justify-center shadow-gold-glow animate-gold-pulse ${className}`}
        style={{
          width: px,
          height: px,
          background: GOLD_GRADIENT,
          border: GOLD_BORDER,
          clipPath: HEX_CLIP,
        }}
      >
        {label && (
          <span className="font-bold text-text-inverse select-none">{label}</span>
        )}
      </motion.div>
      {name && (
        <span className="text-gold-300 text-xs text-center mt-1">{name}</span>
      )}
    </div>
  )
}

// ── RankingBadge ─────────────────────────────────────────────────────────────

interface RankingBadgeProps {
  position: number
}

function RankingBadge({ position }: RankingBadgeProps) {
  let className = 'inline-flex items-center justify-center rounded-full font-bold text-sm'
  let style: React.CSSProperties = { width: 32, height: 32 }

  if (position === 1) {
    className += ' bg-gold-500 text-text-inverse'
  } else if (position === 2) {
    className += ' text-text-inverse'
    style.backgroundColor = '#A8A8B0'
  } else if (position === 3) {
    className += ' text-text-inverse'
    style.backgroundColor = '#C07830'
  } else {
    className += ' bg-overlay text-text-secondary'
  }

  return (
    <div className={className} style={style}>
      {position}
    </div>
  )
}

// ── Exports ──────────────────────────────────────────────────────────────────

export { MedalBadge, TrophyBadge, RankingBadge }
