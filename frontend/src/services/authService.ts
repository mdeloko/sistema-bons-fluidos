// src/services/authService.ts
// Ele usa a biblioteca Axios para fazer requisições HTTP.
import axios from 'axios'; // <-- AGORA IMPORTAMOS O AXIOS DE VERDADE


const API_URL = 'http://localhost:3000/users'; // Ajuste esta porta/URL conforme o seu backend


// TODO: Verificar se o campo da senha no backend é 'password' ou 'senha', etc.
export interface RegisterData {
  name: string;
  email: string;
  ra: string;
  password: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  ra: string;
  password: string; 
}

export interface LoginResponse {
  token: string;
  user: {
    id: string; // TODO Se o backend retornar um ID (geralmente numérico ou UUID)
    ra: string;
    name: string;
    email: string;
    role: 'admin' | 'user'; // TODO Certifique-se de que o backend retorna a role
    // Adicione outras propriedades do usuário que o backend retornar
  };
}

/**
 * Registra um novo usuário no sistema, fazendo uma requisição real para o backend.
 * @param data Objeto com os dados do usuário para registro (RegisterData).
 * @returns Os dados da resposta do backend após o registro bem-sucedido.
 * @throws Error se a requisição falhar ou o backend retornar um erro.
 */
export const registerUser = async (data: RegisterData): Promise<any> => {
  try {
    const response = await axios.post<any>(`${API_URL}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao registrar o usuário.');
    }
    throw new Error('Erro desconhecido ao registrar o usuário.');
  }
};

/**
 * Realiza o login de um usuário no sistema, fazendo uma requisição real para o backend.
 * @param credentials Objeto com as credenciais de login (RA e senha - LoginCredential).
 * @returns A resposta do login, contendo o token e os dados do usuário (LoginResponse).
 * @throws Error se as credenciais forem inválidas ou ocorrer um erro no processo de login.
 */
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