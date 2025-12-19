import dotenv from 'dotenv';

dotenv.config();


function required(key: string): string {
    const value = process.env[key];

    if(value === undefined) {
        throw new Error(`Environment variable ${key} is required but not defined.`);
    }

    return value;
}

export const env = {
    apiPort: Number(process.env.API_PORT) || 3000,
    databaseUrl: required('DATABASE_URL'),
    jwtSecret: required('JWT_SECRET'),
    nodeEnv: process.env.NODE_ENV || "development",
}