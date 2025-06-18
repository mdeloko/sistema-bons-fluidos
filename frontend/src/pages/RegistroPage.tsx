import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importa a função de registro E a interface RegisterData do authService
import { registerUser, type RegisterData } from '../services/authService';
// Você descomentaria o useAuth e login se quisesse fazer login automático após o registro
// import { useAuth } from '../contexts/AuthContext';

import styles from '../styles/RegistroPage.module.css';

// Definindo a interface para os dados do formulário que o componente RegistroPage gerencia.
// Inclui 'name', e 'password' para consistência, e 'confirmPassword' para validação.
interface FormData {
    name: string; // <--- NOVO CAMPO: Para o nome completo do usuário
    email: string;
    confirmarEmail: string; // Para a validação de confirmação de e-mail
    ra: string;
    password: string; // <--- ALTERADO: de 'senha' para 'password' para consistência
    confirmPassword: string; // <--- NOVO CAMPO: Para a confirmação da senha no frontend
}

const RegistroPage: React.FC = () => {
    const navigate = useNavigate();
    // const { login } = useAuth(); // Descomente e use se optar por login automático após registro

    // Estado inicial do formulário, incluindo os novos campos e a alteração de 'senha' para 'password'.
    const [formData, setFormData] = useState<FormData>({
        name: '', // <--- Inicialize o novo campo 'name'
        email: '',
        confirmarEmail: '',
        ra: '',
        password: '', // <--- Inicialize 'password'
        confirmPassword: '', // <--- Inicialize 'confirmPassword'
    });
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Handler genérico para atualizar o estado do formulário com base no 'name' do input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null); // Limpa mensagens de erro anteriores

        // --- Validações no Frontend ---
        if (formData.email !== formData.confirmarEmail) {
            setErro('Os e-mails não coincidem.');
            return;
        }

        if (formData.password.length < 6) { // Validação de comprimento mínimo para a senha
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (formData.password !== formData.confirmPassword) { // Validação de confirmação de senha
            setErro('A senha e a confirmação de senha não coincidem.');
            return;
        }

        // TODO: Adicionar outras validações de RA (ex: formato, se é apenas números, etc.) aqui, se necessário
        // Exemplo: if (!/^\d+$/.test(formData.ra)) { setErro('RA deve conter apenas números.'); return; }

        // --- Fim das Validações ---

        setLoading(true); // Ativa o estado de carregamento do botão

        try {
            // Cria o objeto de dados para enviar ao backend.
            // É CRÍTICO que este objeto corresponda EXATAMENTE à interface `RegisterData`
            // definida no seu `authService.ts`.
            const dadosParaEnviar: RegisterData = {
                name: formData.name, // <--- Incluído o campo 'name'
                email: formData.email,
                ra: formData.ra,
                password: formData.password,
                isAdmin: false, // <--- Agora é 'password', consistente com RegisterData
            };

            // Chama a função de registro do serviço de autenticação
            await registerUser(dadosParaEnviar);

            // --- Após o registro bem-sucedido ---
            alert('Registro realizado com sucesso! Agora faça o login.');
            navigate('/login'); // Redireciona para a página de login

            /*
            // --- Opção Opcional: Logar automaticamente após o registro ---
            // Se o seu backend retornar o token no response do registro, ou se você quiser
            // fazer uma chamada de login separada, descomente e adapte.
            // Certifique-se de que `useAuth` e `login` estejam descomentados no início do componente.
            // Exemplo:
            // if (response && response.token) { // Assumindo que registerUser retorna response com token
            //     login(response.token); // Usa a função de login do AuthContext
            //     alert('Registro e login realizados com sucesso!');
            //     navigate('/dashboard'); // Redireciona para o dashboard
            // } else {
            //     // Caso registerUser não retorne token, mas o backend permite login imediato
            //     // const loginResponse = await loginUser({ ra: formData.ra, password: formData.password }); // Use loginUser do authService
            //     // login(loginResponse.token); // Usa a função de login do AuthContext
            //     // alert('Registro e login realizados com sucesso!');
            //     // navigate('/dashboard');
            // }
            */

        } catch (error: any) {
            // Lida com erros da API, exibindo uma mensagem amigável para o usuário
            const errorMessage = error.response?.data?.message || error.message || 'Falha no registro. Tente novamente.';
            setErro(errorMessage);
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>REGISTRO</h2>
                {erro && <p className={styles.error}>{erro}</p>}

                {/* NOVO CAMPO: Nome Completo */}
                {/* Adicionado o input para o campo 'name' */}
                <input
                    type="text"
                    name="name" // O 'name' deve ser 'name' para corresponder à FormData
                    placeholder="Digite seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />

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
                    name="password" // <--- ALTERADO: name="password" (para consistência com formData.password)
                    placeholder="Crie sua Senha" // Texto mais indicativo
                    value={formData.password} // <--- AGORA É formData.password
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                {/* NOVO CAMPO: Confirmar Senha */}
                {/* Adicionado o input para o campo 'confirmPassword' */}
                <input
                    type="password"
                    name="confirmPassword" // <--- NOVO CAMPO: name="confirmPassword"
                    placeholder="Confirme sua Senha"
                    value={formData.confirmPassword} // <--- AGORA É formData.confirmPassword
                    onChange={handleChange}
                    required
                    className={styles.input}
                />

                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Já tem uma conta? <Link to="/login" className={styles.link}>Logar-se</Link>
                </p>
            </form>
        </div>
    );
};

export default RegistroPage;