// scr/services/authService.ts
import axios from 'axios';

//TODO - Adapte a URL real do back end
const API_URL = 'http://localhost:YOUR_BACKEND_PORT/api/auth';

export const registrarUsuario = async (dadosRegistro: any) => {
    //any deve ser substituido por uma interface mais específica
    //ex: interface RegistroData {email: string, ra: string, senha: string, ...}
    try{
        const response = await axios.post('${API_URL}/register', dadosRegistro);
        return response.data; //É esperado que o backend retorne os dados do usuário ou algum token
    }catch (error) {
        if (axios.isAxiosError(error) &&error.response) {
            throw new Error(error.response.data.message || 'Erro ao registrar o usuário.');
        }
        throw new Error('Erro desconhecido ao registrar o usuário.');
    }
};

export const loginUsuario = async (credenciais: any) => {
    //ex: interface LoginCredential { loginFiel: string, senha: string}
    try{
        const response = await axios.post('${API_URL}/login', credenciais);
        return response.data; //Espera-se que o backend retorne { token: 'seuTokenJWT', user: {...} }
    }catch (error) {
        if (axios.isAxiosError(error) &&error.response) {
            throw new Error(error.response.data.message || 'Erro ao fazer login.');
        }
        throw new Error('Erro desconhecido ao fazer login.');
    }
};
