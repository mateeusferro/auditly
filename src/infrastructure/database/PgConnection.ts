import { Pool, PoolConfig } from "pg";
import { envConfig } from "../configuration/env-config";
import { IConnection } from "./IConnection";

export class PgConnection implements IConnection<Pool> {
    private _db: Pool;

    constructor() {
        const poolConfig: PoolConfig = {
            host: envConfig.DB_HOST,
            database: envConfig.DB_NAME,
            password: envConfig.DB_PWD,
            port: envConfig.DB_PORT,
            user: envConfig.DB_USER,
            ssl: false,
            max: 20,
            idleTimeoutMillis: 2000,
            connectionTimeoutMillis: 1000,
            maxUses: 7500
        };
        
        this._db = new Pool(poolConfig);
    }

    get pool(): Pool {
        return this._db;
    }
}