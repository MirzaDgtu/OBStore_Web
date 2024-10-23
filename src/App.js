import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginForm from './components/login-form';
import Dashboard from './components/dashboard-component';
//import Profile from './components/Profile';
//import Orders from './components/Orders';
//import CompletedOrders from './components/CompletedOrders';
//import Reports from './components/Reports';
//import Employees from './components/Employees';

const theme = createTheme({
  // Здесь вы можете настроить тему вашего приложения
});

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />          
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
