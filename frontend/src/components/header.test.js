import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { TokenProvider } from '../contexts/Token'
import { BrowserRouter } from 'react-router-dom'
import LandingHeader from './LandingHeader'

const noop = () => {}

describe('LandingHeader', () => {
  it('All items render properly', () => {
    render(<TokenProvider><BrowserRouter><LandingHeader/></BrowserRouter></TokenProvider>);
    expect(screen.getByText('AirBrB')).toBeInTheDocument()
    const searchButton = screen.getByTestId('TuneIcon')
    expect(searchButton).toBeInTheDocument()
    const profileButton = screen.getByTestId('AccountCircleIcon')
    expect(profileButton).toBeInTheDocument()
  });
  
  it('AirBrB button links to the dashboard', () => {
    render(<TokenProvider><BrowserRouter><LandingHeader/></BrowserRouter></TokenProvider>);
    screen.debug()
    const button = screen.getByText('AirBrB')
    expect(button).toHaveAttribute('href', '/')
  });

  it('Account button menu is closed by default', () => {
    render(<TokenProvider><BrowserRouter><LandingHeader/></BrowserRouter></TokenProvider>);
    const profileButton = screen.getByTestId('AccountCircleIcon')
    expect(profileButton).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()
  });

  it('Clicking account button renders options', () => {
    render(<TokenProvider><BrowserRouter><LandingHeader/></BrowserRouter></TokenProvider>);
    const profileButton = screen.getByTestId('AccountCircleIcon')

    userEvent.click(profileButton)
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()

    const registerButton = screen.getByText('Register Here')
    expect(registerButton).toBeInTheDocument()
    const loginButton = screen.getByText('Log In')
    expect(loginButton).toBeInTheDocument()
  });

  it('Menu options navigate to other pages', () => {
    render(<TokenProvider><BrowserRouter><LandingHeader/></BrowserRouter></TokenProvider>);
    const profileButton = screen.getByTestId('AccountCircleIcon')

    userEvent.click(profileButton)

    const registerButton = screen.getByText('Register Here')
    expect(registerButton.parentElement.parentElement).toHaveAttribute('href', '/register')
    const loginButton = screen.getByText('Log In')
    expect(loginButton.parentElement.parentElement).toHaveAttribute('href', '/login')
  });
  
  
})