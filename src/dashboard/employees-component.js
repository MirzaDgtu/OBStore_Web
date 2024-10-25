import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Badge,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
  Block as BlockIcon,
  FiberManualRecord as OnlineIcon,
  PhotoCamera,
} from '@mui/icons-material';
import api from '../api/api.js';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    inn: '',
    blocked: false,
    avatar: null
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setEmployees(response.data);
    } catch (error) {
      setMessage('Ошибка при загрузке списка сотрудников');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, employee = null) => {
    setDialogMode(mode);
    setSelectedEmployee(employee);
    if (employee) {
      setFormData({
        email: employee.email,
        firstname: employee.firstname,
        lastname: employee.lastname,
        phone: employee.phone,
        inn: employee.inn || '',
        blocked: employee.blocked,
        avatar: employee.avatar
      });
    } else {
      setFormData({
        email: '',
        firstname: '',
        lastname: '',
        phone: '',
        inn: '',
        blocked: false,
        avatar: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setFormData({
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      inn: '',
      blocked: false,
      avatar: null
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email обязателен';
    if (!formData.firstname) errors.firstname = 'Имя обязательно';
    if (!formData.phone) errors.phone = 'Телефон обязателен';
    if (!formData.inn) errors.inn = 'ИНН обязателен';
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      if (dialogMode === 'add') {
        await api.post('/users', formData);
        setMessage('Сотрудник успешно добавлен');
      } else {
        await api.put(`/users/${selectedEmployee.ID}`, formData);
        setMessage('Данные сотрудника обновлены');
      }
      handleCloseDialog();
      fetchEmployees();
    } catch (error) {
      setMessage('Ошибка при сохранении данных');
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return;
    }

    try {
      await api.post(`/users/${employeeId}/delete`);
      setMessage('Сотрудник успешно удален');
      fetchEmployees();
    } catch (error) {
      setMessage('Ошибка при удалении сотрудника');
    }
  };

  const handleBlockToggle = async (employee) => {
    try {
      await api.post(`/users/${employee.ID}/block`, {
        blocked: !employee.blocked
      });
      setMessage(employee.blocked ? 'Сотрудник разблокирован' : 'Сотрудник заблокирован');
      fetchEmployees();
    } catch (error) {
      setMessage('Ошибка при изменении статуса блокировки');
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
      await api.post('/user/update/pass', {
        id: selectedEmployee.ID,
        password: passwords.newPassword
      });
      setMessage('Пароль успешно изменен');
      setOpenPasswordDialog(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Ошибка при изменении пароля');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Размер файла не должен превышать 5 МБ');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage('Пожалуйста, загрузите изображение');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post(`/users/${selectedEmployee.ID}/avatar/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
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
      await api.post(`/users/${selectedEmployee.ID}/avatar/delete`);
      setFormData(prev => ({
        ...prev,
        avatar: null,
      }));
      setMessage('Аватар успешно удален');
    } catch (error) {
      setMessage('Ошибка при удалении аватара');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ color: 'primary.main' }}>
            Сотрудники
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Добавить
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аватар</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>ИНН</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Блокировка</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.ID}>
                  <TableCell>
                    <Avatar
                      src={employee.avatar}
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40
                      }}
                    >
                      {employee.firstname ? employee.firstname[0].toUpperCase() : '?'}
                    </Avatar>
                  </TableCell>
                  <TableCell>{employee.ID}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.firstname}</TableCell>
                  <TableCell>{employee.lastname}</TableCell>
                  <TableCell>{employee.inn}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="dot"
                      color={employee.loggedin ? "success" : "error"}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <OnlineIcon fontSize="small" />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!employee.blocked}
                      onChange={() => handleBlockToggle(employee)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog('edit', employee)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setOpenPasswordDialog(true);
                        }}
                      >
                        <KeyIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(employee.ID)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Диалог добавления/редактирования сотрудника */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Добавить сотрудника' : 'Редактировать данные сотрудника'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {dialogMode === 'edit' && (
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={formData.avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem',
                  }}
                >
                  {formData.firstname ? formData.firstname[0].toUpperCase() : '?'}
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
                    />
                    <PhotoCamera />
                  </IconButton>
                  {formData.avatar && (
                    <IconButton
                      onClick={handleAvatarDelete}
                      sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Имя"
              name="firstname"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Фамилия"
              name="lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            <TextField
              fullWidth
              label="ИНН"
              name="inn"
              value={formData.inn}
              onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="8-XXX-XXX-XX-XX"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#1976d2' }}>
            ОТМЕНА
          </Button>
          <Button onClick={handleSubmit} sx={{ color: '#1976d2' }}>
            {dialogMode === 'add' ? 'ДОБАВИТЬ' : 'СОХРАНИТЬ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог смены пароля */}
{/* Диалог смены пароля */}
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

export default Employees;
              