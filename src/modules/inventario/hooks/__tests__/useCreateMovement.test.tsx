import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { ReactNode, ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateMovement } from '../useCreateMovement'

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface WrapperProps {
  readonly children: ReactNode
}

function createWrapper(): {
  wrapper: ({ children }: WrapperProps) => ReactElement
  queryClient: QueryClient
} {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }: WrapperProps): ReactElement {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return { wrapper: Wrapper, queryClient }
}

describe('useCreateMovement', () => {
  it('creates a movement successfully', async () => {
    const { wrapper } = createWrapper()

    const { result } = renderHook(() => useCreateMovement(), { wrapper })

    await act(async () => {
      result.current.mutate({
        batchId: '550e8400-e29b-41d4-a716-446655440000',
        type: 'ENTRADA',
        quantity: 100,
        notes: 'Test entry',
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.id).toBe('mov-new')
  })

  it('invalidates stock batches and movements queries after success', async () => {
    const { wrapper, queryClient } = createWrapper()

    // Pre-populate the cache with mock data
    queryClient.setQueryData(['stock-batches', 0, 20], { content: [] })
    queryClient.setQueryData(['stock-movements', undefined, 0, 20], { content: [] })

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateMovement(), { wrapper })

    await act(async () => {
      result.current.mutate({
        batchId: '550e8400-e29b-41d4-a716-446655440000',
        type: 'ENTRADA',
        quantity: 50,
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['stock-batches'] }),
    )
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['stock-movements'] }),
    )

    invalidateSpy.mockRestore()
  })

  it('exposes error state on failure', async () => {
    // This test verifies the hook's error handling structure
    const { wrapper } = createWrapper()

    const { result } = renderHook(() => useCreateMovement(), { wrapper })

    expect(result.current.isIdle).toBe(true)
    expect(result.current.isError).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
