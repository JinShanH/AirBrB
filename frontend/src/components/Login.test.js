import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import Login from './Login'
import React from 'react'
import { TokenProvider } from '../contexts/Token'
import { BrowserRouter } from 'react-router-dom'

// const noop = () => {}

afterEach(() => {
  // Clear any global state or side effects before each test
  cleanup();
  jest.clearAllMocks(); // Reset any mocked functions, including console methods
});

describe('Login', () => {
  it('renders the email field, password field and login button', () => {
    render(<TokenProvider><BrowserRouter><Login/></BrowserRouter></TokenProvider>);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })

  it('renders email and password as required inputs', () => {
    render(<TokenProvider><BrowserRouter><Login/></BrowserRouter></TokenProvider>);

    expect(screen.getByLabelText(/email/i)).toBeRequired()
    expect(screen.getByLabelText(/password/i)).toBeRequired()
  });

  it('Renders error message when no email is provided', async () => {
    const err = 'Must provide an email for user login';
    render(<TokenProvider><BrowserRouter><Login/></BrowserRouter></TokenProvider>);

    userEvent.clear(screen.getByLabelText(/email/i));
    userEvent.click(screen.getByText(/login/i));

    const alertMock = jest.spyOn(window,'alert').mockImplementation();
    await waitFor(() =>expect(alertMock).toHaveBeenCalledWith(err));
    alertMock.mockRestore()
  });

  it('Renders error message when no password is provided', async () => {
    const err = 'Must provide a password for user login';
    render(<TokenProvider><BrowserRouter><Login/></BrowserRouter></TokenProvider>);

    userEvent.clear(screen.getByLabelText(/email/i));
    userEvent.type(screen.getByLabelText(/email/i), 'a');
    userEvent.click(screen.getByText(/login/i));

    const alertMock = jest.spyOn(window,'alert').mockImplementation();
    await waitFor(() =>expect(alertMock).toHaveBeenCalledWith(err));
    alertMock.mockRestore()
  });

  it('Renders error message invalid credentials are provided', async () => {
    const err = 'Invalid email or password';
    render(<TokenProvider><BrowserRouter><Login/></BrowserRouter></TokenProvider>);

    userEvent.clear(screen.getByLabelText(/email/i));
    userEvent.type(screen.getByLabelText(/email/i), 'lalalalalalaalala');
    userEvent.clear(screen.getByLabelText(/password/i));
    userEvent.type(screen.getByLabelText(/password/i), 'faffaafafafafafafa');
    userEvent.click(screen.getByText(/login/i));

    const alertMock = jest.spyOn(window,'alert').mockImplementation();
    await waitFor(() =>expect(alertMock).toHaveBeenCalledWith(err));
    alertMock.mockRestore()
  });
})
