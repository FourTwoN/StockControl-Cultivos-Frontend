import { useState, useRef, useCallback, useEffect } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'

interface ImageCompareProps {
  readonly originalUrl: string
  readonly processedUrl: string
}

const INITIAL_POSITION = 50
const MIN_POSITION = 0
const MAX_POSITION = 100

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function ImageCompare({ originalUrl, processedUrl }: ImageCompareProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [isDragging, setIsDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const calculatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = (x / rect.width) * 100
    setPosition(clamp(percent, MIN_POSITION, MAX_POSITION))
  }, [])

  const handleMouseDown = useCallback((e: ReactMouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleTouchStart = useCallback((e: ReactTouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    function handleMouseMove(e: globalThis.MouseEvent) {
      calculatePosition(e.clientX)
    }

    function handleTouchMove(e: globalThis.TouchEvent) {
      const touch = e.touches[0]
      if (touch) {
        calculatePosition(touch.clientX)
      }
    }

    function handleEnd() {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, calculatePosition])

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-lg border border-border"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuemin={MIN_POSITION}
      aria-valuemax={MAX_POSITION}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
    >
      {/* Processed image (background) */}
      <img src={processedUrl} alt="Processed" className="block w-full" draggable={false} />

      {/* Original image (clipped overlay) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={originalUrl}
          alt="Original"
          className="block w-full"
          style={{ width: `${containerWidth}px` }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        {/* Drag handle */}
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-md">
          <svg
            className="h-5 w-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 4l-6 8 6 8M16 4l6 8-6 8" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="pointer-events-none absolute left-3 top-3">
        <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
          Original
        </span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3">
        <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
          Processed
        </span>
      </div>
    </div>
  )
}
