import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { TokenProvider } from '../contexts/Token'
import { BrowserRouter } from 'react-router-dom'
import Register from './Register'

const noop = () => {}

describe('Register', () => {
  it('Renders all fields and register button', () => {
    render(<TokenProvider><BrowserRouter><Register/></BrowserRouter></TokenProvider>);
    expect(screen.queryByText('Passwords do not match!')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Enter email here')).toBeInTheDocument()
    expect(screen.getByLabelText('Enter name here')).toBeInTheDocument()
    expect(screen.getByLabelText('Enter password here')).toBeInTheDocument()
    expect(screen.getByLabelText('Reenter password here')).toBeInTheDocument()
    expect(screen.getByText(/register/i)).toBeInTheDocument()
  });

  it('Renders required input', async () => {
    render(<TokenProvider><BrowserRouter><Register/></BrowserRouter></TokenProvider>);
    expect(screen.getByLabelText(/Email/)).toBeRequired()
    expect(screen.getByLabelText(/Name/)).toBeRequired()

    const allInputs = screen.getAllByLabelText(/password/i)
    const passwordInput = allInputs.find((input) => input.name === 'password')
    expect(passwordInput).toBeRequired()
    const passwordCfm = allInputs.find((input) => input.name === 'confirm-password')
    expect(passwordCfm).toBeRequired()
  });

  // it('Submits triggers onclick event', async () => {a
  

  // it('Submit renders onclick event', async () => {
  //   render(<TokenProvider><BrowserRouter><Register/></BrowserRouter></TokenProvider>);
  //   const button = screen.getByRole('button', {name: /Submit registration/})
  //   screen.debug()

  //   // userEvent.click(button)
  //   // screen.debug()
  //   // const popup = screen.getByText('Passwords do not match!')
  //   // expect(popup).toBeInTheDocument()

  //   // const onClick = jest.fn();
  //   // userEvent.click(screen.getByLabelText('Submit registration'))
  //   // expect(onClick).toBeCalledTimes(1)

  // const pInput = screen.getByLabelText('Enter password here')

  // // userEvent.type(pInput, 'aa')
  // // userEvent.click(screen.getByText(/register/i))
  // // screen.debug()

  // const inp = screen.getByText(/^Password$/)
  // // userEvent.clear(inp)
  // userEvent.type(inp, 'aaa')
  // userEvent.click(screen.getByText(/register/i))
  // expect(screen.getByText('Passwords do not match!')).toBeInTheDocument();
  // });
});


