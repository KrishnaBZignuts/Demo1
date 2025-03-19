'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === data.email.trim());

    if (!user) {
      toast.error('Email does not exist!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret_key').toString(CryptoJS.enc.Utf8);

      if (!decryptedPassword || decryptedPassword !== data.password.trim()) {
        toast.error('Incorrect password!', { position: 'top-right', autoClose: 3000 });
        return;
      }

      localStorage.setItem('loggedInUser', JSON.stringify(user));
      toast.success('Login successful!', { position: 'top-right', autoClose: 3000 });
      router.push('/product');

    } catch (error) {
      toast.error('Something went wrong. Please try again.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant='h5' mb={2} sx={{ textAlign: "center", fontWeight: "bold" }}>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label='Email'
            type='email'
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin='normal'
          />

          <TextField
            fullWidth
            label='Password'
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin='normal'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type='submit' variant='contained' size='medium' fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>

        <Typography sx={{ mt: 2 }}>
          Don't have an account?
          <Link href='/' sx={{ ml: 1, fontWeight: 'bold', cursor: 'pointer' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
