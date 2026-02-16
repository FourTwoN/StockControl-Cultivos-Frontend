import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders with primary variant classes by default', () => {
    render(<Button>Primary</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('gradient-primary')
    expect(button.className).toContain('text-white')
  })

  it('renders with secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-secondary')
  })

  it('renders with outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('border')
    expect(button.className).toContain('bg-transparent')
  })

  it('renders with ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-transparent')
  })

  it('renders with destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-destructive')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button').className).toContain('h-8')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button').className).toContain('h-10')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button').className).toContain('h-12')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner when isLoading is true', () => {
    render(<Button isLoading>Saving</Button>)

    const button = screen.getByRole('button')
    const spinner = button.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('does not show spinner when isLoading is false', () => {
    render(<Button>Not Loading</Button>)

    const button = screen.getByRole('button')
    const spinner = button.querySelector('.animate-spin')
    expect(spinner).not.toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)

    expect(screen.getByRole('button').className).toContain('custom-class')
  })

  it('has type="button" by default', () => {
    render(<Button>Default type</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
