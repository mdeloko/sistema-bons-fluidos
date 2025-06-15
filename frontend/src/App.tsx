// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Remova Link, se não usar aqui
import { AuthProvider } from './contexts/AuthContext'; // Ajuste o caminho
import PrivateRoute from './components/PrivateRoute'; // Ajuste o caminho
import AppNavigation from './components/AppNavigation.tsx'; // **Importe o novo componente AppNavigation**

// Importe as páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistroPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import NewMovementPage from './pages/NewMovementPage';
import CreateProductPage from './pages/CreateProductPage.tsx';
import EditProductPage from './pages/EditProductPage.tsx';
import MovementsHistoryPage from './pages/MovementsHistoryPage.tsx';
import UserManagementPage from './pages/UserManagementPage.tsx';

function App() {
  return (
      <AuthProvider>
        <AppNavigation /> {/* Use o componente aqui */}
        {/* O container para as rotas */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 60px)' }}> {/* Garante que o conteúdo das rotas preencha o espaço abaixo da navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            {/* Rotas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<CreateProductPage />} />
              <Route path="/movements/new" element={<NewMovementPage />} />
              <Route path="/movements" element={<MovementsHistoryPage />} /> 
              <Route path="/products/edit/:id" element={<EditProductPage />} />
              <Route path="/users" element={<UserManagementPage />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>

  );
}

export default App;