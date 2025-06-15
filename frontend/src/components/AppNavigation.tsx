// src/components/AppNavigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css'; // Importe o CSS Module da Navbar

const AppNavigation: React.FC = () => {
  const { isAuthenticated, logout, userRole } = useAuth(); // <-- ATUALIZADO: Pega userRole
  const location = useLocation();

  const getLinkClassName = (path: string) => {
    return `${styles.navLink} ${location.pathname === path ? styles.activeLink : ''}`;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link to="/" className={styles.brandLink}>
          Bons Fluidos
        </Link>
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/" className={getLinkClassName('/')}>Home</Link>
        </li>
        {!isAuthenticated && (
          <>
            <li className={styles.navItem}>
              <Link to="/login" className={getLinkClassName('/login')}>Login</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/registro" className={getLinkClassName('/registro')}>Registro</Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <>
            <li className={styles.navItem}>
              <Link to="/dashboard" className={getLinkClassName('/dashboard')}>Dashboard</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/products" className={getLinkClassName('/products')}>Produtos</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/movements/new" className={getLinkClassName('/movements/new')}>Nova Movimentação</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/movements" className={getLinkClassName('/movements')}>Histórico Mov.</Link>
            </li>
            {/* --- NOVO LINK: Gerenciamento de Usuários (APENAS SE ADMIN) --- */}
            {userRole === 'admin' && ( // <-- SÓ MOSTRA SE userRole FOR 'admin'
              <li className={styles.navItem}>
                <Link to="/users" className={getLinkClassName('/users')}>Gerenciar Usuários</Link>
              </li>
            )}
          </>
        )}
      </ul>
      {isAuthenticated && (
        <button onClick={logout} className={styles.logoutButton}>Sair</button>
      )}
    </nav>
  );
};

export default AppNavigation;