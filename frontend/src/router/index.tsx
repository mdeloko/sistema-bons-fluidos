import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegistroPage from '../pages/RegistroPage';
import DashboardPage from '../pages/DashboardPage'; // Exemplo
// import AppLayout from '../components/Layout/AppLayout'; // Se tiver um layout principal

const isAuthenticated = () => !!localStorage.getItem('authToken'); // Exemplo

const ProtectedRoutes = () => {
  // Se usar um AppLayout que já tem o <Outlet />:
  // return isAuthenticated() ? <AppLayout /> : <Navigate to="/login" />;
  // Se AppLayout for só um wrapper e o Outlet fica aqui:
   return isAuthenticated() ? <div>{/* <Navbar /> */} <Outlet /> {/* <Footer /> */}</div> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/registro',
    element: <RegistroPage />,
  },
  {
    path: '/',
    element: <ProtectedRoutes />, // Este componente decide se mostra o Outlet ou redireciona
    children: [
      { index: true, element: <DashboardPage /> },
      // Adicione outras rotas protegidas aqui (produtos, estoque, etc.)
      // Ex: { path: 'products', element: <ProductsPage /> },
    ],
  },
  {
    path: '*', // Rota para qualquer caminho não encontrado
    element: <Navigate to="/" /> // Ou uma página <NotFoundPage />
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;