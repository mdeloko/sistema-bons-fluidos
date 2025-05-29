import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

// Interface para definir o que o contexto vai fornecer
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean; // Para saber se ainda estamos verificando o token inicial
  login: (newToken: string) => void;
  logout: () => void;
}

// Cria o Context com um valor inicial undefined (ou um valor default se preferir)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Provedor que envolverá parte da sua aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia carregando

  // Efeito para carregar o token do localStorage quando o AuthProvider é montado
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Aqui você poderia adicionar uma chamada para validar o token com o backend
      // se o token expira ou pode ser invalidado no servidor.
    }
    setIsLoading(false); // Finaliza o estado de carregamento inicial
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    // Geralmente, você também vai querer redirecionar para a tela de login aqui
    // Isso pode ser feito no componente que chama logout() usando useNavigate()
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto nos componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};