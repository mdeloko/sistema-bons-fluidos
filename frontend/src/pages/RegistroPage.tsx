import React, { useState }from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/authService'; // Ajuste o caminho: import { useAuth } from '../contexts/AuthContext'; 
// // Se for logar direto após registro
import styles from '../styles/RegistroPage.module.css';


//Definindo uma interface para os dados do formulário
interface FormData{
    email: string;
    confirmarEmail: string;
    ra: string;
    senha: string;
}

const RegistroPage: React.FC = () => {
    const navigate = useNavigate();
    // const {login} = useAuth(); // Se for logar direto

    const [formData, setFormData] = useState<FormData>({
        email: '',
        confirmarEmail: '',
        ra: '',
        senha: '',
    });
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (formData.email !== formData.confirmarEmail) {
      setErro('Os e-mails não coincidem.');
      return;
    }
    //TODO adicionar outras validações? (ex: RA, força da senha)

    setLoading(true);

    try{
        //TODO ajustar os dados enviados conforme o back espera
        const dadosParaEnviar = {
            email: formData.email,
            ra: formData.ra,
            senha: formData.senha,
        };
        await registrarUsuario(dadosParaEnviar);
        //Após o registro bem-sucedido
        // Opção 1: Navegar para o login
        alert('Registro realizado com sucesso! Faça o login.');
        navigate('/login');

      // Opção 2: Logar automaticamente (se o backend retornar um token no registro)
      // const loginData = await loginUsuario({ loginField: formData.email, senha: formData.senha });
      // login(loginData.token);
      // navigate('/');
    } catch (error: any) {
        setErro(error.message || 'Falha no registro.');
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>REGISTRO</h2>
        {erro && <p className={styles.error}>{erro}</p>}
        <input
          type="email"
          name="email"
          placeholder="Digite seu E-mail"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="confirmarEmail"
          placeholder="Confirme seu E-mail"
          value={formData.confirmarEmail}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text" // ou number, dependendo do formato do RA
          name="ra"
          placeholder="Digite seu RA"
          value={formData.ra}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="senha"
          placeholder="Digite sua Senha"
          value={formData.senha}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          Já tem uma conta? <Link to="/login" className={styles.link}>Logar-se</Link>
        </p>
      </form>
    </div>
  );
};

export default RegistroPage;