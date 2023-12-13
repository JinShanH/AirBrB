import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';

import LandingPage from './components/LandingPage';
import ListingPage from './components/ListingPage';
import CreateListing from './components/CreateListing';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { TokenContext } from './contexts/Token';
import EditListing from './components/EditListing';
import PublishListing from './components/PublishListing';
import ListingSummary from './components/ListingSummary';
import BookingForm from './components/BookingForm';
import { logout } from './service/Auth';

// Page list component that routes to all existing pages
const PageList = () => {
  const { token, setToken } = useContext(TokenContext);
  const [isTokenSet, setIsToken] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    checkToken();
  }, [setToken]);

  const checkToken = async () => {
    const checktoken = localStorage.getItem('token');
    if (checktoken) {
      await setToken(checktoken);
    }
    setIsToken(true);
  };

  const pages = token
    ? ['Dashboard', 'Logout']
    : ['Register', 'Login'];

  if (!isTokenSet) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage token={token} />} />
        <Route path="/listing/:id" element={<ListingPage token={token} />} />
        <Route path="/create" element={<CreateListing token={token}/>} />
        <Route path="/edit/:id" element={<EditListing token={token} />} />
        <Route path="/publish/:id" element={<PublishListing token={token} />} />
        <Route path="/book/:id" element={<BookingForm />} />
        <Route path="/summary/:id" element={<ListingSummary />} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
      </Routes>

      <br />
      <br />
      <hr />
      <Box>
        <BottomNavigation
          showLabels
          value={''}
          onChange={(event, newValue) => {
            if (pages[newValue] === 'Logout') {
              logout(token);
            } else {
              navigate(`/${pages[newValue].toLowerCase()}`);
            }
          }}
        >
          {pages.map((page) => {
            return (
              <BottomNavigationAction key={page} label={page} icon={<RestoreIcon />} />
            )
          })}
        </BottomNavigation>
      </Box>
      <hr />
      <Footer />

    </>
  );
}

export default PageList;
