import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router'; // Ou o caminho para seu componente de rotas
import { AuthProvider } from './contexts/AuthContext'; // Importe o AuthProvider
import './styles/index.css'; // Seus estilos globais

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* Envolva o AppRouter (ou seu App principal) com o AuthProvider */}
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>,
);