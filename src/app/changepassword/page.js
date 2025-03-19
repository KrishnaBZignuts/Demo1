'use client';
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [storedUser, setStoredUser] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      alert('No user logged in. Redirecting to login.');
      router.push('/auth/login');
      return;
    }
    setStoredUser(loggedInUser);
  }, []);

  const validatePasswordFormat = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!storedUser) return;

    const decryptedPassword = CryptoJS.AES.decrypt(
      storedUser.password,
      'secret_key'
    )
      .toString(CryptoJS.enc.Utf8)
      .trim(); 

    console.log('Decrypted Password:', decryptedPassword); 

    if (currentPassword.trim() !== decryptedPassword) {
      setError('Current password is incorrect.');
      return;
    }

    if (!validatePasswordFormat(newPassword.trim())) {
      setError(
        'New password must be 8-32 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (newPassword.trim() !== confirmNewPassword.trim()) {
      setError('New password and Confirm password do not match.');
      return;
    }

    const encryptedNewPassword = CryptoJS.AES.encrypt(
      newPassword.trim(),
      'secret_key'
    ).toString();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map((user) =>
      user.email === storedUser.email
        ? { ...user, password: encryptedNewPassword }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({ ...storedUser, password: encryptedNewPassword })
    );

    setSuccess('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => router.push('/product'), 2000);
  };

  return (
    <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }} >
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant='h5' mb={2} sx={{ textAlign: "center", fontWeight: "bold" }}>
          Change Password
        </Typography>
  
        {error && <Typography color='error'>{error}</Typography>}
        {success && <Typography color='success.main'>{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Current Password'
            type={showPassword.current ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin='normal'
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label='New Password'
            type={showPassword.new ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin='normal'
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => togglePasswordVisibility('new')}>
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label='Confirm New Password'
            type={showPassword.confirm ? 'text' : 'password'}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            margin='normal'
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type='submit'
            variant='contained'
            size='medium'
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;
