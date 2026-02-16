import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.page).toBe(0)
    expect(result.current.size).toBe(20)
    expect(result.current.totalPages).toBe(0)
    expect(result.current.totalElements).toBe(0)
  })

  it('accepts a custom initial size', () => {
    const { result } = renderHook(() => usePagination(50))

    expect(result.current.size).toBe(50)
  })

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setTotal(5, 100)
    })

    act(() => {
      result.current.nextPage()
    })

    expect(result.current.page).toBe(1)
  })

  it('navigates to previous page', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setTotal(5, 100)
    })

    act(() => {
      result.current.setPage(3)
    })

    act(() => {
      result.current.prevPage()
    })

    expect(result.current.page).toBe(2)
  })

  it('does not go below page 0 with prevPage', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.prevPage()
    })

    expect(result.current.page).toBe(0)
  })

  it('does not go below page 0 with setPage', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setPage(-5)
    })

    expect(result.current.page).toBe(0)
  })

  it('does not exceed totalPages with nextPage', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setTotal(3, 60)
    })

    act(() => {
      result.current.setPage(2)
    })

    act(() => {
      result.current.nextPage()
    })

    // totalPages is 3, so max page index is 2
    expect(result.current.page).toBe(2)
  })

  it('resets page to 0 when setSize is called', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setTotal(5, 100)
    })

    act(() => {
      result.current.setPage(3)
    })

    expect(result.current.page).toBe(3)

    act(() => {
      result.current.setSize(50)
    })

    expect(result.current.page).toBe(0)
    expect(result.current.size).toBe(50)
  })

  it('updates totalPages and totalElements with setTotal', () => {
    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setTotal(10, 200)
    })

    expect(result.current.totalPages).toBe(10)
    expect(result.current.totalElements).toBe(200)
  })
})
