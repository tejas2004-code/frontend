// API Endpoints
export const API_ENDPOINTS = {
    GET_USER_DETAILS: process.env.REACT_APP_GET_USER_DETAILS || 'http://localhost:5000/api/auth/getuser',
    UPDATE_USER_DETAILS: process.env.REACT_APP_UPDATE_USER_DETAILS || 'http://localhost:5000/api/auth/updateuser',
    RESET_PASSWORD: process.env.REACT_APP_RESET_PASSWORD || 'http://localhost:5000/api/auth/reset-password',
    DELETE_USER_DETAILS: process.env.REACT_APP_DELETE_USER_DETAILS || 'http://localhost:5000/api/auth/delete'
};

// Axios default config
export const axiosConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
};

// Validate environment variables
export const validateConfig = () => {
    const requiredVars = [
        'REACT_APP_GET_USER_DETAILS',
        'REACT_APP_UPDATE_USER_DETAILS',
        'REACT_APP_RESET_PASSWORD',
        'REACT_APP_DELETE_USER_DETAILS'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.warn('Missing environment variables:', missingVars);
        return false;
    }
    return true;
}; 