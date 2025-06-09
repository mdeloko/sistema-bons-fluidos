// src/api.ts
import axios from 'axios';

// *** AJUSTE ESTA URL PARA A DO SEU BACKEND REAL! ***
const API_BASE_URL = 'http://localhost:5000/api'; // Ex: 'http://localhost:3333/api' ou 'https://api.seusistema.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sessão expirada ou não autorizado. Redirecionando para a página de login...');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;