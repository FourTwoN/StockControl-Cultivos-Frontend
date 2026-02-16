import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from '../Modal'

describe('Modal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <p>Modal content</p>,
  }

  it('renders when open is true', () => {
    render(<Modal {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<Modal {...defaultProps} open={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders the title in the header', () => {
    render(<Modal {...defaultProps} title="My Custom Title" />)

    expect(screen.getByText('My Custom Title')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="custom-content">Custom child</div>
      </Modal>,
    )

    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Modal {...defaultProps} description="A helpful description" />)

    expect(screen.getByText('A helpful description')).toBeInTheDocument()
  })

  it('does not render header when no title or description', () => {
    render(<Modal {...defaultProps} title={undefined} />)

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })
})
