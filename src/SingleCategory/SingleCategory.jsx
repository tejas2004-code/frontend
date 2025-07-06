import './singlecategory.css'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { Container } from '@mui/system'
import { Box, Button, MenuItem, FormControl, Select } from '@mui/material'
import Loading from '../Components/loading/Loading'
import { BiFilterAlt } from 'react-icons/bi';
import ProductCard from '../Components/Card/Product Card/ProductCard'
import CopyRight from '../Components/CopyRight/CopyRight'



const SingleCategory = () => {
    const [productData, setProductData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterOption, setFilterOption] = useState('all')
    const [title, setTitle] = useState('All')
    const { cat } = useParams()

    useEffect(() => {
        getCategoryProduct()
        window.scroll(0, 0)
    }, [])

    const getCategoryProduct = async () => {
        try {
            setIsLoading(true);
            const category = cat.toLowerCase(); // Normalize category name
            console.log('Fetching products for category:', category);
            
            const response = await axios.post(
                `${process.env.REACT_APP_PRODUCT_TYPE}`, 
                { userType: category }
            );
            
            if (response.data && Array.isArray(response.data)) {
                setProductData(response.data);
                if (response.data.length === 0) {
                    console.log('No products found for category:', category);
                }
            } else {
                console.error('Invalid response format:', response.data);
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // Keep UI state consistent even if there's an error
            setProductData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const productFilter = []

    if (cat === 'book') {
        productFilter.push('All', 'Scifi', 'Business', 'Mystery', 'Cookbooks', 'Accessories')
    }
    else if (cat === 'cloths') {
        productFilter.push('All', 'Men', 'Women')
    }
    else if (cat === 'shoe') {
        productFilter.push('All', 'Running', 'Football', 'Formal', 'Casual')
    }
    else if (cat === 'electronics') {
        productFilter.push('All', 'Monitor', 'smartphone', 'headphone', 'laptop')
    }
    else if (cat === 'jewelry') {
        productFilter.push(
            'All',
            'necklace',
            'rings',
            'earrings',
            'bracelets',
            'bangles'
        );
    }

    const handleChange = (e) => {
        setTitle(e.target.value)
        const filter = e.target.value.toLowerCase()
        setFilterOption(filter)
        getData(filter)
    }

    const getData = async (filter) => {
        try {
            setIsLoading(true);
            const category = cat.toLowerCase();
            const filterValue = filter.toLowerCase();
            
            console.log('Fetching filtered products:', { category, filter: filterValue });
            
            const { data } = await axios.post(
                `${process.env.REACT_APP_PRODUCT_TYPE_CATEGORY}`, 
                { 
                    userType: category, 
                    userCategory: filterValue === 'all' ? '' : filterValue 
                }
            );
            console.log(data);
            
            if (Array.isArray(data)) {
                setProductData(data);
            } else {
                console.error('Invalid response format:', data);
                setProductData([]);
            }
        } catch (error) {
            console.error('Filter error:', error);
            setProductData([]);
        } finally {
            setIsLoading(false);
        }
    }

    const loading = isLoading ? (
        <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap", paddingLeft: 10, paddingBottom: 20 }}>
            <Loading /><Loading /><Loading /><Loading />
            <Loading /><Loading /><Loading /><Loading />
        </Container>
    ) : ""

    return (
        <>
            <Container maxWidth='xl' style={{ marginTop: 90, display: 'flex', justifyContent: "center", flexDirection: "column" }}>
                <Box sx={{ minWidth: 140 }}>
                    <FormControl sx={{ width: 140 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: "80vw" }}>
                            <Button endIcon={<BiFilterAlt />}>Filters</Button>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={title}
                                sx={{ width: 200 }}
                                onChange={handleChange}
                            >
                                {productFilter.map(prod => (
                                    <MenuItem key={prod} value={prod}>{prod}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </FormControl>
                </Box>
                {loading}
                <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20, marginBottom: 30, width: '100%' }}>
                    {productData.map(prod => (
                        <Link to={`/Detail/type/${cat}/${prod._id}`} key={prod._id}>
                            <ProductCard prod={prod} />
                        </Link>
                    ))}
                </Container>
            </Container>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default SingleCategory

    //         