import mariadb, {PoolConnection} from "mariadb";

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER
const password = process.env.DB_PASS
const database = process.env.DB_NAME

const pool = mariadb.createPool({
	host,
	user,
	password,
	connectionLimit: 5,
	database,
});

export default class DBConnection{
    private connection:PoolConnection;

    private constructor(connection:PoolConnection){
        this.connection = connection;
        console.log("Aberto o DB")
    }
    async [Symbol.asyncDispose](){
        if(this.connection){
            await this.connection.end()
            console.log("Conexão devolvida ao Pool.")
        }
    }
    async query<T=any>(sql:string,params?:any[]){
        return await this.connection.query<T>(sql,params);
    }
    async execute(sql:string,params?:any[]){
        return await this.connection.execute(sql,params);
    }
    static async connect():Promise<DBConnection>{
        const conn = await pool.getConnection();
        return new DBConnection(conn);
    }
}