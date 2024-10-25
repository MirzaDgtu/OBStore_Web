import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('Auth');
    const userData = localStorage.getItem('User');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('Auth');
    localStorage.removeItem('User');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return { isAuthenticated, user, loading, logout, checkAuth };
};

export default useAuth;