import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // или ваш компонент загрузки
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
