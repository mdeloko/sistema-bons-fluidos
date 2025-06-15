// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, type LoginCredentials, type LoginResponse } from '../services/authService'; // <-- Importe LoginResponse
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Pega a função de login do AuthContext
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credentials: LoginCredentials = { ra, password };
      const response: LoginResponse = await loginUser(credentials); // <-- Tipagem para response
      login(response.token, response.user.role); // <-- ATUALIZADO: Passa token E role
      // O navigate é chamado dentro do login do AuthContext,
      // então não precisa aqui.
    } catch (err: any) {
      setError(err.message || 'Falha no login. Verifique seu RA e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>LOGIN</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          name="ra"
          placeholder="Digite seu RA"
          value={ra}
          onChange={(e) => setRa(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Digite sua Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Não tem uma conta? <Link to="/registro" className={styles.link}>Registrar-se</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;