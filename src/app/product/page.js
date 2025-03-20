'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Pagination,
} from '@mui/material';
import Navbar from './Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const skip = (page - 1) * limit;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}?limit=${limit}&skip=${skip}`
        );
        const data = await res.json();
        setProducts(data.products);
        setTotalProducts(data.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography
          variant='h4'
          gutterBottom
          sx={{ textAlign: 'center', mb: 3 }}
        >
          Product Listing
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <CardMedia
                    onClick={() => router.push(`/product/${product.id}`)}
                    component='img'
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{
                      cursor: 'pointer',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant='h6'
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant='body2'>
                      Category: {product.category}
                    </Typography>
                    <Typography variant='body2'>
                      Brand: {product.brand}
                    </Typography>
                    <Typography variant='body2'>
                      Rating: {product.rating} ⭐
                    </Typography>
                    <Typography variant='body2'>
                      Price: ${product.price} (-{product.discountPercentage}%)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 3 }}>
          <Pagination
            count={Math.ceil(totalProducts / limit)}
            page={page}
            onChange={handlePageChange}
            color='primary'
          />
        </Box>
      </Container>
    </>
  );
};

export default Products;
