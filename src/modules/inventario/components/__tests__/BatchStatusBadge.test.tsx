import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BatchStatusBadge } from '../BatchStatusBadge'
import type { BatchStatus } from '@core/types/enums'

describe('BatchStatusBadge', () => {
  it('renders "Active" text for ACTIVE status', () => {
    render(<BatchStatusBadge status="ACTIVE" />)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders "Depleted" text for DEPLETED status', () => {
    render(<BatchStatusBadge status="DEPLETED" />)

    expect(screen.getByText('Depleted')).toBeInTheDocument()
  })

  it('renders "Quarantine" text for QUARANTINE status', () => {
    render(<BatchStatusBadge status="QUARANTINE" />)

    expect(screen.getByText('Quarantine')).toBeInTheDocument()
  })

  it('renders "Archived" text for ARCHIVED status', () => {
    render(<BatchStatusBadge status="ARCHIVED" />)

    expect(screen.getByText('Archived')).toBeInTheDocument()
  })

  it('applies success variant classes for ACTIVE status', () => {
    render(<BatchStatusBadge status="ACTIVE" />)

    const badge = screen.getByText('Active')
    expect(badge.className).toContain('bg-success')
  })

  it('applies outline variant classes for DEPLETED status', () => {
    render(<BatchStatusBadge status="DEPLETED" />)

    const badge = screen.getByText('Depleted')
    expect(badge.className).toContain('border')
  })

  it('applies warning variant classes for QUARANTINE status', () => {
    render(<BatchStatusBadge status="QUARANTINE" />)

    const badge = screen.getByText('Quarantine')
    expect(badge.className).toContain('bg-warning')
  })

  it('applies default variant classes for ARCHIVED status', () => {
    render(<BatchStatusBadge status="ARCHIVED" />)

    const badge = screen.getByText('Archived')
    expect(badge.className).toContain('bg-primary')
  })

  it('renders all statuses without errors', () => {
    const statuses: readonly BatchStatus[] = ['ACTIVE', 'DEPLETED', 'QUARANTINE', 'ARCHIVED']

    for (const status of statuses) {
      const { unmount } = render(<BatchStatusBadge status={status} />)
      expect(screen.getByText(/.+/)).toBeInTheDocument()
      unmount()
    }
  })
})
