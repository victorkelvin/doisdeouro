import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false); // Track authentication state

    const handleLogout = () => {
        localStorage.clear() // Clear all info in LocalStorage
        setIsAuthenticated(false); // Update authentication state
    };

    return (
        <Router>
            <Routes>
                <Route path="/*" element={isAuthenticated ? <Navigate to="/main/" /> : <Navigate to="/login" />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/main/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/main" element={isAuthenticated ? <Main onLogout={handleLogout} /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
