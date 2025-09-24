import axios from 'axios'

const API_BASE_URL = 'https://kraties13.pythonanywhere.com/api';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/token/', { username, password });
    return response.data;
  },
  
  register: async ({ username, email, password, passwordConfirm, firstName = "", lastName = "" }) => {
  const response = await api.post('/register/', {
    username,
    email,
    password,
    password_confirm: passwordConfirm,
    first_name: firstName,            
    last_name: lastName               
  });
  return response.data;
},
  
  getProfile: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
};

// Funções para tarefas
export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get('/tasks/');
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}/`, taskData);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}/`);
    return response.data;
  },
  
  toggleCompleted: async (id) => {
    const response = await api.patch(`/tasks/${id}/toggle_completed/`);
    return response.data;
  },
};

export default api;

