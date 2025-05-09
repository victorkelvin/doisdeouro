import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../services/baseApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is authenticated on initial load
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const expiry = localStorage.getItem('tokenExpiry');
            const storedUserId = localStorage.getItem('user_id');

            if (token && expiry && new Date().getTime() < parseInt(expiry)) {
                setIsAuthenticated(true);
                setUserId(storedUserId);

                // Only navigate if we're not already on a main route and not logging in
                if (!location.pathname.includes('/main') && location.pathname !== '/login') {
                    navigate('/main/aulas');
                }
            } else if (localStorage.getItem('refreshToken')) {
                // If access token is expired but we have a refresh token,
                // we'll try to refresh in the API call
                setIsAuthenticated(true);
                setUserId(storedUserId);

                // Only navigate if we're not already on a main route and not logging in
                if (!location.pathname.includes('/main') && location.pathname !== '/login') {
                    navigate('/main/aulas');
                }
            } else {
                setIsAuthenticated(false);
                setUserId(null);

                // Only navigate to login if we're not already there and trying to access a protected route
                if (location.pathname !== '/login' && location.pathname.includes('/main')) {
                    navigate('/login');
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [navigate, location.pathname]);

    const login = async (username, password) => {
        // let BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
        // const API_URL = `${BASE_URL}/api/`;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();

            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            const expiryTime = new Date().getTime() + 15 * 60 * 1000; // 15 minutes
            localStorage.setItem('tokenExpiry', expiryTime);

            localStorage.setItem('user_id', username);

            setIsAuthenticated(true);
            setUserId(username);
            navigate('/main/aulas');
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUserId(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            userId,
            login,
            logout,
            setIsAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;