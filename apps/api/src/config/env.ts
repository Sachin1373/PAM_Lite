import dotenv from 'dotenv';

dotenv.config();


function required(key: string): string {
    const value = process.env[key];

    if (value === undefined) {
        throw new Error(`Environment variable ${key} is required but not defined.`);
    }

    return value;
}

export const env = {
    apiPort: Number(process.env.API_PORT) || 3000,
    databaseUrl: required('DATABASE_URL'),
    jwtSecret: required('JWT_SECRET'),
    nodeEnv: process.env.NODE_ENV || "development",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_NAME: process.env.DB_NAME || "pam_lite",
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "password"
}