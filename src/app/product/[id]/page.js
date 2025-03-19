'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Card,
  CardMedia,
  Box,
  Grid,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Image from 'next/image';

const ProductDetails = () => {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProductDetails = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`);
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!product) {
    return <Typography>No product found.</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={9} md={5}>
          <Card sx={{ p: 2 }}>
            <CardMedia
              component='img'
              image={product.thumbnail}
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                objectFit: 'cover',             
              }}
            />
            <Box display='flex' justifyContent='center' gap={1} mt={2}>
              {product.images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  width={50}
                  height={50}
                  style={{
                    border: '2px solid #007BFF',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant='h6' color='text.secondary' gutterBottom>
            {product.category.toUpperCase()}
          </Typography>
          <Typography variant='h4' fontWeight='bold'>
            {product.title}
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mt: 1, textAlign: 'justify' }}
          >
            {product.description}
          </Typography>

          <Typography variant='h5' color='primary' sx={{ mt: 2 }}>
            ${product.price}{' '}
            <Typography
              component='span'
              color='text.secondary'
              sx={{ textDecoration: 'line-through' }}
            >
              $
              {(
                (product.price * 100) /
                (100 - product.discountPercentage)
              ).toFixed(2)}
            </Typography>
          </Typography>

          <Box display='flex' alignItems='center' mt={1}>
            <StarIcon sx={{ color: 'gold' }} />
            <Typography variant='body1' sx={{ ml: 0.5 }}>
              {product.rating} / 5
            </Typography>
          </Box>

          <Typography variant='body2' sx={{ mt: 2 }}>
            <strong>In Stock:</strong> {product.stock}
          </Typography>
          <Typography variant='body2'>
            <strong>SKU:</strong> {product.sku}
          </Typography>
          <Typography variant='body2'>
            <strong>Brand:</strong> {product.brand}
          </Typography>
          <Typography variant='body2'>
            <strong>Weight:</strong> {product.weight} kg
          </Typography>
          <Typography variant='body2'>
            <strong>Dimensions:</strong> {product.dimensions.width} x{' '}
            {product.dimensions.height} x {product.dimensions.depth} cm
          </Typography>
          <Typography variant='body2'>
            <strong>Warranty:</strong> {product.warrantyInformation}
          </Typography>
          <Typography variant='body2'>
            <strong>Shipping Info:</strong> {product.shippingInformation}
          </Typography>
          <Typography variant='body2'>
            <strong>Return Policy:</strong> {product.returnPolicy}
          </Typography>
         
          <Box mt={3}>
            <Typography variant='h6'>Product Tags:</Typography>
            <Box display='flex' gap={1} mt={1}>
              {product.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  color='primary'
                  sx={{ fontWeight: 'bold' }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant='h5'>Customer Reviews:</Typography>
        <Divider sx={{ my: 2 }} />

        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
            >
              <Avatar sx={{ bgcolor: '#007BFF', color: '#fff', mr: 2 }}>
                {review.reviewerName[0]}
              </Avatar>
              <Box>
                <Typography variant='body1' fontWeight='bold'>
                  {review.reviewerName}
                </Typography>
                <Box display='flex' alignItems='center'>
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <StarIcon key={i} sx={{ color: 'gold', fontSize: 18 }} />
                    ))}
                </Box>
                <Typography
                  variant='body2'
                  sx={{ fontStyle: 'italic', mt: 0.5 }}
                >
                  {review.comment}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant='body2'>No reviews available.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetails;
