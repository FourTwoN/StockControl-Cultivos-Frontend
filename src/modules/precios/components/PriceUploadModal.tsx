import { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Modal } from '@core/components/ui/Modal.tsx'
import { Button } from '@core/components/ui/Button.tsx'
import { FileUpload } from '@core/components/forms/FileUpload.tsx'
import type { CsvPreviewRow } from '../types/Price.ts'

interface PriceUploadModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onConfirm: (file: File) => void
  readonly isUploading?: boolean
}

type UploadStep = 'upload' | 'preview' | 'confirm'

function parseCsvContent(content: string): readonly CsvPreviewRow[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  // Skip header row
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((c) => c.trim())
    const errors: string[] = []

    const productSku = cells[0] ?? ''
    const unitPrice = parseFloat(cells[1] ?? '')
    const minQuantity = parseInt(cells[2] ?? '', 10)
    const maxQuantityRaw = cells[3] ?? ''
    const discountRaw = cells[4] ?? ''

    if (!productSku) errors.push('Missing SKU')
    if (isNaN(unitPrice) || unitPrice < 0) errors.push('Invalid unit price')
    if (isNaN(minQuantity) || minQuantity < 1) errors.push('Invalid min quantity')

    const maxQuantity = maxQuantityRaw ? parseInt(maxQuantityRaw, 10) : undefined
    if (maxQuantityRaw && (isNaN(maxQuantity!) || maxQuantity! < 1)) {
      errors.push('Invalid max quantity')
    }

    const discount = discountRaw ? parseFloat(discountRaw) : undefined
    if (discountRaw && (isNaN(discount!) || discount! < 0 || discount! > 100)) {
      errors.push('Invalid discount')
    }

    return {
      productSku,
      unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
      minQuantity: isNaN(minQuantity) ? 0 : minQuantity,
      ...(maxQuantity !== undefined ? { maxQuantity } : {}),
      ...(discount !== undefined ? { discount } : {}),
      isValid: errors.length === 0,
      errors,
    }
  })
}

export function PriceUploadModal({
  isOpen,
  onClose,
  onConfirm,
  isUploading = false,
}: PriceUploadModalProps) {
  const [step, setStep] = useState<UploadStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewRows, setPreviewRows] = useState<readonly CsvPreviewRow[]>([])

  const handleFileSelected = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (typeof content === 'string') {
        const rows = parseCsvContent(content)
        setPreviewRows(rows)
        setStep('preview')
      }
    }
    reader.readAsText(file)
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedFile) return
    onConfirm(selectedFile)
  }, [selectedFile, onConfirm])

  const handleClose = useCallback(() => {
    setStep('upload')
    setSelectedFile(null)
    setPreviewRows([])
    onClose()
  }, [onClose])

  const invalidCount = useMemo(
    () => previewRows.filter((row) => !row.isValid).length,
    [previewRows],
  )

  return (
    <Modal open={isOpen} onClose={handleClose} title="Upload Price CSV" size="lg">
      {step === 'upload' && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Upload a CSV file with columns: SKU, Unit Price, Min Quantity, Max Quantity (optional),
            Discount % (optional)
          </p>
          <FileUpload accept=".csv" onUpload={handleFileSelected} />
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-primary">
              {previewRows.length} rows found
              {invalidCount > 0 && (
                <span className="ml-2 text-destructive">({invalidCount} with errors)</span>
              )}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>
              Change file
            </Button>
          </div>

          <div className="max-h-64 overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">SKU</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Unit Price</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Min Qty</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Max Qty</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Discount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => (
                  <tr
                    key={`${row.productSku}-${index}`}
                    className={cn(
                      'border-b border-border last:border-b-0',
                      !row.isValid && 'bg-destructive/5',
                    )}
                  >
                    <td className="px-3 py-2 text-primary">{row.productSku}</td>
                    <td className="px-3 py-2 text-primary">{row.unitPrice}</td>
                    <td className="px-3 py-2 text-primary">{row.minQuantity}</td>
                    <td className="px-3 py-2 text-primary">{row.maxQuantity ?? '-'}</td>
                    <td className="px-3 py-2 text-primary">
                      {row.discount !== undefined ? `${row.discount}%` : '-'}
                    </td>
                    <td className="px-3 py-2">
                      {row.isValid ? (
                        <span className="text-xs text-success">Valid</span>
                      ) : (
                        <span className="text-xs text-destructive" title={row.errors.join(', ')}>
                          {row.errors.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              isLoading={isUploading}
              disabled={previewRows.length === 0}
            >
              Upload {previewRows.filter((r) => r.isValid).length} valid rows
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
