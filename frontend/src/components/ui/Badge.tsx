import React from 'react'

type BadgeVariant =
  | 'category'
  | 'admin'
  | 'achievement'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const BASE =
  'rounded-full px-3 py-1 text-xs font-medium border inline-flex items-center gap-1'

// Variants using Tailwind palette classes (multi-shade palettes support opacity modifiers)
const TAILWIND_VARIANTS: Partial<Record<BadgeVariant, string>> = {
  category:    'bg-purple-900 text-purple-300 border-purple-700/30',
  admin:       'bg-wine-900   text-wine-300   border-wine-700/30',
  achievement: 'bg-gold-900   text-gold-400   border-gold-700/50',
}

// Variants using inline styles (flat hex colors don't support Tailwind opacity modifiers)
const STYLE_VARIANTS: Partial<Record<BadgeVariant, React.CSSProperties>> = {
  success: {
    backgroundColor: 'rgba(46,175,106,0.1)',
    color: '#2EAF6A',
    borderColor: 'rgba(46,175,106,0.3)',
  },
  warning: {
    backgroundColor: 'rgba(232,160,32,0.1)',
    color: '#E8A020',
    borderColor: 'rgba(232,160,32,0.3)',
  },
  error: {
    backgroundColor: 'rgba(232,48,80,0.1)',
    color: '#E83050',
    borderColor: 'rgba(232,48,80,0.3)',
  },
  info: {
    backgroundColor: 'rgba(48,152,232,0.1)',
    color: '#3098E8',
    borderColor: 'rgba(48,152,232,0.3)',
  },
}

export function Badge({ variant, children, className }: BadgeProps) {
  const tailwindClasses = TAILWIND_VARIANTS[variant]
  const inlineStyle = STYLE_VARIANTS[variant]

  return (
    <span
      className={[BASE, tailwindClasses ?? '', className ?? ''].filter(Boolean).join(' ')}
      style={inlineStyle}
    >
      {children}
    </span>
  )
}

export default Badge
