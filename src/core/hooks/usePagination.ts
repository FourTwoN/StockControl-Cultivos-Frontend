import { useState, useCallback, useMemo } from 'react'

interface PaginationState {
  readonly page: number
  readonly size: number
  readonly totalPages: number
  readonly totalElements: number
}

interface PaginationActions {
  readonly setPage: (page: number) => void
  readonly nextPage: () => void
  readonly prevPage: () => void
  readonly setSize: (size: number) => void
  readonly setTotal: (totalPages: number, totalElements: number) => void
}

export function usePagination(initialSize = 20): PaginationState & PaginationActions {
  const [page, setPageState] = useState(0)
  const [size, setSizeState] = useState(initialSize)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const setPage = useCallback((p: number) => setPageState(Math.max(0, p)), [])
  const nextPage = useCallback(
    () => setPageState((prev) => Math.min(prev + 1, totalPages - 1)),
    [totalPages],
  )
  const prevPage = useCallback(() => setPageState((prev) => Math.max(prev - 1, 0)), [])
  const setSize = useCallback((s: number) => {
    setSizeState(s)
    setPageState(0)
  }, [])
  const setTotal = useCallback((tp: number, te: number) => {
    setTotalPages(tp)
    setTotalElements(te)
  }, [])

  return useMemo(
    () => ({
      page,
      size,
      totalPages,
      totalElements,
      setPage,
      nextPage,
      prevPage,
      setSize,
      setTotal,
    }),
    [page, size, totalPages, totalElements, setPage, nextPage, prevPage, setSize, setTotal],
  )
}
