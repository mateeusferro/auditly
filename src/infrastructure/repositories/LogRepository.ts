import { Log } from "@/domain/entities/Log";
import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { PgConnection } from "../database/PgConnection";
import { Pool, QueryResult } from "pg";

export class LogRepository implements ILogRepository {
    private _db: Pool;

    constructor() {
        this._db = new PgConnection().pool;
    }

    async create(log: Log): Promise<string> {
        const values = [log.action, log.actor, log.metadata, log.resource];
        const query = `
            INSERT INTO 
                AUDIT_LOGS (
                    ACTION, 
                    ACTOR,
                    METADATA,
                    RESOURCE
                )
                VALUES ($1, $2, $3, $4)
            RETURNING ID
        `;

        const queryResult: QueryResult<{id: string}> = await this._db.query<{id: string}>(query, values).catch((err: unknown) => {
            console.error(err);
            throw new Error("Error while creating the log");
        });

        return queryResult.rows[0].id;
    }
    
}