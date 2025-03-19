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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'all', reValidateMode:'onChange'}); 
  const router = useRouter();
  const password = watch('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.email === data.email);

    if (userExists) {
      setErrorMessage('Email already exists!');
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      data.password,
      'secret_key'
    ).toString();

    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      password: encryptedPassword,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));

    toast.success('Signup successful!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });

    router.push('/product');
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
        }}
      >
        <Typography variant='h5' mb={2} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Sign Up
        </Typography>

        {errorMessage && <Typography color='error'>{errorMessage}</Typography>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label='First Name'
            {...register('firstName', {
              required: 'First Name is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Only alphabets are allowed',
              },
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            margin='normal'
          />

          <TextField
            fullWidth
            label='Last Name'
            {...register('lastName', {
              required: 'Last Name is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Only alphabets are allowed',
              },
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            margin='normal'
          />

          <TextField
            fullWidth
            label='Email'
            type='email'
            autoComplete='off'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email format',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin='normal'
          />

          <TextField
            fullWidth
            label='Mobile Number'
            type='tel'
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[1-9][0-9]{9}$/,
                message: 'Must be 10 digits & start with 1-9',
              },
            })}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
            margin='normal'
          />

          <TextField
            fullWidth
            label='Password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='off'
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                message: 'Must include uppercase, lowercase, number & special character',
              },
            })}
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

          <TextField
            fullWidth
            label='Confirm Password'
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            margin='normal'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge='end'>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type='submit' variant='contained' fullWidth sx={{ mt: 2, mr: 2 }}>
            Signup
          </Button>

          <Typography sx={{ mt: 2 }}>
            Already have an account?
            <Link href='/auth/login' sx={{ ml: 1, fontWeight: 'bold', cursor: 'pointer' }}>
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
