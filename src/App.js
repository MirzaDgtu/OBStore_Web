import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginForm from './components/login-form';
import Dashboard from './components/dashboard-component';
import Profile from './dashboard/user-profile';
import Orders from './dashboard/orders-component';
import AssemblyOrders from './dashboard/assembly-orders';
import Reports from './dashboard/reports-component';
import Employees from './dashboard/employees-component';


const theme = createTheme({
  // Здесь вы можете настроить тему вашего приложения
});

const navItems = [
    { label: 'Заказы', path: '/dashboard/orders' },
    { label: 'Собранные заказы', path: '/dashboard/assemlyorders' },
    { label: 'Отчеты', path: '/dashboard/reports' },
    { label: 'Сотрудники', path: '/dashboard/employees' },
    { label: 'Профиль', path: '/dashboard/profile' },
];

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
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard navItems={navItems} />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard/*" element={<Dashboard navItems={navItems} />}>
              <Route path="profile" element={<Profile />} />
              {/* Здесь будут остальные маршруты */}
              
              <Route path="orders" element={<Orders />} />
              <Route path="assemlyorders" element={<AssemblyOrders />} />
              <Route path="reports" element={<Reports />} />
              <Route path="employees" element={<Employees />} />  

            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;