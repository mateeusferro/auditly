export interface EnvConfig {
    DB_HOST: string,
    DB_NAME: string,
    DB_PORT: number,
    DB_PWD: string,
    DB_USER: string,
    ENV: string,
    PORT: number,
    HOST: string
};

export const envConfig: EnvConfig = {
    DB_HOST: String(process.env.POSTGRES_HOST),
    DB_NAME: String(process.env.POSTGRES_DB),
    DB_PORT: Number(process.env.POSTGRES_PORT),
    DB_PWD: String(process.env.POSTGRES_PASSWORD),
    DB_USER: String(process.env.POSTGRES_USER),
    ENV: String(process.env.NODE_ENV),
    PORT: Number(process.env.PORT),
    HOST: String(process.env.HOST)
};