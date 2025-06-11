import DBConnection from "../../utils/db.js";
import { CreateUserDTO, DeleteUserDTO, FullUserDTO, SafeUserDTO, UpdateUserEmailDTO, UpdateUserNameDTO, UpdateUserPasswordDTO } from "../dtos/userDtos.js";
import {SqlError,UpsertResult} from "mariadb";

export class UserRepository{
    /**
     * Cria um usuário no banco de dados.
     * @param user Um CreateUserDTO com os dados do usuário a ser criado.
     * @returns O objeto do usuário criado sem a sua senha.
     */
    public static async create(user:CreateUserDTO):Promise<SafeUserDTO>{
        await using db = await DBConnection.connect()
        const {name,email,password,ra} = user;
        try{
            await db.query(
                "INSERT INTO users (ra,email,name,password) VALUES (?,?,?,?);",
                [ra,email,name,password]
            );
            const safeUser:SafeUserDTO = {name,email,ra};
            return safeUser;
        }catch(error){
            if(error instanceof SqlError && error.code === "ER_DUP_ENTRY" ) {
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
    public static async searchByRa(ra: string):Promise<SafeUserDTO|null>{
        await using db = await DBConnection.connect()
        try{
            const rows:FullUserDTO[] = await db.query("SELECT * FROM users WHERE ra = ? ;",[ra]);
            if(rows && rows.length > 0){
                const {name,ra,email} = rows[0];
                const safeUser:SafeUserDTO = { name, ra, email };
                return safeUser;
            }
            return null;
        }catch(error){
            if(error instanceof SqlError){
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
    public static async searchByEmail(email:string):Promise<SafeUserDTO|null>{
        await using db = await DBConnection.connect()
        try{
            const rows: FullUserDTO[] = await db.query("SELECT * FROM users WHERE email = ? ;",[email]);
            if(rows && rows.length > 0){
                const {name,ra,email} = rows[0];
                const safeUser:SafeUserDTO = { name, ra, email };
                return safeUser;
            }
            return null;
        }catch(error){
            if(error instanceof SqlError){
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
    public static async updateName(user:UpdateUserNameDTO):Promise<SafeUserDTO|null>{
        const {name,email,ra} = user;
        const toConsult = ra||email;
        const id = ra ? 'ra' : 'email';
        await using db = await DBConnection.connect();
        try{
            const result:UpsertResult = await db.query(
                `UPDATE users SET name = ? WHERE ${id} = ?`,
                [name,toConsult]
            );
            if(result.affectedRows > 0 ){
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
    public static async updatePassword(user:UpdateUserPasswordDTO):Promise<SafeUserDTO|null>{
        const password = user.password;
        const toConsult = user.email || user.ra;
        const idMethod = user.ra ? "ra" : "email";
        await using db = await DBConnection.connect();
        try{
            const result:UpsertResult = await db.query(
                `UPDATE users SET password = ? WHERE ${idMethod} = ?;`,
                [password,toConsult]
            );
            if(result.affectedRows > 0){
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
    public static async updateEmail(user:UpdateUserEmailDTO):Promise<SafeUserDTO|null>{
        const newEmail = user.newEmail;
        const toConsult = user.oldEmail || user.ra;
        const idMethod = user.ra ? "ra" : "email";
        await using db = await DBConnection.connect();
        try{
            const result:UpsertResult = await db.query(
                `UPDATE users SET email = ? WHERE ${idMethod} = ?;`,
                [newEmail,toConsult]
            );
            if(result.affectedRows > 0){
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
    public static async delete(user:DeleteUserDTO):Promise<boolean>{
        const toDelete = user.ra || user.email;
        const idMethod = user.ra? "ra" : "email";
        await using db = await DBConnection.connect();
        try{
            const result:UpsertResult = await db.query(
                `DELETE FROM users WHERE ${idMethod} = ?;`,
                [toDelete]
            );
            if(result.affectedRows>0){
                return true;
            }
            return false;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível deletar usuário.")
        }
    }
}