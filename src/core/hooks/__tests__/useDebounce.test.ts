import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))

    expect(result.current).toBe('hello')
  })

  it('does not update the debounced value before the delay', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'hello', delay: 500 },
    })

    rerender({ value: 'world', delay: 500 })

    // Advance time by less than the delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('hello')

    vi.useRealTimers()
  })

  it('updates the debounced value after the delay', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'hello', delay: 500 },
    })

    rerender({ value: 'world', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('world')

    vi.useRealTimers()
  })

  it('cleans up the timer on unmount', () => {
    vi.useFakeTimers()
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { unmount, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'hello', delay: 500 },
    })

    rerender({ value: 'world', delay: 500 })
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
    vi.useRealTimers()
  })

  it('resets the timer when value changes rapidly', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 300 },
    })

    rerender({ value: 'ab', delay: 300 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'abc', delay: 300 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Still within debounce period of last change
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Now 300ms after last change
    expect(result.current).toBe('abc')

    vi.useRealTimers()
  })
})
