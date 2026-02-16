import { useCallback, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@core/components/ui/Select'
import { Button } from '@core/components/ui/Button'
import { SearchInput } from '@core/components/forms/SearchInput'
import type { PackagingType, PackagingMaterial, PackagingColor } from '../types/Packaging.ts'

interface PackagingFilters {
  readonly search: string
  readonly typeId: string
  readonly materialId: string
  readonly colorId: string
}

interface PackagingFilterBarProps {
  readonly filters: PackagingFilters
  readonly onFiltersChange: (filters: PackagingFilters) => void
  readonly types: readonly PackagingType[]
  readonly materials: readonly PackagingMaterial[]
  readonly colors: readonly PackagingColor[]
}

const EMPTY_FILTERS: PackagingFilters = {
  search: '',
  typeId: '',
  materialId: '',
  colorId: '',
}

export type { PackagingFilters }

export function PackagingFilterBar({
  filters,
  onFiltersChange,
  types,
  materials,
  colors,
}: PackagingFilterBarProps) {
  const typesArray = Array.isArray(types) ? types : []
  const materialsArray = Array.isArray(materials) ? materials : []
  const colorsArray = Array.isArray(colors) ? colors : []

  const typeOptions = useMemo(
    () => typesArray.map((t) => ({ value: t.id, label: t.name })),
    [typesArray],
  )

  const materialOptions = useMemo(
    () => materialsArray.map((m) => ({ value: m.id, label: m.name })),
    [materialsArray],
  )

  const colorOptions = useMemo(
    () => colorsArray.map((c) => ({ value: c.id, label: c.name })),
    [colorsArray],
  )

  const handleSearchChange = useCallback(
    (search: string) => {
      onFiltersChange({ ...filters, search })
    },
    [filters, onFiltersChange],
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, typeId: value })
    },
    [filters, onFiltersChange],
  )

  const handleMaterialChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, materialId: value })
    },
    [filters, onFiltersChange],
  )

  const handleColorChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, colorId: value })
    },
    [filters, onFiltersChange],
  )

  const handleReset = useCallback(() => {
    onFiltersChange(EMPTY_FILTERS)
  }, [onFiltersChange])

  const hasActiveFilters =
    filters.search !== '' ||
    filters.typeId !== '' ||
    filters.materialId !== '' ||
    filters.colorId !== ''

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex-1 sm:max-w-xs">
        <SearchInput
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by name or SKU..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4">
        <Select value={filters.typeId || undefined} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.materialId || undefined} onValueChange={handleMaterialChange}>
          <SelectTrigger>
            <SelectValue placeholder="All materials" />
          </SelectTrigger>
          <SelectContent>
            {materialOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.colorId || undefined} onValueChange={handleColorChange}>
          <SelectTrigger>
            <SelectValue placeholder="All colors" />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
