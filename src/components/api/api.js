import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8090/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('Auth');
      window.location.href = '/users/signin';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/users/signin', { email, password });
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка входа');
  }
};

export const register = async (name, lastname, inn, email, password) => {
  try {
    const response = await api.post('/users/', { name, lastname, inn, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка регистрации');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки данных пользователя');
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка обновления профиля');
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки заказов');
  }
};

export const getCompletedOrders = async () => {
  try {
    const response = await api.get('/completed-orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки собранных заказов');
  }
};

export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки отчетов');
  }
};

export const getEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки данных сотрудников');
  }
};

export default api;
