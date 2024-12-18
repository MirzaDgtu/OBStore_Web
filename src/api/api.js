import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8090/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Добавляем поддержку credentials
  withCredentials: true  // Важное изменение - позволяет отправлять куки
});

// Интерцептор для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Auth');
    if (token) {     
      config.headers['Authorization'] = `Bearer ${token}`;
      // Добавляем куку
      document.cookie = `Auth=${token}; path=/`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок остается тем же
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('Auth');
      localStorage.removeItem('User');
      // Удаляем куку при разлогине
      document.cookie = 'Auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/users/signin', { email, password });
    const { token } = response.data;
    
    // Сохраняем в localStorage
    localStorage.setItem('Auth', token);
    localStorage.setItem('User', JSON.stringify(response.data));
    
    // Сохраняем в куки
    document.cookie = `Auth=${token}; path=/`;
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка входа');
  }
};

export const register = async (firstname, lastname, inn, email, password) => {  
  try {
    const response = await api.post('/users', { firstname, lastname, inn, email,  pass: password });
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

export const getOrdersByDateRange = async (startDate, endDate) => {
  try {
    let url = '/orders';
    if (startDate && endDate) {
      url = `/orders?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки заказов');
  }
};

export const getOrders = async () => {
  try {
    let url = '/orders';    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки заказов');
  }
};

export const getAssemblyOrders = async (startDate, endDate) => {
  try {
    let url = '/assembly-orders';
    if (startDate && endDate) {
      url = `/assembly-orders?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(url, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки собранных заказов');
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/order/find/id/?id=${orderId}`,
                                 { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки деталей заказа');
  }
};

export const updateOrder = async (id, data) => {
  try {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка обновления заказа');
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка удаления заказа');
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
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки данных сотрудников');
  }
};

// Новые методы для работы с пользователями
export const updateUserPassword = async (id, password) => {
  try {
    console.log(axios.config)

    const response = await api.post('/user/update/pass', { id, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка изменения пароля');
  }
};

export const blockUser = async (userId, blocked) => {
  try {
    const response = await api.post(`/user/${userId}/block`, { blocked }, {
      withCredentials: true  // Убедимся, что куки отправляются
    });

    console.log(response)

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при изменении статуса блокировки');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.post(`/users/${id}/delete`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка удаления пользователя');
  }
};

export const uploadUserAvatar = async (id, avatarData) => {
  try {
    const response = await api.post(`/users/${id}/avatar/upload`, avatarData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка загрузки аватара');
  }
};

export const deleteUserAvatar = async (id) => {
  try {
    const response = await api.post(`/users/${id}/avatar/delete`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка удаления аватара');
  }
};


export default api;