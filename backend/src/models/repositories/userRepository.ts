import DBConnection from "../../utils/db.js";
import { CreateUserDTO, DeleteUserDTO, FullUserDTO, SafeUserDTO, UpdateUserEmailDTO, UpdateUserNameDTO, UpdateUserPasswordDTO } from "../dtos/userDtos.js";
import {QueryResult,QueryResultRow,DatabaseError} from "pg";

export class UserRepository{
    /**
     * Cria um usuário no banco de dados.
     * @param user Um CreateUserDTO com os dados do usuário a ser criado.
     * @returns O objeto do usuário criado sem a sua senha.
     */
    public async create(user:CreateUserDTO):Promise<SafeUserDTO>{
        await using db = await DBConnection.connect()
        const {name,email,password,ra,isAdmin} = user;
        try{
            await db.query(
                "INSERT INTO users (ra,email,name,pw_hash,\"isAdmin\") VALUES ($1,$2,$3,$4,$5);",
                [ra,email,name,password,isAdmin]
            );
            const safeUser:SafeUserDTO = {name,email,ra,isAdmin};
            return safeUser;
        }catch(error){
            if(error instanceof DatabaseError && error.code === "ER_DUP_ENTRY" ) {
                throw new Error("O RA/Email está em uso.")
            }
            throw new Error("Não foi possível criar usuário no BD.")
        }
        //TODO: Verificar quantidade de dados quando banco ficar pronto.
    }
    /**
     * Busca o usuário no banco de dados pelo seu registro acadêmico.
     * @param ra string contendo o R.A. a ser buscado.
     * @returns Um SafeUserDTO com os dados do usuário encontrado, ou null caso não o encontre.
     */
    public async searchByRa(ra: string):Promise<SafeUserDTO|null>{
        await using db = await DBConnection.connect()
        try{
            const rows = await db.query("SELECT * FROM users WHERE ra = $1 ;",[ra]);
            if(rows && rows.rowCount){
                const {name,ra,email,isAdmin} = rows.rows[0] as unknown as SafeUserDTO;
                const safeUser:SafeUserDTO = { name, ra, email, isAdmin };
                return safeUser;
            }
            return null;
        }catch(error){
            if(error instanceof DatabaseError){
                throw new Error("Erro: "+error.message);
            }
            throw new Error("Erro:"+error);
        }
    }
    /**
     * Busca o usuário no banco de dados pelo seu e-mail.
     * @param email string contendo o email a ser buscado.
     * @returns Um SafeUserDTO com os dados do usuário encontrado, ou null caso não o encontre.
     */
    public async searchByEmail(email:string):Promise<SafeUserDTO|null>{
        await using db = await DBConnection.connect()
        try{
            const rows = await db.query("SELECT * FROM users WHERE email = $1 ;",[email]);
            if(rows && rows.rowCount){
                const {name,ra,email, isAdmin} = rows.rows[0] as unknown as SafeUserDTO;
                const safeUser:SafeUserDTO = { name, ra, email, isAdmin };
                return safeUser;
            }
            return null;
        }catch(error){
            if(error instanceof DatabaseError){
                throw new Error("Erro: "+error.message);
            }
            throw new Error("Erro:"+error);
        }
    }
    /**
     * Atualiza o nome de um usuário.
     * @param user Um UpdateUserNameDTO com um dado a ser buscado e o nome a ser atualizado.
     * @returns Um SafeUserDTO com as novas informações caso de certo o update, ou null caso dê errado. 
     */
    public async updateName(user:UpdateUserNameDTO):Promise<SafeUserDTO|null>{
        const {name,email,ra} = user;
        const toConsult = ra||email;
        const id = ra ? 'ra' : 'email';
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `UPDATE users SET name = $1 WHERE ${id} = $2`,
                [name,toConsult]
            );
            if(result.rowCount){
                if(email){
                    const safeUser:SafeUserDTO = await this.searchByEmail(email) as SafeUserDTO
                    return safeUser;
                }else if(ra){
                    const safeUser:SafeUserDTO = await this.searchByRa(ra) as SafeUserDTO
                    return safeUser;
                }
            }
            return null;
        }catch(error){
            console.error("Erro:"+error)
            throw new Error("Não foi possível atualizar nome de usuário.")
        }
    }
    /**
     * Atualiza a senha de um usuário.
     * @param user Um objeto UpdateUserPasswordDTO com a senha nova a ser atualizada e o método de indentificação do usuário.
     * @returns Um objeto SafeUserDTO caso a operação tenha sido realizada com sucesso, ou null caso não.
     */
    public async updatePassword(user:UpdateUserPasswordDTO):Promise<SafeUserDTO|null>{
        const password = user.password;
        const toConsult = user.email || user.ra;
        const idMethod = user.ra ? "ra" : "email";
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `UPDATE users SET password = $1 WHERE ${idMethod} = $2;`,
                [password,toConsult]
            );
            if(result.rowCount){
                if(user.email){
                    const safeUser:SafeUserDTO = await this.searchByEmail(user.email) as SafeUserDTO;
                    return safeUser;
                }
                else if(user.ra){
                    const safeUser:SafeUserDTO = await this.searchByRa(user.ra) as SafeUserDTO;
                    return safeUser;
                }
            }
            return null;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível atualizar a senha do usuário.");
        }
    }
    /**
     * Atualiza o e-mail de um usuário.
     * @param user Um objeto UpdateUserEmailDTO com o email a ser atualizado e o método de identificação do Usuário.
     * @returns Um objeto SafeUserDTO com as novas informações atualizadas.
     */
    public async updateEmail(user:UpdateUserEmailDTO):Promise<SafeUserDTO|null>{
        const newEmail = user.newEmail;
        const toConsult = user.oldEmail || user.ra;
        const idMethod = user.ra ? "ra" : "email";
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `UPDATE users SET email = $1 WHERE ${idMethod} = $2;`,
                [newEmail,toConsult]
            );
            if(result.rowCount){
                if(user.oldEmail){
                    const safeUser:SafeUserDTO = await this.searchByEmail(user.newEmail) as SafeUserDTO;
                    return safeUser;
                }
                else if(user.ra){
                    const safeUser:SafeUserDTO = await this.searchByRa(user.ra) as SafeUserDTO;
                    return safeUser;
                }
            }
            return null;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível atualizar o e-mail do usuário.");
        }
    }
    /**
     * Deleta usuário do banco de dados.
     * @param user Um objeto DeleteUserDTO com as informações para buscar o usuário a ser deletado.
     * @returns Um boolean true caso tenha sido possível, um false caso não tenha encontrado o usuário.
     */
    public async delete(user:DeleteUserDTO):Promise<boolean>{
        const toDelete = user.ra || user.email;
        const idMethod = user.ra? "ra" : "email";
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `DELETE FROM users WHERE ${idMethod} = $1;`,
                [toDelete]
            );
            if(result.rowCount){
                return true;
            }
            return false;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível deletar usuário.")
        }
    }
}