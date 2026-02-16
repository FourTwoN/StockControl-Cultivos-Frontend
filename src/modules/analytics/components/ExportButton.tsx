import { useCallback } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@core/components/ui'
import { downloadCSV } from '../utils/csvExport.ts'

interface ExportButtonProps {
  readonly data: readonly Record<string, unknown>[]
  readonly filename: string
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = useCallback(() => {
    downloadCSV(data, filename)
  }, [data, filename])

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={data.length === 0}>
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  )
}
