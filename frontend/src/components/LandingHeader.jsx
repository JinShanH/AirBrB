import React, { useContext } from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import SearchFilters from './SearchFilters';
import Search from './SearchContainer';
import StyledInputBase from './StyledInputBase';
import { logout } from '../service/Auth';
import { TokenContext } from '../contexts/Token';

// Source: https://mui.com/material-ui/react-app-bar/

const LandingHeader = () => {
  const { token, setToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  let settings = null;
  const [openFilter, setOpenFilter] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  if (token) {
    settings = {
      'Switch to Hosting': { url: '/dashboard' },
      'Switch to Listings Dashboard': { url: '/' },
      'Log Out': {
        url: '/',
        onClick: () => {
          logout(token).then(() => {
            localStorage.removeItem('token');
            setToken(null);
            navigate('/login');
          })
        }
      }
    };
  } else {
    settings = { 'Register Here': { url: '/register' }, 'Log In': { url: '/login' } };
  }

  const handleFilterIconClick = () => {
    setOpenFilter(true);
  };

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const FilterIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <SearchFilters openFilter={openFilter} setOpenFilter={setOpenFilter} searchText={searchText} setSearchText={setSearchText}>
      </SearchFilters>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              name='mainRedirect'
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              AirBrB
            </Typography>

            <Box sx={{ '@media (max-width: 400px)': { flex: 0.9 }, '@media (min-width: 400px)': { flex: 1 }, display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
              <Search sx={{ display: (window.location.pathname !== '/dashboard') ? 'flex' : 'none' }} style={{ }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  inputProps={{ 'aria-label': 'search' }}
                />
                <FilterIconWrapper>
                  <TuneIcon name='searchButton' aria-label="Filter search button" onClick={handleFilterIconClick}/>
                </FilterIconWrapper>
              </Search>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right', gap: '1em' }}>
              <Link to='/create' style={{ textDecoration: 'none' }} >
                <Button
                  variant="contained"
                  sx={{ display: (window.location.pathname === '/dashboard') ? 'block' : 'none' }}>
                  Create New Listing
                </Button>
              </Link>
              <Tooltip title="Open menu">
                <IconButton aria-label="Open menu" aria-haspopup="menu" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {Object.entries(settings).map(([title, { url: link, onClick }]) => (
                  <Link aria-label={title} key={title} to={link} style={{ textDecoration: 'none', color: 'inherit' }} onClick={onClick}>
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default LandingHeader;
