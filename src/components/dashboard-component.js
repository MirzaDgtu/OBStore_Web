import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Snackbar } from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import api from './api/api.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      // Предполагаем, что у нас есть эндпоинт для выхода
      await api.post('/user/signout');
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (err) {
      setError('Ошибка при выходе из системы');
    }
  };

  const navItems = [
    { label: 'Заказы', path: '/orders' },
    { label: 'Собранные заказы', path: '/completed-orders' },
    { label: 'Отчеты', path: '/reports' },
    { label: 'Сотрудники', path: '/employees' },
    { label: 'Профиль', path: '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Панель управления
          </Typography>
          {navItems.map((item) => (
            <Button key={item.path} color="inherit" onClick={() => navigate(item.path)}>
              {item.label}
            </Button>
          ))}
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </Box>
  );
};

export default Dashboard;
