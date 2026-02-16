import { useState, useCallback, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, ShoppingCart } from 'lucide-react'
import { FormField } from '@core/components/forms/FormField'
import { SearchInput } from '@core/components/forms/SearchInput'
import { Button } from '@core/components/ui/Button'
import { Card } from '@core/components/ui/Card'
import { EmptyState } from '@core/components/ui/EmptyState'
import { saleSchema } from '../types/schemas.ts'
import type { SaleFormData } from '../types/schemas.ts'
import { useProducts } from '@modules/productos/hooks/useProducts.ts'

interface SaleFormProps {
  readonly onSubmit: (data: SaleFormData) => void
  readonly isSubmitting?: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

function calculateSubtotal(quantity: number, unitPrice: number, discount: number): number {
  const discountMultiplier = 1 - discount / 100
  return quantity * unitPrice * discountMultiplier
}

export function SaleForm({ onSubmit, isSubmitting = false }: SaleFormProps) {
  const [productSearch, setProductSearch] = useState('')
  const { data: productsData } = useProducts(0, 10, productSearch)

  const { control, handleSubmit, watch, setValue } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      items: [],
      customerName: '',
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = watch('items')

  const totalAmount = useMemo(
    () =>
      watchedItems.reduce(
        (sum, item) => sum + calculateSubtotal(item.quantity, item.unitPrice, item.discount),
        0,
      ),
    [watchedItems],
  )

  const handleAddProduct = useCallback(
    (product: { id: string; name: string; sku: string }) => {
      const existingIndex = watchedItems.findIndex((item) => item.productId === product.id)

      if (existingIndex >= 0) {
        const existing = watchedItems[existingIndex]
        setValue(`items.${existingIndex}.quantity`, existing.quantity + 1)
      } else {
        append({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: 1,
          unitPrice: 0,
          discount: 0,
        })
      }
      setProductSearch('')
    },
    [watchedItems, append, setValue],
  )

  const handleSearchChange = useCallback((value: string) => {
    setProductSearch(value)
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-primary">Add Products</h3>
        <div className="relative">
          <SearchInput
            value={productSearch}
            onChange={handleSearchChange}
            placeholder="Search products to add..."
          />
          {productSearch.length > 0 && productsData?.content && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-surface shadow-lg">
              {productsData.content.length === 0 ? (
                <div className="p-3 text-sm text-muted">No products found</div>
              ) : (
                <ul className="max-h-48 overflow-y-auto py-1">
                  {productsData.content.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/10"
                        onClick={() =>
                          handleAddProduct({
                            id: product.id,
                            name: product.name,
                            sku: product.sku,
                          })
                        }
                      >
                        <span className="font-medium text-primary">{product.name}</span>
                        <span className="text-xs text-muted">{product.sku}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-primary">Sale Items</h3>
        {fields.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-8 w-8" />}
            title="No items"
            description="No items added yet. Search for products above."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="hidden grid-cols-12 gap-2 text-xs font-medium uppercase text-muted sm:grid">
              <div className="col-span-3">Product</div>
              <div className="col-span-2">SKU</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-1">Disc. %</div>
              <div className="col-span-1 text-right">Subtotal</div>
              <div className="col-span-1" />
            </div>
            {fields.map((field, index) => {
              const item = watchedItems[index]
              const subtotal = item
                ? calculateSubtotal(item.quantity, item.unitPrice, item.discount)
                : 0

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-12 sm:items-center sm:border-0 sm:p-0"
                >
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-xs text-muted sm:hidden">Product: </span>
                    <span className="text-sm font-medium text-primary">{field.productName}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-xs text-muted sm:hidden">SKU: </span>
                    <span className="text-sm text-muted">{field.productSku}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField<SaleFormData>
                      name={`items.${index}.quantity`}
                      control={control}
                      label="Qty"
                      type="number"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FormField<SaleFormData>
                      name={`items.${index}.unitPrice`}
                      control={control}
                      label="Price"
                      type="number"
                      placeholder="Price"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <FormField<SaleFormData>
                      name={`items.${index}.discount`}
                      control={control}
                      label="%"
                      type="number"
                      placeholder="%"
                    />
                  </div>
                  <div className="flex items-center justify-end sm:col-span-1">
                    <span className="text-sm font-medium text-primary">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end sm:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      aria-label={`Remove ${field.productName}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              )
            })}

            <div className="flex items-center justify-end border-t border-border pt-4">
              <div className="text-right">
                <span className="text-sm text-muted">Total: </span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-primary">Additional Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField<SaleFormData>
            name="customerName"
            control={control}
            label="Customer Name"
            placeholder="Optional customer name"
          />
          <FormField<SaleFormData>
            name="notes"
            control={control}
            label="Notes"
            type="textarea"
            placeholder="Optional notes"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={fields.length === 0}>
          <Plus className="h-4 w-4" />
          Create Sale
        </Button>
      </div>
    </form>
  )
}
