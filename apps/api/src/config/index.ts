import { env } from "./env"

const config = {
    server: {
        port: env.apiPort,
        env: env.nodeEnv,
    },

    database: {
        url: env.databaseUrl,
    },

    auth: {
        jwtSecret: env.jwtSecret,
        jwtExpiresIn: "15m",
    },
}

export default config