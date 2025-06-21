import {Pool, PoolClient, QueryResultRow, QueryResult} from "pg";

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER
const password = process.env.DB_PASS
const database = process.env.DB_NAME
const port = Number(process.env.DB_PORT) || 5432

// --- COLOQUE OS CONSOLE.LOGS AQUI ---
console.log("Variáveis de ambiente do Banco de Dados:");
console.log("DB_HOST:", host);
console.log("DB_USER:", user);
// Para segurança, evite imprimir a senha diretamente em logs de produção.
// Aqui, verificamos se ela existe antes de imprimir uma máscara.
console.log("DB_PASS:", password ? "****** (senha carregada)" : "Senha não definida/vazia!");
console.log("DB_NAME:", database);
console.log("DB_PORT:", port);
// --- FIM DOS CONSOLE.LOGS ---

const pool = new Pool({
    host,
    user,
    password,
    database,
    port,
    max: 5,
});

export default class DBConnection {
    private connection: PoolClient;

    private constructor(connection: PoolClient) {
        this.connection = connection;
        console.log("Aberto conexão com BD.");
    }

    // Usando Symbol.asyncDispose para o 'await using'
    async [Symbol.asyncDispose]() {
        if (this.connection) {
            await this.connection.release();
            console.log("Conexão devolvida ao Pool.");
        }
    }

    // A CORREÇÃO ESTÁ AQUI:
    // O tipo genérico 'T' agora é passado para o query do PoolClient.
    // O retorno do seu método 'query' deve ser Promise<QueryResult<T>>
    async query<T extends QueryResultRow = QueryResultRow>(sql: string, params?: any[]): Promise<QueryResult<T>> {
        return await this.connection.query<T>(sql, params); // <--- AQUI ESTÁ A MUDANÇA CRÍTICA
    }

    static async connect(): Promise<DBConnection> {
        const conn = await pool.connect();
        return new DBConnection(conn);
    }
}