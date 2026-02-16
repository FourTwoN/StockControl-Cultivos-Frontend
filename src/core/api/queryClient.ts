import { QueryClient } from '@tanstack/react-query'

const FIVE_MINUTES_MS = 5 * 60 * 1000
const TEN_MINUTES_MS = 10 * 60 * 1000
const DEFAULT_RETRY_COUNT = 2

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES_MS,
      gcTime: TEN_MINUTES_MS,
      retry: DEFAULT_RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
  },
})

export { queryClient }
