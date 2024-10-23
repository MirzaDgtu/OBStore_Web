import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Snackbar, Grid, Paper, IconButton } from '@mui/material';
import { ExitToApp as LogoutIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import api from './api/api.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const [themeMode, setThemeMode] = useState('light');
  const [warehouseStats, setWarehouseStats] = useState({
    pickersOnline: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  const [pickerStats, setPickerStats] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') || 'light';
    setThemeMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const fetchWarehouseStats = async () => {
      try {
        const response = await api.get('/warehouse/stats');
        setWarehouseStats(response.data);
      } catch (err) {
        setError('Ошибка при загрузке данных склада');
      }
    };

    const fetchPickerStats = async () => {
      try {
        const response = await api.get('/warehouse/pickers');
        setPickerStats(response.data);
      } catch (err) {
        setError('Ошибка при загрузке статистики сборщиков');
      }
    };

    fetchWarehouseStats();
    fetchPickerStats();
  }, []);

  const handleLogout = async () => {
    try {
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

  const theme = createTheme({
    palette: {
      mode: themeMode,
      background: {
        default: themeMode === 'light' ? '#f4f6f8' : '#121212', // цвет фона для светлой и тёмной темы
        paper: themeMode === 'light' ? '#fff' : '#424242', // цвет для элементов типа Paper
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline применяет основные стили Material-UI */}
      <CssBaseline />
      {/* GlobalStyles позволяет настроить стили для всего body */}
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            minHeight: '100vh',
            margin: 0,
          },
        }}
      />
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
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Выйти
            </Button>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Информация о складе
                </Typography>
                <Typography>Сборщиков онлайн: {warehouseStats.pickersOnline}</Typography>
                <Typography>Общее количество заказов: {warehouseStats.totalOrders}</Typography>
                <Typography>Собранные заказы: {warehouseStats.completedOrders}</Typography>
                <Typography>Несобранные заказы: {warehouseStats.pendingOrders}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Статистика сборщиков
                </Typography>
                {pickerStats.length > 0 ? (
                  pickerStats.map((picker) => (
                    <Typography key={picker.id}>
                      {picker.name}: Собрано заказов - {picker.completedOrders}
                    </Typography>
                  ))
                ) : (
                  <Typography>Нет данных о сборщиках</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
          <Outlet />
        </Container>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
