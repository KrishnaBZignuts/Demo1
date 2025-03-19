'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import useUser from '../hooks/useUser';

const Navbar = () => {
  const router = useRouter();;
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useUser();
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';

  const getInitials = (first, last) =>
    first && last ? `${first[0]}${last[0]}`.toUpperCase() : 'U';
  const initials = getInitials(firstName, lastName);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/auth/login');
  };
  return (
    <AppBar position='static'>
      <Toolbar>
        <Box display='flex' alignItems='center'>
          {user ? (
            <IconButton onClick={handleClick} color='inherit'>
              <Typography
                variant='h6'
                sx={{ fontWeight: 'bold', fontSize: 24 }}
              >
                {initials || 'U'}
              </Typography>
            </IconButton>
          ) : (
            <Button
              variant='contained'
              color='warning'
              onClick={() => {
                router.push('/auth/login');
              }}
            >
              Login
            </Button>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MenuItem onClick={() => router.push('/editprofile')}>
            Edit Profile
          </MenuItem>
          <MenuItem onClick={() => router.push('/changepassword')}>
            Change Password
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
