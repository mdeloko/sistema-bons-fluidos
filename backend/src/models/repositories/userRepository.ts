import DBConnection from "../../utils/db.js";
import { CreateUserDTO, FullUserDTO, SafeUserDTO, UpdateUserNameDTO } from "../dtos/userDtos.js";
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
     * 
     * @param user Um UpdateUserNameDTO com um dado a ser buscado e o nome a ser atualizado.
     * @returns 
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
                    const newSafeUser:SafeUserDTO = await this.searchByEmail(email) as SafeUserDTO
                    return newSafeUser;
                }else if(ra){
                    const newSafeUser:SafeUserDTO = await this.searchByRa(ra) as SafeUserDTO
                    return newSafeUser;
                }
            }
            return null;
        }catch(error){
            console.error("Erro:"+error)
            throw new Error("Não foi possível atualizar nome de usuário.")
        }
    }
    public static async delete(){

    }
}