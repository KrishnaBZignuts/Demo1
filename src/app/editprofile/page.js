'use client';
import { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useUser from '../hooks/useUser';

const editProfileSchema = yup.object().shape({
  firstName: yup.string()
    .matches(/^[A-Za-z]+$/, 'Only alphabets allowed')
    .required('First Name is required'),
  lastName: yup.string()
    .matches(/^[A-Za-z]+$/, 'Only alphabets allowed')
    .required('Last Name is required'),
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  mobile: yup.string()
    .matches(/^[1-9][0-9]{9}$/, 'Must be a 10-digit number starting with 1-9')
    .required('Mobile number is required'),
});

const EditProfile = () => {
  const router = useRouter();
  const currentUser = useUser();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(editProfileSchema),
  });

  useEffect(() => {
    if (currentUser) {
      setValue('firstName', currentUser?.firstName || '');
      setValue('lastName', currentUser?.lastName || '');
      setValue('email', currentUser?.email || '');
      setValue('mobile', currentUser?.mobile || '');
    }
  }, [currentUser, setValue]);

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some((u) => u.email === data.email && u.email !== currentUser?.email);

    if (emailExists) {
      setError('Email already exists. Please use a different email.');
      return;
    }

    const updatedUsers = users.map((u) => (u.email === currentUser.email ? data : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('loggedInUser', JSON.stringify(data));

    alert('Profile updated successfully!');
    router.push('/product');
  };

  return (
    <>
      {currentUser && (
        <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 500, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant='h5' gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Edit Profile
            </Typography>

            {error && <Alert severity='error'>{error}</Alert>}

            <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label='First Name'
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                margin='normal'
              />

              <TextField
                fullWidth
                label='Last Name'
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                margin='normal'
              />

              <TextField
                fullWidth
                label='Email'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                margin='normal'
                type='email'
              />

              <TextField
                fullWidth
                label='Mobile Number'
                {...register('mobile')}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                margin='normal'
              />

              <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 3, py: 1.2, fontSize: '1rem' }}>
                Update Profile
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default EditProfile;
