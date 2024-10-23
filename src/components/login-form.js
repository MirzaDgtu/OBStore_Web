import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, IconButton, Snackbar } from '@mui/material';
import { Facebook, Twitter, Google, LinkedIn } from '@mui/icons-material';
import { styled } from '@mui/system';
import { login, register } from './api/api.js';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
  position: 'relative',
  overflow: 'hidden',
  width: '768px',
  maxWidth: '100%',
  minHeight: '480px',
}));

const SocialIcons = () => (
  <Box sx={{ my: 2 }}>
    <IconButton><Facebook /></IconButton>
    <IconButton><Twitter /></IconButton>
    <IconButton><Google /></IconButton>
    <IconButton><LinkedIn /></IconButton>
  </Box>
);

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [inn, setInn] = useState('')  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await register(name, lastname, inn, email, password);
        setSnackbarMessage('Регистрация прошла успешно. Пожалуйста, войдите в систему.');
        setSnackbarOpen(true);
        setIsSignUp(false);
      } else {
        const data = await login(email, password);
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <StyledBox>
      <Grid container component="main" sx={{ height: '100%' }}>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Typography component="h1" variant="h5">
            {isSignUp ? 'Регистрация' : 'Вход'}
          </Typography>
          <SocialIcons />
          <Typography variant="body2">
            или используйте email {isSignUp && 'для регистрации'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {isSignUp && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Имя"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />      
                    
            )}
            {isSignUp && (
            <TextField
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Отчество"
                name="lastname"
                autoComplete="lastname"
                autoFocus
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
            /> 
          )}
          {isSignUp && (
            <TextField
                margin="normal"
                required
                fullWidth
                id="inn"
                label="ИНН"
                name="inn"
                autoComplete="inn"
                autoFocus
                value={inn}
                onChange={(e) => setInn(e.target.value)}
            />  
             )}               
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email адрес"
              name="email"
              autoComplete="email"
              autoFocus={!isSignUp}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isSignUp ? 'Создать аккаунт' : 'Войти'}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ 
          backgroundColor: '#512da8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          color: 'white'
        }}>
          <Typography component="h1" variant="h5">
            {isSignUp ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
            {isSignUp 
              ? 'Если у вас уже есть аккаунт, войдите для доступа к нашим сервисам' 
              : 'Зарегистрируйтесь, чтобы получить доступ ко всем возможностям нашей платформы'}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setName('');
              setLastName('');
              setInn('');
              setEmail('');
              setPassword('');
            }}
          >
            {isSignUp ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      )}
    </StyledBox>
  );
};

export default LoginForm;
