const BASE_URL = 'http://localhost:8000/api/';

const getToken = () => {
    return localStorage.getItem('token');
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    
    // Add a buffer of 30 seconds to prevent edge cases
    return new Date().getTime() > (parseInt(expiry) - 30000);
};

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${BASE_URL}token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access);
        
        // Update expiry time (15 minutes from now)
        const newExpiryTime = new Date().getTime() + 15 * 60 * 1000;
        localStorage.setItem('tokenExpiry', newExpiryTime);
        
        return data.access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
        return null;
    }
};

const logout = () => {
    window.localStorage.clear();
    window.location.href = '/login';
};

const handleResponse = async (response, retryCallback) => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            
            // If token is invalid and we have a refresh token, try to refresh and retry the request
            if (errorData.code === 'token_not_valid' && getRefreshToken()) {
                const newToken = await refreshAccessToken();
                if (newToken && retryCallback) {
                    return retryCallback(newToken);
                }
            }
            
            // If we get here, either refresh failed or another error occurred
            if (errorData.code === 'token_not_valid') {
                window.alert('Sessão expirada!');
                logout();
            }
            
            console.error('Error:', errorData);
            return errorData;
        } catch (error) {
            console.error('Error processing response:', error);
            return { error: 'Unable to process response' };
        }
    }
    return response.json();
};

const apiRequest = async (endpoint, method, body = null) => {
    // Check if token is expired before making the request
    if (isTokenExpired() && getRefreshToken()) {
        await refreshAccessToken();
    }
    
    const makeRequest = async (token) => {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token || getToken()}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        };
        
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        return handleResponse(response, newToken => makeRequest(newToken));
    };
    
    return makeRequest();
};

const apiFormDataRequest = async (endpoint, method, formData) => {
    // Check if token is expired before making the request
    if (isTokenExpired() && getRefreshToken()) {
        await refreshAccessToken();
    }
    
    const makeRequest = async (token) => {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token || getToken()}`,
            },
            body: formData,
        };
        
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        return handleResponse(response, newToken => makeRequest(newToken));
    };
    
    return makeRequest();
};

export { apiRequest, apiFormDataRequest, logout };