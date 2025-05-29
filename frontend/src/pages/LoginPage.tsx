// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authService'; // Ajuste o caminho
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho
import styles from '../styles/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Função do seu AuthContext

  const [loginField, setLoginField] = useState(''); // Pode ser email ou RA
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // O backend precisa saber se está recebendo email ou RA,
      // ou você pode ter um campo único que o backend resolve.
      // Exemplo simples:
      const response = await loginUsuario({ loginField, senha });
      login(response.token); // Salva o token no AuthContext e localStorage
      navigate('/'); // Navega para a página principal/dashboard
    } catch (error: any) {
      setErro(error.message || 'Falha no login.');
    } finally {
      setLoading(false);
    }
  };


  return (
   <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>LOGIN</h2>
        {erro && <p className={styles.error}>{erro}</p>}
        <input
          type="text" // Pode ser 'email' ou 'text' se aceitar RA
          name="loginField"
          placeholder="Digite seu E-mail ou RA"
          value={loginField}
          onChange={(e) => setLoginField(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="senha"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          Não tem uma conta? <Link to="/registro" className={styles.link}>Registrar-se</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;