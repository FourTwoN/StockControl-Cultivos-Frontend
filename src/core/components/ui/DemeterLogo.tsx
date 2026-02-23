import { cn } from '@/lib/utils'

type LogoSize = 'sm' | 'md' | 'lg'

interface DemeterLogoProps {
  size?: LogoSize
  showText?: boolean
  collapsed?: boolean
  className?: string
}

const sizeConfig = {
  sm: { icon: 32, title: 16, subtitle: 11 },
  md: { icon: 40, title: 16, subtitle: 14 },
  lg: { icon: 48, title: 20, subtitle: 14 },
} as const

export function DemeterLogo({
  size = 'md',
  showText = true,
  collapsed = false,
  className,
}: DemeterLogoProps) {
  const config = sizeConfig[size]
  const hideText = collapsed || !showText

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full bg-primary"
        style={{ width: config.icon, height: config.icon }}
      >
        <span
          className="select-none"
          style={{ fontSize: config.icon * 0.5 }}
          role="img"
          aria-label="Demeter logo"
        >
          🌱
        </span>
      </div>

      <div
        className={cn(
          'flex flex-col justify-center overflow-hidden transition-all duration-150',
          hideText ? 'w-0 opacity-0' : 'w-auto opacity-100'
        )}
      >
        <span
          className="font-semibold whitespace-nowrap"
          style={{
            fontSize: config.title,
            color: 'var(--demeter-text-primary)',
          }}
        >
          DemeterIA
        </span>
        <span
          className="whitespace-nowrap"
          style={{
            fontSize: config.subtitle,
            color: 'var(--demeter-text-soft)',
          }}
        >
          Panel Admin
        </span>
      </div>
    </div>
  )
}
