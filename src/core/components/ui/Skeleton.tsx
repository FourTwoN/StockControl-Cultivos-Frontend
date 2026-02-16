interface SkeletonProps {
  readonly className?: string
  readonly variant?: 'line' | 'circle' | 'rectangle'
}

const variantClasses: Record<NonNullable<SkeletonProps['variant']>, string> = {
  line: 'h-4 w-full rounded',
  circle: 'h-10 w-10 rounded-full',
  rectangle: 'h-24 w-full rounded-lg',
}

export function Skeleton({ className, variant = 'line' }: SkeletonProps) {
  return (
    <div
      className={['shimmer rounded', variantClasses[variant], className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  )
}
