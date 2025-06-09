// src/components/AppNavigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // <-- IMPORTE useLocation
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css'; // Importe o CSS Module para os estilos da Navbar

const AppNavigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation(); // <-- OBTÉM O OBJETO DE LOCALIZAÇÃO ATUAL

  // Função auxiliar para verificar se o link atual é o ativo
  const getLinkClassName = (path: string) => {
    // Retorna a classe 'navLink' padrão e, se for o caminho ativo, adiciona 'activeLink'
    return `${styles.navLink} ${location.pathname === path ? styles.activeLink : ''}`;
  };

  return (
    <nav className={styles.navbar}>
      {/* SEÇÃO DO TÍTULO / LOGO DO SISTEMA */}
      <div className={styles.navbarBrand}> {/* <-- NOVA DIV PARA O TÍTULO/LOGO */}
        <Link to="/" className={styles.brandLink}> {/* Link para a home */}
          Bons Fluidos
        </Link>
      </div>

      {/* Links de navegação */}
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/" className={getLinkClassName('/')}>Home</Link> {/* <-- USANDO getLinkClassName */}
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
          </>
        )}
      </ul>

      {/* Botão de Sair */}
      {isAuthenticated && (
        <button onClick={logout} className={styles.logoutButton}>Sair</button>
      )}
    </nav>
  );
};

export default AppNavigation;