import { useState, useRef, useEffect } from 'react'

interface Detection {
  label: string
  confidence: number
  boundingBox: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
}

interface DetectionOverlayProps {
  readonly imageUrl: string
  readonly detections: Detection[]
  readonly showLabels?: boolean
  readonly showConfidence?: boolean
}

/**
 * Component that displays an image with detection bounding boxes overlaid.
 */
export function DetectionOverlay({
  imageUrl,
  detections,
  showLabels = true,
  showConfidence = true,
}: DetectionOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Track natural image size
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = imageUrl
  }, [imageUrl])

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Calculate scale factor
  const scaleX = containerSize.width / imageSize.width || 1
  const scaleY = containerSize.height / imageSize.height || 1
  const scale = Math.min(scaleX, scaleY)

  // Generate color based on label
  const getColor = (label: string): string => {
    const colors: Record<string, string> = {
      item: '#22c55e', // green
      plant: '#22c55e',
      cajon: '#3b82f6', // blue
      'claro-cajon': '#8b5cf6', // purple
      default: '#f59e0b', // amber
    }
    return colors[label.toLowerCase()] || colors.default
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg bg-black">
      <img
        src={imageUrl}
        alt="Analyzed"
        className="h-auto w-full"
        style={{ display: 'block' }}
      />

      {/* Detection boxes */}
      <svg
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {detections.map((detection, index) => {
          const { x1, y1, x2, y2 } = detection.boundingBox
          const width = x2 - x1
          const height = y2 - y1
          const color = getColor(detection.label)

          return (
            <g key={index}>
              {/* Bounding box */}
              <rect
                x={x1}
                y={y1}
                width={width}
                height={height}
                fill="none"
                stroke={color}
                strokeWidth={Math.max(2, 4 / scale)}
                strokeOpacity={0.8}
              />

              {/* Label background */}
              {showLabels && (
                <>
                  <rect
                    x={x1}
                    y={y1 - 24 / scale}
                    width={
                      showConfidence
                        ? Math.max(80, detection.label.length * 8 + 50) / scale
                        : Math.max(40, detection.label.length * 8) / scale
                    }
                    height={22 / scale}
                    fill={color}
                    fillOpacity={0.9}
                    rx={4 / scale}
                  />
                  <text
                    x={x1 + 6 / scale}
                    y={y1 - 8 / scale}
                    fill="white"
                    fontSize={14 / scale}
                    fontWeight="500"
                    fontFamily="system-ui, sans-serif"
                  >
                    {detection.label}
                    {showConfidence && ` ${Math.round(detection.confidence * 100)}%`}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* Detection count badge */}
      <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
        {detections.length} detections
      </div>
    </div>
  )
}
