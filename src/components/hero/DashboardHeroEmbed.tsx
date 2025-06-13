import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHeroEmbed } from '../DashboardHeroEmbed'
import { BrowserRouter } from 'react-router-dom'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className }: any) => (
      <div onClick={onClick} className={className}>
        {children}
      </div>
    ),
  },
}))

// Mock the CustomizableDashboard component
vi.mock('../webapp/CustomizableDashboard', () => ({
  CustomizableDashboard: () => <div data-testid="dashboard">Mock Dashboard</div>,
}))

describe('DashboardHeroEmbed', () => {
  const mockNavigate = vi.fn()

  // Mock useNavigate hook
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom') as any
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <DashboardHeroEmbed />
      </BrowserRouter>
    )
    expect(screen.getByText('Loading Dashboard...')).toBeInTheDocument()
  })

  it('navigates to dashboard page when clicked without onClick prop', async () => {
    render(
      <BrowserRouter>
        <DashboardHeroEmbed />
      </BrowserRouter>
    )
    
    const container = screen.getByText('Click to explore →').parentElement?.parentElement
    expect(container).toBeInTheDocument()
    
    if (container) {
      fireEvent.click(container)
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    }
  })

  it('calls provided onClick when provided', () => {
    const mockOnClick = vi.fn()
    render(
      <BrowserRouter>
        <DashboardHeroEmbed onClick={mockOnClick} />
      </BrowserRouter>
    )
    
    const container = screen.getByText('Click to explore →').parentElement?.parentElement
    expect(container).toBeInTheDocument()
    
    if (container) {
      fireEvent.click(container)
      expect(mockOnClick).toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    }
  })

  it('shows fallback image when dashboard fails to load', () => {
    // Force an error in the Dashboard component
    vi.mock('../webapp/CustomizableDashboard', () => {
      throw new Error('Failed to load dashboard')
    })

    render(
      <BrowserRouter>
        <DashboardHeroEmbed />
      </BrowserRouter>
    )

    const fallbackImage = screen.getByAltText('Synapses Dashboard Preview')
    expect(fallbackImage).toBeInTheDocument()
    expect(fallbackImage).toHaveAttribute('src', '/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png')
  })
})