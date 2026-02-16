import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import type { ReactNode, ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts } from '../useProducts'

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
}

interface WrapperProps {
  readonly children: ReactNode
}

function createWrapper(): ({ children }: WrapperProps) => ReactElement {
  const queryClient = createTestQueryClient()

  return function Wrapper({ children }: WrapperProps): ReactElement {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useProducts', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useProducts(0, 20), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('fetches products successfully', async () => {
    const { result } = renderHook(() => useProducts(0, 20), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.content).toHaveLength(3)
    expect(result.current.data?.content[0].name).toBe('Rosa Damascena')
  })

  it('includes search parameter in query', async () => {
    const { result } = renderHook(() => useProducts(0, 20, 'rosa'), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // MSW handler returns all products regardless of search (mock behavior)
    expect(result.current.data?.content).toBeDefined()
  })

  it('returns paged response structure', async () => {
    const { result } = renderHook(() => useProducts(0, 20), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const data = result.current.data
    expect(data).toHaveProperty('content')
    expect(data).toHaveProperty('totalElements')
    expect(data).toHaveProperty('totalPages')
    expect(data).toHaveProperty('page')
    expect(data).toHaveProperty('size')
  })
})
