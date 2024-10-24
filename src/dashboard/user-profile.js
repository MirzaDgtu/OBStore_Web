import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/api.js';

const Profile = () => {
  const [profile, setProfile] = useState({
    email: '',
    firstname: '',
    lastname: '',
    inn: '',
    phone: '',
    avatar: null,
  });

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/profile');
      setProfile(response.data);
    } catch (error) {
      setMessage('Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка размера файла (например, не более 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Размер файла не должен превышать 5 МБ');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setMessage('Пожалуйста, загрузите изображение');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/user/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(prev => ({
        ...prev,
        avatar: response.data.avatarUrl,
      }));
      setMessage('Аватар успешно обновлен');
    } catch (error) {
      setMessage('Ошибка при загрузке аватара');
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await api.post('/user/avatar/delete');
      setProfile(prev => ({
        ...prev,
        avatar: null,
      }));
      setMessage('Аватар успешно удален');
    } catch (error) {
      setMessage('Ошибка при удалении аватара');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (!profile.firstname) {
      newErrors.firstname = 'Имя обязательно';
    }
    
    if (!profile.inn) {
      newErrors.inn = 'ИНН обязателен';
    } else if (!/^\d{10}$|^\d{12}$/.test(profile.inn)) {
      newErrors.inn = 'ИНН должен содержать 10 или 12 цифр';
    }
    
    if (!profile.phone) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^\+7\d{10}$/.test(profile.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.put('/user/profile', profile);
      setMessage('Профиль успешно обновлен');
    } catch (error) {
      setMessage('Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      await api.post('/user/password', {
        newPassword: passwords.newPassword,
      });
      setMessage('Пароль успешно изменен');
      setOpenPasswordDialog(false);
      setPasswords({
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage('Ошибка при изменении пароля');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
          Профиль пользователя
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.avatar}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {profile.firstname ? profile.firstname[0].toUpperCase() : '?'}
            </Avatar>
            <Box sx={{ 
              position: 'absolute', 
              bottom: 16, 
              right: -16, 
              display: 'flex', 
              gap: 1 
            }}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleAvatarUpload}
                  ref={fileInputRef}
                />
                <PhotoCamera />
              </IconButton>
              {profile.avatar && (
                <IconButton
                  onClick={handleAvatarDelete}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Имя"
                name="firstname"
                value={profile.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Отчество"
                name="lastname"
                value={profile.lastname}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ИНН"
                name="inn"
                value={profile.inn}
                onChange={handleChange}
                error={!!errors.inn}
                helperText={errors.inn}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={loading}
                placeholder="+79001234567"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              Сохранить изменения
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenPasswordDialog(true)}
              disabled={loading}
            >
              Изменить пароль
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Изменение пароля</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Новый пароль"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Подтверждение пароля"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} sx={{ color: '#1976d2' }}>
            ОТМЕНА
          </Button>
          <Button onClick={handlePasswordChange} sx={{ color: '#1976d2' }}>
            СОХРАНИТЬ
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Container>
  );
};

export default Profile;