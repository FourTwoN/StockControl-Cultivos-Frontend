import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService.ts'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.fetchCategories,
  })
}
