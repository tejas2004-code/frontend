import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import ProductCard from '../../components/ProductCard';
import { useParams } from 'react-router-dom';

const categoryMapping = {
    'jewelry': 'jewelry',
    'electronics': 'electronics',
    'clothes': 'cloths',
    'shoes': 'shoe',
    'books': 'book'
};

const SingleCategory = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { category } = useParams();

    const getCategoryProduct = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Debug logs to check the API URL and category
            const apiUrl = `${process.env.REACT_APP_PRODUCT_TYPE_CATEGORY}/${category}`;
            console.log('API URL:', apiUrl);
            console.log('Category:', category);
            console.log('Environment variable:', process.env.REACT_APP_PRODUCT_TYPE_CATEGORY);

            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Debug log for API response
            console.log('API Response:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data);
                if (response.data.length === 0) {
                    toast.error(`No products found in ${category} category`);
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               `Failed to load ${category} products`;
            
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function to handle retry
    const handleRetry = () => {
        setError(null);
        getCategoryProduct();
    };

    useEffect(() => {
        if (!category) {
            setError('Category not specified');
            return;
        }
        
        // Log the category when it changes
        console.log('Category changed to:', category);
        getCategoryProduct();
    }, [category]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                {category?.charAt(0).toUpperCase() + category?.slice(1)} Products
            </Typography>
            
            {isLoading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px' 
                }}>
                    <Typography>Loading {category} products...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ 
                    textAlign: 'center', 
                    my: 4, 
                    p: 3, 
                    border: '1px solid #ccc', 
                    borderRadius: 2 
                }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleRetry}
                        sx={{ mt: 2 }}
                    >
                        Retry Loading
                    </Button>
                </Box>
            ) : products.length === 0 ? (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="h6">
                        No products available in {category} category
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleRetry}
                        sx={{ mt: 2 }}
                    >
                        Refresh
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default SingleCategory; 