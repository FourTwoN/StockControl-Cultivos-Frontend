import { useRef, useEffect, useCallback } from 'react'

interface UseAutoScrollOptions {
  readonly dependency: unknown
  readonly threshold?: number
}

interface UseAutoScrollReturn {
  readonly containerRef: React.RefObject<HTMLDivElement | null>
  readonly endRef: React.RefObject<HTMLDivElement | null>
  readonly scrollToBottom: () => void
}

export function useAutoScroll({
  dependency,
  threshold = 100,
}: UseAutoScrollOptions): UseAutoScrollReturn {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const shouldAutoScrollRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleScroll() {
      if (!container) return
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      shouldAutoScrollRef.current = distanceFromBottom <= threshold
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom()
    }
  }, [dependency, scrollToBottom])

  return { containerRef, endRef, scrollToBottom }
}
