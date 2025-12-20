import { env } from "./env"

const config = {
    server: {
        port: env.apiPort,
        env: env.nodeEnv,
    },

    database: {
        url: env.databaseUrl,
        host: env.DB_HOST,
        port: env.DB_PORT,
        name: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
    },

    auth: {
        jwtSecret: env.jwtSecret,
        jwtExpiresIn: "15m",
    },
}

export default config