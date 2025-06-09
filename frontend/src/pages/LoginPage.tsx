import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, type LoginCredentials } from '../services/authService'; // Use loginUser e tipagem
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho se necessário
import styles from '../styles/LoginPage.module.css'; // Ajuste o caminho se necessário

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Pega a função de login do AuthContext

  const [ra, setRa] = useState(''); // Estado para o RA
  const [password, setPassword] = useState(''); // Estado para a senha
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    setError(null);    // Limpa erros anteriores
    setLoading(true);  // Ativa o estado de carregamento

    try {
      const credentials: LoginCredentials = { ra, password }; // Cria o objeto de credenciais
      const response = await loginUser(credentials); // Chama a função de login do serviço
      login(response.token); // Chama a função login do AuthContext para salvar o token e redirecionar
      // O navigate é chamado dentro do login do AuthContext, então não precisa aqui.
    } catch (err: any) {
      setError(err.message || 'Falha no login. Verifique seu RA e senha.');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>LOGIN</h2>
        {error && <p className={styles.error}>{error}</p>} {/* Exibe mensagens de erro */}
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
          name="password" // Nome do campo para a senha
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