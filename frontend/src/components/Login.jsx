import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Button, TextField, Typography, Box } from '@mui/material';
import { TokenContext } from '../contexts/Token';
import { login } from '../service/Auth';

// Functional component definition for login form
const Login = () => {
  const { token, setToken } = useContext(TokenContext); // Importing the TokenContext for authentication token
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  // Redirect to the dashboard if a token is saved in localStorage
  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token]);

  // Calls login API on login button click
  const handleLogin = async () => {
    const fetchedToken = await login(email, password);
    setToken(fetchedToken);
    navigate('/dashboard');
  }

  return (
    <Container display="flex" sx={{ flexDirection: 'column' }} align="center" role='form'>
      <Box width="fit-content" display="flex" flexDirection="column" gap="1em">
        <Typography variant="h4" gutterBottom>
          AirBrB
        </Typography>
        <TextField required name="email" label="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField required name="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" onClick={handleLogin}>Login</Button>
      </Box>
    </Container>
  )
}

export default Login;
