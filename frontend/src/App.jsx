import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Main from './pages/Main';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App with AuthProvider
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/main/*" element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/main/aulas" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;