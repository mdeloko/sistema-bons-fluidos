// src/api.ts
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:5000/api'; // Ajuste esta porta/URL conforme o seu backend

// Cria uma instância do Axios com a URL base e cabeçalhos padrão.
// Todas as requisições feitas com esta instância 'api' terão esses padrões.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Informa que o corpo da requisição será JSON
  },
});

// --- Interceptador de Requisições ---
// Este interceptador será executado ANTES de cada requisição ser enviada.
// Sua função principal é adicionar o token JWT de autenticação ao cabeçalho 'Authorization'.
api.interceptors.request.use(
  (config) => {
    // Tenta recuperar o token de autenticação do localStorage.
    // Presume-se que seu AuthContext o salvou como 'authToken'.
    const token = localStorage.getItem('authToken');
    // Se um token for encontrado, ele é adicionado ao cabeçalho 'Authorization'.
    // O formato padrão para JWT é 'Bearer [token]'.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Retorna a configuração da requisição, que agora inclui o token (se disponível).
    return config;
  },
  (error) => {
    // Lida com erros que ocorrem antes da requisição ser enviada (ex: erro de rede local).
    return Promise.reject(error);
  }
);

// --- Interceptador de Respostas ---
// Este interceptador será executado DEPOIS que uma resposta for recebida do servidor.
// Ele é crucial para tratar erros globais, como sessões expiradas (status HTTP 401).
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida (status 2xx), apenas a retorna.
    return response;
  },
  (error) => {
    // Verifica se o erro é um erro de resposta do Axios e se o status é 401 (Não Autorizado).
    if (error.response && error.response.status === 401) {
      console.warn('Sessão expirada ou não autorizado. Redirecionando para a página de login...');
      // Remove o token inválido ou expirado do localStorage.
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole'); // Remova a role também
      // Redireciona o usuário para a página de login.
      // `window.location.href` força um recarregamento da página, que é uma forma simples
      // de garantir que o estado de autenticação seja resetado. Em aplicações maiores,
      // você poderia disparar um evento global para o AuthContext lidar com isso.
      window.location.href = '/login';
    }
    // Rejeita a Promise para que o erro possa ser capturado pelo código que chamou a API.
    return Promise.reject(error);
  }
);

export default api; // Exporta a instância configurada do Axios para uso em outros módulos.