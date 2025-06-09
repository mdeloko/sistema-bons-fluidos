import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho se necessário

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth(); // Pega o status de autenticação e carregamento

  // Se ainda estiver carregando (verificando o token inicial), você pode mostrar um spinner
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>;
  }

  // Se não estiver autenticado e não estiver mais carregando, redireciona para a página de login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;