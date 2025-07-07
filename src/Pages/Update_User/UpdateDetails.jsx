import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import styles from './Update.module.css'
import { toast } from 'react-toastify'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { TiArrowBackOutline } from 'react-icons/ti';
import { API_ENDPOINTS, axiosConfig, validateConfig } from '../../utils/config';
import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'

const UpdateDetails = () => {
    const [userData, setUserData] = useState([])
    const [openAlert, setOpenAlert] = useState(false);
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        zipCode: '',
        city: '',
        userState: '',
    })
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    let navigate = useNavigate()
    useEffect(() => {
        if (!validateConfig()) {
            toast.error("Application configuration error", { autoClose: 1500, theme: 'colored' });
            return;
        }
        
        if (!setProceed) {
            navigate('/');
            return;
        }
        
        getUserData();
    }, []);
    const getUserData = async () => {
        try {
            setIsLoading(true);
            console.log('API URL:', API_ENDPOINTS.GET_USER_DETAILS); // Debug log
            
            const response = await axios.get(API_ENDPOINTS.GET_USER_DETAILS, {
                ...axiosConfig,
                headers: {
                    ...axiosConfig.headers,
                    'Authorization': authToken
                }
            });
            
            if (!response.data) {
                throw new Error('No user data received');
            }
            
            setUserDetails({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                address: response.data.address || '',
                zipCode: response.data.zipCode || '',
                city: response.data.city || '',
                userState: response.data.userState || ''
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error.response || error);
            const errorMsg = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Failed to load user details";
            setError(errorMsg);
            toast.error(errorMsg, { autoClose: 1500, theme: 'colored' });
            
            // Handle unauthorized access
            if (error.response?.status === 401) {
                localStorage.removeItem('Authorization');
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    let phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // let zipRegex = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requiredFields = Object.entries(userDetails).filter(([key, value]) => !value);
            if (requiredFields.length > 0) {
                toast.error("Please fill all required fields", { autoClose: 1500, theme: 'colored' });
                return;
            }

            if (!validateZipCode(userDetails.zipCode)) {
                toast.error("Please enter a valid 6-digit zip code", { autoClose: 1500, theme: 'colored' });
                return;
            }

            const response = await axios.put(
                API_ENDPOINTS.UPDATE_USER_DETAILS,
                { userDetails },
                {
                    ...axiosConfig,
                    headers: {
                        ...axiosConfig.headers,
                        'Authorization': authToken
                    }
                }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully", { autoClose: 1500, theme: 'colored' });
                getUserData();
            }
        } catch (error) {
            console.error('Update error:', error.response || error);
            const errorMsg = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Failed to update profile";
            toast.error(errorMsg, { autoClose: 1500, theme: 'colored' });
            
            if (error.response?.status === 401) {
                localStorage.removeItem('Authorization');
                navigate('/login');
            }
        }
    };
    const handleResetPassword = async (e) => {
        e.preventDefault()
        try {
            if (!password.currentPassword || !password.newPassword) {
                toast.error("Please fill all password fields", { autoClose: 1500, theme: 'colored' });
                return;
            }
            
            if (password.currentPassword === password.newPassword) {
                toast.error("New password must be different from current password", { autoClose: 1500, theme: 'colored' });
                return;
            }

            if (password.newPassword.length < 5) {
                toast.error("Password must be at least 5 characters long", { autoClose: 1500, theme: 'colored' });
                return;
            }

            const { data } = await axios.post(`${process.env.REACT_APP_RESET_PASSWORD}`, {
                id: userData._id,
                currentPassword: password.currentPassword,
                newPassword: password.newPassword,
            }, {
                headers: {
                    'Authorization': authToken
                }
            });
            
            toast.success("Password updated successfully", { autoClose: 1500, theme: 'colored' });
            resetPasswordState();
        } catch (error) {
            const errorMsg = error.response?.data || "Failed to update password";
            toast.error(errorMsg, { autoClose: 1500, theme: 'colored' });
        }
    }
    const resetPasswordState = () => {
        setPassword({
            currentPassword: "",
            newPassword: ""
        });
    }
    const deleteAccount = async () => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_DELETE_USER_DETAILS}/${userData._id}`, {
                headers: {
                    'Authorization': authToken
                }
            });
            
            toast.success("Account deleted successfully", { autoClose: 1500, theme: 'colored' });
            localStorage.removeItem('Authorization');
            sessionStorage.clear(); // Clear all session storage
            navigate("/login");
        } catch (error) {
            const errorMsg = error.response?.data || "Failed to delete account";
            toast.error(errorMsg, { autoClose: 1500, theme: 'colored' });
        } finally {
            setOpenAlert(false);
        }
    }
    const validateZipCode = (zipCode) => {
        const zipRegex = /^\d{6}$/;  // For 6-digit Indian postal code
        return zipRegex.test(zipCode);
    }
    return (
        <>
            <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 10 }}>
                <Typography variant='h6' sx={{ margin: '30px 0', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
                <form noValidate autoComplete="off" className={styles.checkout_form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="First Name" name='firstName' value={userDetails.firstName || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Last Name" name='lastName' value={userDetails.lastName || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Contact Number" type='tel' name='phoneNumber' value={userDetails.phoneNumber || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name='email' value={userDetails.email || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" name='address' value={userDetails.address || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="City" name='city' value={userDetails.city || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField type='tel' label="Postal/Zip Code" name='zipCode' value={userDetails.zipCode || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField label="Province/State" name='userState' value={userDetails.userState || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
                        <Button variant='contained' endIcon={<TiArrowBackOutline />} onClick={()=>navigate(-1)} >Back</Button>
                        <Button variant='contained' endIcon={<AiOutlineFileDone />}  type='submit'>Save</Button>
                    </Container>
                </form >

                <Typography variant='h6' sx={{ margin: '20px 0', fontWeight: 'bold', color: '#1976d2' }}>Reset Password</Typography>
                <form onSubmit={handleResetPassword}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField
                                label="Current Password"
                                name='currentPassword'
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                                            {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                value={password.currentPassword || ''}
                                onChange={
                                    (e) => setPassword({
                                        ...password, [e.target.name]: e.target.value
                                    })
                                }
                                variant="outlined"
                                fullWidth />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                label="New Password"
                                name='newPassword'
                                type={showNewPassword ? "text" : "password"}
                                id="password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={() => setShowNewPassword(!showNewPassword)} sx={{ cursor: 'pointer' }}>
                                            {showNewPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                value={password.newPassword || ''}
                                onChange={
                                    (e) => setPassword({
                                        ...password, [e.target.name]: e.target.value
                                    })
                                }
                                variant="outlined"
                                fullWidth />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                        <Button variant='contained' color='primary' endIcon={<RiLockPasswordLine />} type='submit'>Reset</Button>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                    <Typography variant='h6'>Delete Your Account?</Typography>
                    <Button variant='contained' color='error' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete</Button>
                </Box>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            <Typography variant='body1'>Your all data will be erased</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteAccount}>Delete</Button>
                        <Button variant='contained' color='primary'
                            onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container >
            <CopyRight sx={{ mt: 4, mb: 10 }} />
        </>
    )
}

export default UpdateDetails
