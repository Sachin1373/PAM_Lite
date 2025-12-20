import pg from "pg";
import config from "../config";

const { Pool } = pg;

const dbConfig = {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
}

const pool  = new Pool({
    ...dbConfig,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export default pool;