import { useState, useCallback } from 'react'
import { format, subDays } from 'date-fns'

type SalesPeriod = 'monthly' | 'weekly'

interface DateRange {
  readonly from: string
  readonly to: string
}

interface TrendsDateRange {
  readonly dateRange: DateRange
  readonly salesPeriod: SalesPeriod
  readonly handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readonly handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readonly handlePeriodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function useTrendsDateRange(): TrendsDateRange {
  const [dateRange, setDateRange] = useState<DateRange>(() => ({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  }))

  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>('monthly')

  const handleFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateRange((prev) => ({ ...prev, from: e.target.value }))
    },
    [],
  )

  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateRange((prev) => ({ ...prev, to: e.target.value }))
    },
    [],
  )

  const handlePeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSalesPeriod(e.target.value as SalesPeriod)
    },
    [],
  )

  return {
    dateRange,
    salesPeriod,
    handleFromChange,
    handleToChange,
    handlePeriodChange,
  }
}
