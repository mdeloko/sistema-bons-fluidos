import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import {EHttpStatusCode as StatusCode} from "../@types/httpStatusCode.js";

// A SECRET deve ser uma variável de ambiente forte e complexa
export const SECRET = process.env.JWT_SECRET || "segredo";

/**
 * Valida uma senha.
 * @param pw String de Senha a ser testada
 * @returns true caso a senha seja validada, false caso contrário.
 */
export function validatePassword(pw: string): boolean {
    return(
        /[0-9]/.test(pw) &&
        /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /[!@#$%&*_]/.test(pw) && // Incluindo todos os símbolos que você listou
        pw.length >= 8
    );
}

/**
 * Valida um email usando uma expressão regular.
 * @param email String de Email a ser testada
 * @returns true caso o email seja validado, false caso contrário.
 */
export function validateEmail(email:string):boolean{
    const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    return emailRegex.test(email);
}

/**
 * Middleware para verificar tokens JWT em requisições.
 * Extrai o token do cabeçalho 'Authorization' (formato Bearer), verifica sua validade e autenticidade.
 * Se válido, anexa o userId ao objeto de requisição e prossegue.
 * Caso contrário, envia uma resposta de erro apropriada.
 * @param req Objeto de requisição Express.
 * @param res Objeto de resposta Express.
 * @param next Função para passar o controle para o próximo middleware.
 */
export function verifyJWT(req: Request, res: Response, next: Function) {
    const authHeader = req.headers['authorization']; // Captura o cabeçalho completo (ex: "Bearer <token>")

    // 1. Verifica se o cabeçalho Authorization foi fornecido
    if (!authHeader) {
        res.status(StatusCode.UNAUTHORIZED).json({
            message: "Token de autenticação não fornecido.",
            status: StatusCode.UNAUTHORIZED // Consistente com o status HTTP
        });
        return;
    }

    // 2. Extrai o token do formato "Bearer <token>"
    const tokenParts = authHeader.split(' ');
    // Verifica se tem duas partes E se a primeira parte é "Bearer"
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        res.status(StatusCode.UNAUTHORIZED).json({
            message: "Formato do token inválido. Use 'Bearer <token>'.",
            status: StatusCode.UNAUTHORIZED // Consistente com o status HTTP
        });
        return;
    }

    const actualToken = tokenParts[1]; // Esta é a string do JWT puro

    try {
        // 3. Tenta verificar o JWT puro com a SECRET
        // O '@ts-ignore' é usado porque 'req' não possui 'userId' por padrão.
        // Em um projeto real, você estenderia a interface 'Request' do Express.
        //@ts-ignore
        const decoded = jwt.verify(actualToken, SECRET);
        //@ts-ignore
        req.userId = decoded.userId; // Anexa o userId decodificado à requisição

        next(); // Passa o controle para o próximo middleware/rota
    } catch (err: any) { // Captura o erro da verificação JWT

        // Trata especificamente tokens expirados
        if (err instanceof jwt.JsonWebTokenError && err.name === "TokenExpiredError") {
            res.status(StatusCode.UNAUTHORIZED).json({
                message: "Token expirado, faça login novamente!",
                status: StatusCode.UNAUTHORIZED
            });
            return;
        }

        // Trata outros erros de JWT (assinatura inválida, etc.)
        res.status(StatusCode.UNAUTHORIZED).json({
            message: "Token inválido.",
            status: StatusCode.UNAUTHORIZED // Consistente com o status HTTP
        });
        return;
    }
}