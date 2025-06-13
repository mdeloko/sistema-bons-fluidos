import {Pool, PoolClient, QueryResultRow, QueryResult} from "pg";

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER
const password = process.env.DB_PASS
const database = process.env.DB_NAME
const port = Number(process.env.DB_PORT) || 5432

const pool = new Pool({
	host,
	user,
	password,
	database,
    port,
	max: 5,
});

export default class DBConnection{
    private connection:PoolClient;

    private constructor(connection:PoolClient){
        this.connection = connection;
        console.log("Aberto conexão com BD.")
    }
    async [Symbol.asyncDispose](){
        if(this.connection){
            await this.connection.release();
            console.log("Conexão devolvida ao Pool.");
        }
    }
    async query<T=any>(sql:string,params?:any[]){
        return await this.connection.query<QueryResult<QueryResultRow>>(sql,params);
    }
    static async connect():Promise<DBConnection>{
        const conn = await pool.connect();
        return new DBConnection(conn);
    }
}