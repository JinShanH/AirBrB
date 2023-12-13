const register = async (token, email, name, password) => {
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
    localStorage.setItem('email', email);
    return data.token;
  }
};

const login = async (email, password) => {
  const response = await fetch('http://localhost:5005/user/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email, password
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
    localStorage.setItem('email', email)// save user to localstorage
    return data.token
  }
};

const logout = async (token) => {
  const response = await fetch('http://localhost:5005/user/auth/logout', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    }
  });
  const data = await response.json();
  localStorage.setItem('token', null);
  localStorage.setItem('email', null);
  if (data.error) {
    alert(data.error);
  }
};

export { register, login, logout };
