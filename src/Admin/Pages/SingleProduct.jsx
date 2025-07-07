import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// import { getSingleProduct } from '../../Constants/Constant';
import axios from "axios";

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField, Typography } from '@mui/material';
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Transition } from '../../Constants/Constant';
import CopyRight from '../../Components/CopyRight/CopyRight';
const SingleProduct = () => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);

    let authToken = localStorage.getItem("Authorization")
    const [productInfo, setProductInfo] = useState({
        name: "",
        image: "",
        price: "",
        rating: "",
        category: "",
        type: "",
        description: "",
        author: "",
        brand: ""
    });

    const { id } = useParams();
    let navigate = useNavigate()
    useEffect(() => {
        getSingleProduct()
        window.scroll(0, 0)
    }, [getSingleProduct])
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`);
            if (!data) {
                throw new Error('Product not found');
            }
            setProductInfo({
                name: data.name || '',
                image: data.image || '',
                price: data.price || '',
                rating: data.rating || '',
                category: data.category || '',
                type: data.type || '',
                description: data.description || '',
                author: data.author || '',
                brand: data.brand || ''
            });
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product details', { autoClose: 1500, theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };
    const handleOnchange = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })

    }
    const productFilter = []

    if (productInfo.type === 'book') {
        productFilter.push('scifi', 'business', 'mystery', 'cookbooks', 'accessories')
    }
    else if (productInfo.type === 'cloths') {
        productFilter.push('men', 'women')
    }
    else if (productInfo.type === 'shoe') {
        productFilter.push('running', 'football', 'formal', 'casual')
    }
    else if (productInfo.type === 'electronics') {
        productFilter.push('monitor', 'smart phones', 'headphone', 'laptop')
    }
    else if (productInfo.type === 'jewelry') {
        productFilter.push('necklace', 'rings', 'earrings', 'bracelets', 'bangles')
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['name', 'price', 'rating', 'category', 'type', 'description'];
        const missingFields = requiredFields.filter(field => !productInfo[field]);
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`, { autoClose: 1500 });
            return;
        }

        if (!productFilter.includes(productInfo.category)) {
            toast.error('Invalid category selected', { autoClose: 1500 });
            return;
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_ADMIN_UPDATE_PRODUCT}/${product._id}`,
                { productDetails: productInfo },
                {
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Product updated successfully', { autoClose: 1500, theme: 'colored' });
                // Refresh product data
                await getSingleProduct();
            } else {
                throw new Error(response.data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update error:', error);
            const errorMsg = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to update product';
            toast.error(errorMsg, { autoClose: 1500, theme: 'colored' });
        }
    };
    const deleteProduct = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_ADMIN_DELETE_PRODUCT}/${product._id}`, {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data === true || response.data.success) {
                toast.success('Product deleted successfully', { autoClose: 1500, theme: 'colored' });
                navigate(-1);
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
            const errorMsg = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to delete product';
            toast.error(errorMsg, { autoClose: 1500, theme: 'colored' });
        } finally {
            setOpenAlert(false);
        }
    };
    const shoeBrand = ['adidas', 'hushpuppies', 'nike', 'reebok', 'vans']
    const typeDropdown = ['book', 'cloths', 'shoe', 'electronics', 'jewelry'];



    return (
        <>
            <Container sx={{ width: "100%", marginBottom: 5 }}>
                {loading ? (
                    <section style={{ display: 'flex', flexWrap: "wrap", width: "100%", justifyContent: "space-around", alignItems: 'center' }}>
                        <Skeleton variant='rectangular' height={200} width="200px" />
                        <Skeleton variant='text' height={400} width={700} />

                    </section>
                ) : (
                    <Box sx={{ width: "100%", display: 'flex', flexWrap: "wrap", alignItems: "center", justifyContent: "space-around" }}>
                        <div className='detail-img-box'  >
                            <img alt={product.name} src={product.image} className='detail-img' />
                            <br />

                        </div>
                        <div >
                            <Typography variant='h4'>{product.name}</Typography>
                        </div>
                    </Box>
                )}
                <form autoComplete="off" onSubmit={handleSubmit} style={{ marginTop: 30 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField label="Name" name='name' value={productInfo.name} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Price" name='price' value={productInfo.price} onChange={handleOnchange} variant="outlined" inputMode='numeric' fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Rating" name='rating' value={productInfo.rating} onChange={handleOnchange} variant="outlined" inputMode='numeric' fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={(productInfo.type === 'book' || productInfo.type === 'shoe') ? 6 : 12} >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Product Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={productInfo.category}
                                    label="Product Category"
                                    name='category'
                                    onChange={handleOnchange}
                                >
                                    {productFilter.map(item =>
                                        <MenuItem value={item} key={item}>{item}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            productInfo.type === 'book' &&
                            <Grid item xs={12} sm={6}>
                                <TextField label="Author" name='author' value={productInfo.author} onChange={handleOnchange} variant="outlined" fullWidth />
                            </Grid>
                        }
                        {
                            productInfo.type === 'shoe' &&
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Shoe Brand</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={productInfo.brand}
                                        label="Shoe Brand"
                                        name='brand'
                                        required
                                        onChange={handleOnchange}
                                    >
                                        {shoeBrand.map(item =>
                                            <MenuItem value={item} key={item}>{item}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        <Grid item xs={12} >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Product Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={productInfo.type}
                                    label="Product Type"
                                    name='type'
                                    onChange={handleOnchange}
                                >
                                    {typeDropdown.map(item =>
                                        <MenuItem value={item} key={item}>{item}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ margin: "10px auto" }}>
                            <TextField
                                id="filled-textarea"
                                value={productInfo.description} onChange={handleOnchange}
                                label="Description"
                                multiline
                                sx={{ width: "100%" }}
                                variant="outlined"
                                name='description'

                            />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
                        <Button variant='contained' endIcon={<AiOutlineFileDone />} type='submit'>Save</Button>
                    </Container>
                </form >
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                    <Typography variant='h6'>Delete {productInfo.name}?</Typography>
                    <Button variant='contained' color='error' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete</Button>
                </Box>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            <Typography variant='body1'>Do you want to delete this product?</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteProduct}>Delete</Button>
                        <Button variant='contained' color='primary'
                            onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default SingleProduct