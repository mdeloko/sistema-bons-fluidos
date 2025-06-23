import DBConnection from "../../utils/db.js";
import { CreateUserDTO, DeleteUserDTO, FullUserDTO, SafeUserDTO, UpdateUserEmailDTO, UpdateUserNameDTO, UpdateUserPasswordDTO } from "../dtos/userDtos.js";
import {QueryResult,QueryResultRow,DatabaseError} from "pg";
import { User } from "../entities/userEntity.js";

export class UserRepository{
    /**
     * Cria um usuário no banco de dados.
     * @param user Um objeto User com os dados do usuário a ser criado.
     * @returns O objeto do usuário criado.
     */
    public async create(user:User):Promise<User|null>{
        await using db = await DBConnection.connect()
        const {name,email,password,ra,isAdmin} = user;
        try{
            const rows = await db.query(
                "INSERT INTO usuarios (ra,email,nome,senha_hash,is_admin) VALUES ($1,$2,$3,$4,$5);",
                [ra,email,name,password,isAdmin]
            );
            if (rows.rowCount&&rows.rowCount>0) return user;
            return null
        }catch(error){
            if(error instanceof DatabaseError && error.code === "23505" /*unique_violation*/ ) {
                throw new Error("O RA/Email está em uso.")
            }
            throw new Error("Não foi possível criar usuário no BD.\nErro: "+error)
        }
        //TODO: Verificar quantidade de dados quando banco ficar pronto.
    }
    /**
     * Busca o usuário no banco de dados pelo seu registro acadêmico.
     * @param ra string contendo o R.A. a ser buscado.
     * @returns Um um objeto User com os dados do usuário encontrado, ou null caso não o encontre.
     */
    public async searchByRa(ra: string):Promise<User|null>{
        await using db = await DBConnection.connect()
        try{
            const rows = await db.query("SELECT * FROM usuarios WHERE ra = $1 ;",[ra]);
            if(rows && rows.rowCount){
                const {id,nome,ra,email, is_admin, senha_hash} = rows.rows[0] as unknown as {id:number,nome:string,ra:string,email:string,is_admin:boolean,senha_hash:string};
                const user = User.create(nome, email, ra, senha_hash, is_admin,id);
                return user;
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
     * @returns Um objeto User com os dados do usuário encontrado, ou null caso não o encontre.
     */
    public async searchByEmail(email:string):Promise<User|null>{
        await using db = await DBConnection.connect()
        try{
            const rows = await db.query("SELECT * FROM usuarios WHERE email = $1 ;",[email]);
            if(rows.rowCount && rows.rowCount>0){
                const {id,nome,ra,email, is_admin, senha_hash} = rows.rows[0] as unknown as {id:number,nome:string,ra:string,email:string,is_admin:boolean,senha_hash:string};
                const safeUser = User.create(nome, email, ra, senha_hash, is_admin,id);
                return safeUser;
            }
            return null;
        }catch(error){
            if(error instanceof DatabaseError){
                throw new Error("Erro: "+error.message);
            }
            throw new Error("Erro: "+error);
        }
    }
    public async searchById(id:number){
        await using db= await DBConnection.connect();
        try{
            const rows = await db.query("SELECT * FROM usuarios WHERE id = $1 ;",[id]);
            if(rows.rowCount && rows.rowCount>0){
                const {id,nome,ra,email, is_admin, senha_hash} = rows.rows[0] as unknown as {id:number,nome:string,ra:string,email:string,is_admin:boolean,senha_hash:string};
                const user = User.create(nome, email, ra, senha_hash, is_admin,id);
                return user;
            }
        }catch(error){
            throw new Error("Erro: "+error);
        }
    }
    /**
     * Atualiza o nome de um usuário.
     * @param user Um UpdateUserNameDTO com um dado a ser buscado e o nome a ser atualizado.
     * @returns Um objeto User com as novas informações caso de certo o update, ou null caso dê errado. 
     */
    public async updateName(user:User):Promise<boolean>{
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `UPDATE usuarios SET nome = $1 WHERE ra = $2`,
                [user.name,user.ra]
            );
            if(result.rowCount){
                return true;
            }
            return false;
        }catch(error){
            console.error("Erro:"+error)
            throw new Error("Não foi possível atualizar nome de usuário.")
        }
    }
    /**
     * Atualiza a senha de um usuário.
     * @param user Um objeto UpdateUserPasswordDTO com a senha nova a ser atualizada e o método de indentificação do usuário.
     * @returns Um objeto User caso a operação tenha sido realizada com sucesso, ou null caso não.
     */
    public async updatePassword(user:User):Promise<boolean>{
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `UPDATE users SET password = $1 WHERE ra = $2;`,
                [user.password,user.ra]
            );
            if(result.rowCount){
                return true;
            }
            return false;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível atualizar a senha do usuário.");
        }
    }
    /**
     * Atualiza o e-mail de um usuário.
     * @param user Um objeto UpdateUserEmailDTO com o email a ser atualizado e o método de identificação do Usuário.
     * @returns Um objeto User com as novas informações atualizadas.
     */
    public async updateEmail(user:User):Promise<boolean>{
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `UPDATE usuarios SET email = $1 WHERE ra = $2;`,
                [user.email,user.ra]
            );
            if(result.rowCount){
                return true;
            }
            return false;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível atualizar o e-mail do usuário.");
        }
    }

    public async updateRa(user:User){
        await using db = await DBConnection.connect();
        console.log(user)
        try{
            const result = await db.query(
                `UPDATE usuarios SET ra=$1 WHERE email=$2 ;`,
                [user.ra,user.email]
            )
            console.log(result)
            if(result.rowCount){
                return true;
            }
            return false;
        }catch(error){
            throw new Error("Erro: " + error);
        }
    }
    /**
     * Deleta usuário do banco de dados.
     * @param user Um objeto DeleteUserDTO com as informações para buscar o usuário a ser deletado.
     * @returns Um boolean true caso tenha sido possível, um false caso não tenha encontrado o usuário.
     */
    public async delete(user:User):Promise<boolean>{
        await using db = await DBConnection.connect();
        try{
            const result = await db.query(
                `DELETE FROM usuarios WHERE ra = $1 ;`,
                [user.ra]
            );
            console.log(result)
            if(result.rowCount){
                return true;
            }
            return false;
        }catch(error){
            console.error("Erro:"+error);
            throw new Error("Não foi possível deletar usuário.")
        }
    }

    public async listUsers(){
        await using db = await DBConnection.connect();
        const rows = await db.query("SELECT id,ra,nome,email,is_admin FROM usuarios;")
        if (rows.rowCount && rows.rowCount > 0) {
            return rows.rows;
        }
        return [];
    }
}