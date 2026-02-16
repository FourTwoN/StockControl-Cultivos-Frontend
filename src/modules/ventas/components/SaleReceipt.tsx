import { forwardRef } from 'react'
import { format } from 'date-fns'
import type { Sale } from '../types/Sale.ts'

interface SaleReceiptProps {
  readonly sale: Sale
}

const DEFAULT_CURRENCY = 'ARS'

function formatCurrency(amount: number, currency: string | null | undefined): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency || DEFAULT_CURRENCY,
  }).format(amount)
}

export const SaleReceipt = forwardRef<HTMLDivElement, SaleReceiptProps>(function SaleReceipt(
  { sale },
  ref,
) {
  return (
    <div
      ref={ref}
      className="mx-auto max-w-2xl bg-white p-8 text-black print:m-0 print:max-w-none print:p-4 print:shadow-none"
    >
      <style>{`
          @media print {
            body * { visibility: hidden; }
            .sale-receipt, .sale-receipt * { visibility: visible; }
            .sale-receipt { position: absolute; left: 0; top: 0; width: 100%; }
            @page { margin: 1cm; }
          }
        `}</style>

      <div className="sale-receipt">
        <div className="mb-6 border-b border-gray-300 pb-4 text-center">
          <h1 className="text-2xl font-bold">Sale Receipt</h1>
          <p className="mt-1 text-sm text-gray-500">#{sale.saleNumber}</p>
        </div>

        <div className="mb-6 flex justify-between text-sm">
          <div>
            {sale.customerName && (
              <p>
                <span className="font-medium">Customer:</span> {sale.customerName}
              </p>
            )}
            <p>
              <span className="font-medium">Date:</span>{' '}
              {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-medium">Sale #:</span> {sale.saleNumber}
            </p>
            <p>
              <span className="font-medium">Created by:</span> {sale.createdBy}
            </p>
          </div>
        </div>

        <table className="mb-6 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left font-medium">Product</th>
              <th className="py-2 text-left font-medium">SKU</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Disc.</th>
              <th className="py-2 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">{item.productName}</td>
                <td className="py-2 text-gray-500">{item.productSku}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.unitPrice, sale.currency)}</td>
                <td className="py-2 text-right">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(item.subtotal, sale.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-6 flex justify-end border-t border-gray-300 pt-4">
          <div className="text-right">
            <span className="text-lg font-medium">Total: </span>
            <span className="text-2xl font-bold">
              {formatCurrency(sale.totalAmount, sale.currency)}
            </span>
          </div>
        </div>

        {sale.notes && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Notes:</span> {sale.notes}
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Thank you for your purchase</p>
        </div>
      </div>
    </div>
  )
})
