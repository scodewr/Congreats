import { useState } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type AvatarBorder = 'default' | 'gold' | 'wine'

interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  border?: AvatarBorder
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm:  'w-6 h-6 text-[10px]',
  md:  'w-9 h-9 text-xs',
  lg:  'w-14 h-14 text-base',
  xl:  'w-20 h-20 text-xl',
  '2xl': 'w-32 h-32 text-3xl',
}

const borderClasses: Record<AvatarBorder, string> = {
  default: 'border-2 border-border-dim',
  gold:    'border-2 border-gold-500',
  wine:    'border-2 border-wine-500',
}

export function Avatar({ name, src, size = 'md', border = 'default', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  const showImage = src && !imgError

  return (
    <div
      className={[
        'rounded-full overflow-hidden flex items-center justify-center shrink-0',
        sizeClasses[size],
        borderClasses[border],
        className,
      ].join(' ')}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="bg-purple-900 text-purple-300 font-semibold w-full h-full flex items-center justify-center select-none">
          {initials}
        </span>
      )}
    </div>
  )
}

export default Avatar
