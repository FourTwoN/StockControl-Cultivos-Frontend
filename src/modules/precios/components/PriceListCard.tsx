import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { format } from 'date-fns'
import { Card } from '@core/components/ui/Card.tsx'
import { Badge } from '@core/components/ui/Badge.tsx'
import type { PriceList } from '../types/Price.ts'

interface PriceListCardProps {
  readonly priceList: PriceList
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy')
  } catch {
    return dateStr
  }
}

export function PriceListCard({ priceList }: PriceListCardProps) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    void navigate(priceList.id)
  }, [navigate, priceList.id])

  const dateRange = priceList.effectiveTo
    ? `${formatDate(priceList.effectiveFrom)} - ${formatDate(priceList.effectiveTo)}`
    : `From ${formatDate(priceList.effectiveFrom)}`

  return (
    <Card onClick={handleClick} className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-primary">{priceList.name}</h3>
        <Badge variant={priceList.isActive ? 'success' : 'outline'}>
          {priceList.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {priceList.description && (
        <p className="line-clamp-2 text-xs text-muted">{priceList.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>{dateRange}</span>
        <span>{priceList.itemCount} items</span>
      </div>
    </Card>
  )
}
