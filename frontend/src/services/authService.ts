// src/services/authService.ts - VERSÃO PARA BACKEND REAL
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ex: 'http://localhost:3333/api/auth'

// interfaces de dados (RegisterData, LoginCredentials, LoginResponse) devem estar aqui e alinhadas ao backend.
export interface RegisterData { /* ... */ }
export interface LoginCredentials { /* ... */ }
export interface LoginResponse { /* ... */ }

export const registerUser = async (data: RegisterData): Promise<any> => {
  try {
    const response = await axios.post<any>(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao registrar o usuário.');
    }
    throw new Error('Erro desconhecido ao registrar o usuário.');
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao fazer login.');
    }
    throw new Error('Erro desconhecido ao fazer login.');
  }
};