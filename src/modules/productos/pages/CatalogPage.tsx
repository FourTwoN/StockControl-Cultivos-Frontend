import { useState, useCallback, useMemo } from 'react'
import { List } from 'lucide-react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { AnimatedList, AnimatedListItem } from '@core/components/motion/AnimatedList'
import { Button } from '@core/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@core/components/ui/Select'
import { Skeleton } from '@core/components/ui/Skeleton'
import { Badge } from '@core/components/ui/Badge'
import { EmptyState } from '@core/components/ui/EmptyState'
import { CategoryTree } from '../components/CategoryTree.tsx'
import { FamilyGrid } from '../components/FamilyGrid.tsx'
import { useCategories } from '../hooks/useCategories.ts'
import { useFamilies } from '../hooks/useFamilies.ts'
import { useProducts } from '../hooks/useProducts.ts'
import type { Category, ProductFamily } from '../types/Product.ts'

interface FiltersState {
  readonly categoryId?: string
  readonly familyId?: string
}

function flattenCategories(categories: readonly Category[]): readonly Category[] {
  const result: Category[] = []
  for (const cat of categories) {
    result.push(cat)
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children))
    }
  }
  return result
}

export function CatalogPage() {
  const [filters, setFilters] = useState<FiltersState>({})
  const [page] = useState(0)

  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: families, isLoading: familiesLoading } = useFamilies()
  const { data: productsData, isLoading: productsLoading } = useProducts(page, 50, undefined)

  const handleCategorySelect = useCallback((category: Category) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === category.id ? undefined : category.id,
    }))
  }, [])

  const handleFamilySelect = useCallback((family: ProductFamily) => {
    setFilters((prev) => ({
      ...prev,
      familyId: prev.familyId === family.id ? undefined : family.id,
    }))
  }, [])

  const handleMobileCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: value || undefined,
    }))
  }, [])

  const categoryOptions = useMemo(() => {
    if (!categories) return []
    return flattenCategories(categories).map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [categories])

  const filteredProducts = useMemo(() => {
    const products = productsData?.content ?? []
    return products.filter((product) => {
      if (filters.categoryId && product.categoryId !== filters.categoryId) {
        return false
      }
      if (filters.familyId && product.familyId !== filters.familyId) {
        return false
      }
      return true
    })
  }, [productsData?.content, filters.categoryId, filters.familyId])

  const filteredFamilies = useMemo(() => {
    if (!families) return []
    if (!filters.categoryId) return families
    const productFamilyIds = new Set(
      (productsData?.content ?? [])
        .filter((p) => p.categoryId === filters.categoryId)
        .map((p) => p.familyId),
    )
    return families.filter((f) => productFamilyIds.has(f.id))
  }, [families, filters.categoryId, productsData?.content])

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Product Catalog</h1>
        <p className="mt-1 text-sm text-muted">Browse products by category and family</p>
      </div>

      {/* Mobile: category dropdown */}
      <div className="mb-4 md:hidden">
        <Select value={filters.categoryId ?? ''} onValueChange={handleMobileCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar: CategoryTree */}
        <aside className="hidden w-1/4 flex-shrink-0 md:block">
          <div className="sticky top-4 rounded-lg border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-primary">Categories</h2>
            </div>
            <CategoryTree
              categories={categories ?? []}
              selectedId={filters.categoryId}
              onSelect={handleCategorySelect}
              isLoading={categoriesLoading}
            />
          </div>
        </aside>

        {/* Right content: families + products */}
        <main className="min-w-0 flex-1">
          {/* Family grid section */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">Families</h2>
              {filters.familyId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, familyId: undefined }))}
                >
                  Clear family filter
                </Button>
              )}
            </div>
            <FamilyGrid
              families={filteredFamilies}
              selectedId={filters.familyId}
              onSelect={handleFamilySelect}
              isLoading={familiesLoading}
            />
          </section>

          {/* Product list section */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Products
                <span className="ml-2 text-sm font-normal text-muted">
                  ({filteredProducts.length})
                </span>
              </h2>
              {(filters.categoryId || filters.familyId) && (
                <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
                  Clear all filters
                </Button>
              )}
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" variant="rectangle" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={<List className="h-8 w-8" />}
                title="No products found"
                description="Try adjusting your category or family filters."
              />
            ) : (
              <AnimatedList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <AnimatedListItem key={product.id}>
                  <div
                    className="hover-lift rounded-lg border border-border bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-primary">
                          {product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted">SKU: {product.sku}</p>
                      </div>
                      <Badge
                        variant={
                          product.state === 'healthy'
                            ? 'success'
                            : product.state === 'dormant'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {product.state}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">{product.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline">{product.categoryName}</Badge>
                      <Badge variant="outline">{product.familyName}</Badge>
                    </div>
                  </div>
                  </AnimatedListItem>
                ))}
              </AnimatedList>
            )}
          </section>
        </main>
      </div>
    </AnimatedPage>
  )
}
