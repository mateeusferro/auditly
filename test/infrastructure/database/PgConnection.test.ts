jest.mock("../../../src/infrastructure/configuration/env-config", () => ({
    envConfig: {
        DB_HOST: "localhost",
        DB_NAME: "testdb",
        DB_PWD: "testpwd",
        DB_PORT: 5432,
        DB_USER: "testuser"
    }
}));

jest.mock("pg", () => {
    const mPool = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn()
    };
    return { Pool: jest.fn(() => mPool) };
});

import { PgConnection } from "../../../src/infrastructure/database/PgConnection";
import { Pool } from "pg";

describe("PgConnection", () => {
    it("should initialize pg Pool with correct config and return the pool", () => {
        const pgConnection = new PgConnection();
        expect(pgConnection.pool).toHaveProperty("connect");
        expect(pgConnection.pool).toHaveProperty("query");
        expect(pgConnection.pool).toHaveProperty("end");
        expect(Pool).toHaveBeenCalledWith(expect.objectContaining({
            host: "localhost",
            database: "testdb",
            password: "testpwd",
            port: 5432,
            user: "testuser",
            ssl: false,
            max: 20,
            idleTimeoutMillis: 2000,
            connectionTimeoutMillis: 1000,
            maxUses: 7500
        }));
    });
});
