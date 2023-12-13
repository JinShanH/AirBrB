import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Box, Button, TextField, Typography } from '@mui/material';
import Popup from './Popup';
import { TokenContext } from '../contexts/Token';

function Register () {
  const { token, setToken } = useContext(TokenContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token]);

  const register = async () => {
    if (password === confirmPassword) {
      const response = await fetch('http://localhost:5005/user/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email, password, name
        }),
        headers: {
          'Content-type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        localStorage.setItem('email', email)
        navigate('/dashboard');
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Popup message={'Passwords do not match!'} open={open} setOpen={setOpen}/>
      <Container display="flex" sx={{ flexDirection: 'column' }} align="center" role='form' aria-label="Registration form">
        <Box width="fit-content" display="flex" flexDirection="column" gap="1em">
          <Typography variant="h4" gutterBottom>
            AirBrB
          </Typography>
          <TextField required name="email" label="Email" aria-label="Enter email here" type="text" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField required name="name" label="Name" aria-label="Enter name here" type="text" value={name} onChange={e => setName(e.target.value)} />
          <TextField required name="password" label="Password" aria-label="Enter password here" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <TextField required name="confirm-password" label="Confirm Password" aria-label="Reenter password here" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <Button aria-label="Submit registration" type="submit" variant="contained" onClick={register}>Register</Button>
        </Box>
      </Container>
    </>
  )
}

export default Register;
