export interface PagedResponse<T> {
  readonly content: readonly T[]
  readonly totalElements: number
  readonly totalPages: number
  readonly page: number
  readonly size: number
}

export interface ApiError {
  readonly status: number
  readonly message: string
  readonly details?: Readonly<Record<string, readonly string[]>>
  readonly timestamp: string
}

export interface ApiRequestConfig {
  readonly page?: number
  readonly size?: number
  readonly sort?: string
  readonly filters?: Readonly<Record<string, string>>
}
