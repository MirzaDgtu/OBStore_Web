import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Snackbar, Paper, IconButton, Grid2 } from '@mui/material';
import { ExitToApp as LogoutIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import api from '../api/api.js';
import Profile from '../dashboard/user-profile';
import Employees from '../dashboard/employees-component';
import Orders from '../dashboard/orders-component';

const StatsDisplay = ({ warehouseStats, pickerStats }) => (
  <Grid2 container spacing={3}>
    <Grid2 item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Информация о складе
        </Typography>
        <Box sx={{ '& > *': { mb: 1 } }}>
          <Typography>Сборщиков онлайн: {warehouseStats.pickersOnline}</Typography>
          <Typography>Общее количество заказов: {warehouseStats.totalOrders}</Typography>
          <Typography>Собранные заказы: {warehouseStats.completedOrders}</Typography>
          <Typography>Несобранные заказы: {warehouseStats.pendingOrders}</Typography>
        </Box>
      </Paper>
    </Grid2>

    <Grid2 item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
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
    </Grid2>
  </Grid2>
);

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

  const navItems = [
    { label: 'ЗАКАЗЫ', path: '/dashboard/orders' },
    { label: 'СОБРАННЫЕ ЗАКАЗЫ', path: '/dashboard/completed-orders' },
    { label: 'ОТЧЕТЫ', path: '/dashboard/reports' },
    { label: 'СОТРУДНИКИ', path: '/dashboard/employees' },
  ];

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

  const handleLogout = async () => {
    try {
      await api.post('/user/signout/');
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (err) {
      setError('Ошибка при выходе из системы');
    }
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

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#1976d2',
      },
      background: {
        default: themeMode === 'light' ? '#f4f6f8' : '#121212',
        paper: themeMode === 'light' ? '#fff' : '#424242',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            minWidth: 'auto',
            padding: '6px 16px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1976d2',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            '@media (min-width: 600px)': {
              padding: '0 24px',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            {navItems.map((item) => (
              <Button 
                key={item.path} 
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{ marginRight: 2 }}
              >
                {item.label}
              </Button>
            ))}
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/dashboard/profile')}
              sx={{ marginLeft: 1 }}
            >
              <SettingsIcon />
            </IconButton>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              startIcon={<LogoutIcon />}
              sx={{ marginLeft: 2 }}
            >
              ВЫЙТИ
            </Button>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<StatsDisplay warehouseStats={warehouseStats} pickerStats={pickerStats} />} />
            <Route path="/dashboard" element={<StatsDisplay warehouseStats={warehouseStats} pickerStats={pickerStats} />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/completed-orders" element={<div>Страница собранных заказов</div>} />
            <Route path="/dashboard/reports" element={<div>Страница отчетов</div>} />
            <Route path="/dashboard/employees" element={<Employees/>} />
          </Routes>
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