import { useEffect, useRef } from 'react'
import { useSpring, motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WidgetContainer } from './WidgetContainer.tsx'
import type { ReactNode } from 'react'

type ValueFormat = 'number' | 'currency' | 'percent'

interface KPIWidgetTrend {
  readonly value: number
  readonly direction: 'up' | 'down'
}

interface KPIWidgetProps {
  readonly label: string
  readonly value: number
  readonly format?: ValueFormat
  readonly trend?: KPIWidgetTrend
  readonly icon?: ReactNode
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

function formatDisplayValue(value: number, format: ValueFormat): string {
  switch (format) {
    case 'currency':
      return currencyFormatter.format(value)
    case 'percent':
      return `${numberFormatter.format(value)}%`
    case 'number':
    default:
      return numberFormatter.format(value)
  }
}

function AnimatedNumber({
  value,
  format = 'number',
}: {
  readonly value: number
  readonly format: ValueFormat
}) {
  const springValue = useSpring(0, { stiffness: 80, damping: 20 })
  const displayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    springValue.set(value)

    const unsubscribe = springValue.on('change', (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = formatDisplayValue(latest, format)
      }
    })

    return unsubscribe
  }, [value, format, springValue])

  return (
    <motion.span
      ref={displayRef}
      className="text-2xl font-bold text-primary"
    >
      {formatDisplayValue(0, format)}
    </motion.span>
  )
}

export function KPIWidget({
  label,
  value,
  format = 'number',
  trend,
  icon,
}: KPIWidgetProps) {
  return (
    <WidgetContainer title={label}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="text-muted">{icon}</span>
          ) : null}
          <AnimatedNumber value={value} format={format} />
        </div>
        {trend ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                trend.direction === 'up'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {numberFormatter.format(Math.abs(trend.value))}%
            </span>
            <span className="text-xs text-muted">vs previous</span>
          </div>
        ) : null}
      </div>
    </WidgetContainer>
  )
}
