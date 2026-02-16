import { useQuery } from '@tanstack/react-query'
import { familyService } from '../services/categoryService.ts'

export function useFamilies() {
  return useQuery({
    queryKey: ['families'],
    queryFn: familyService.fetchFamilies,
  })
}
