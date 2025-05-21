import mariadb from "mariadb";

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER
const password = process.env.DB_PASS
const database = process.env.DB_NAME

const pool = mariadb.createPool({
    host,
    user,
    password,
    connectionLimit: 5,
    database
});
var conn:Promise<mariadb.PoolConnection>;
try{
    conn = pool.getConnection();
}catch(err){
    throw err
}

/* export async function getDatabaseConnection() {
    conn? conn:null
} */