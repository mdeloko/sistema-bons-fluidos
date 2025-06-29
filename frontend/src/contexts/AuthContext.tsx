// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Interface para definir o que o contexto de autenticação vai
// fornecer.
// Isso garante que o TypeScript saiba quais propriedades estão
// disponíveis para quem usar 'useAuth'.
interface AuthContextType {
  isAuthenticated: boolean; // Indica se o usuário está logado (true
  // se houver um token)
  token: string | null; // Armazena o token JWT. Será null se o
  // usuário não estiver logado.
  isLoading: boolean; // Indica se o provedor ainda está
  // verificando o token inicial (ex: do localStorage).
  userRole: 'admin' | 'user' | null; // Role do usuário logado
  login: (newToken: string, userRole: 'admin' | 'user') => void; // Função para efetuar o login,
  // recebendo o token JWT e a role.
  logout: () => void; // Função para efetuar o logout do
  // usuário.
}

// 2. Criação do Contexto.
// O valor inicial é 'undefined' para que o hook 'useAuth' possa
// verificar se está sendo usado
// fora de um 'AuthProvider' e lançar um erro apropriado.
const AuthContext = createContext<AuthContextType |
  undefined>(undefined);

// 3. Props para o componente AuthProvider.
// 'children' é usado para renderizar os componentes filhos que serão
// envolvidos pelo provedor.
interface AuthProviderProps {
  children: ReactNode;
}

// 4. Componente AuthProvider.
// Ele é responsável por gerenciar o estado global de autenticação da
// aplicação.
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estado 'token': Armazena o token JWT.
  // Inicialmente, tenta recuperar o token do localStorage (para
  // persistência de sessão).
  const [token, setToken] = useState<string |
    null>(localStorage.getItem('authToken'));
  // Estado 'userRole': Armazena a role do usuário.
  // Inicialmente, tenta recuperar do localStorage.
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(
    localStorage.getItem('userRole') as 'admin' | 'user' || null
  );
  // Estado 'isLoading': Gerencia o estado de carregamento inicial.
  // Começa como 'true' porque o provedor precisa verificar o
  // localStorage.
  const [isLoading, setIsLoading] = useState(true);
  // Hook 'useNavigate': Permite a navegação programática
  // (redirecionar o usuário).
  const navigate = useNavigate();

  // 5. Efeito colateral para gerenciar o token e a role no localStorage.
  // Este useEffect é executado uma vez na montagem do componente,
  // e sempre que o 'token' mudar.
  useEffect(() => {
    // Se há um token no estado, salva-o no localStorage.
    if (token) {
      localStorage.setItem('authToken', token);
      if (userRole) { // Salva a role se houver
        localStorage.setItem('userRole', userRole);
      }
    } else {
      // Se não há token (ex: após logout), remove-o do localStorage.
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole'); // Remove a role também
    }
    // Uma vez que a verificação inicial do localStorage foi feita, o
    // carregamento inicial termina.
    setIsLoading(false);
  }, [token, userRole]); // Dependências: Roda novamente se token ou userRole mudarem

  // 6. Função 'login':
  // Chamada para autenticar o usuário. Recebe o novo token JWT do
  // backend e a role.
  const login = (newToken: string, role: 'admin' | 'user') => { // <-- Recebe a role
    setToken(newToken); // Atualiza o estado do token. O useEffect
    // acima cuidará do localStorage.
    setUserRole(role); // Define a role.
    navigate('/dashboard'); // Redireciona o usuário para o dashboard
    // após o login.
  };

  // 7. Função 'logout':
  // Chamada para desautenticar o usuário.
  const logout = () => {
    setToken(null); // Limpa o token do estado. O useEffect acima
    // cuidará do localStorage.
    setUserRole(null); // Limpa a role do estado.
    navigate('/login'); // Redireciona o usuário para a página de
    // login.
  };

  // 8. O Provedor renderiza seus filhos e passa o objeto de contexto.
  // 'isAuthenticated' é um booleano que é 'true' se 'token' não for
  // null ou string vazia.
  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, isLoading, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 9. Hook customizado 'useAuth':
// Facilita o consumo do contexto de autenticação por qualquer
// componente funcional.
export const useAuth = () => {
  const context = useContext(AuthContext); // Tenta acessar o
  // contexto.
  // Se o contexto for 'undefined', significa que o hook foi usado
  // fora de um 'AuthProvider'.
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context; // Retorna o objeto completo do contexto (estado e
  // funções).
};