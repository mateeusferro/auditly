import { Log } from "@/domain/entities/Log";
import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { PgConnection } from "../database/PgConnection";
import { Pool, QueryResult } from "pg";
import { Filter } from "@/domain/entities/Filter";

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

        const queryResult: QueryResult<{id: string}> = await this._db
            .query<{id: string}>(query, values)
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while creating the log");
            });

        return queryResult.rows[0].id;
    }
    
    async findLogsByFilter(filter: Filter): Promise<Log[]> {
        const [values, conditions] = this.buildFilter(filter);
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const query = `
            SELECT
                ID,
                ACTION,
                ACTOR,
                METADATA,
                RESOURCE,
                TIMESTAMP
            FROM AUDIT_LOGS
            ${whereClause}
            ORDER BY TIMESTAMP DESC;
        `;

        const queryResult: QueryResult<Log> = await this._db
            .query<Log>(query, values)
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while retrieving a log in this filters: " + JSON.stringify(filter));
            });
        
        return queryResult.rows;
    }

    async findLogById(id: string): Promise<Log> {
        const query = `
            SELECT
                ID,
                ACTION,
                ACTOR,
                METADATA,
                RESOURCE,
                TIMESTAMP
            FROM AUDIT_LOGS
            WHERE ID = $1;
        `;

        const queryResult: QueryResult<Log> = await this._db
            .query<Log>(query, [id])
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while retrieving a log for id: " + id);
            });
        
        if (queryResult.rows.length === 0) 
            throw new Error("Log not found for the id: " + id);

        return queryResult.rows[0];
    }

    findAll(): Promise<Log[]> {
        throw new Error("Method not implemented.");
    }

    private buildFilter(filter: Filter): [unknown[], string[]] {
        const { actor, action, resource, from, to } = filter;
        const values: unknown[] = [];
        const conditions: string[] = [];

        if (actor) {
            values.push(actor);
            conditions.push(`ACTOR = $${String(values.length)}`);
        }

        if (action) {
            values.push(action);
            conditions.push(`ACTION = $${String(values.length)}`);
        }

        if (resource) {
            values.push(resource);
            conditions.push(`RESOURCE = $${String(values.length)}`);
        }

        if (from) {
            values.push(from);
            conditions.push(`TIMESTAMP >= $${String(values.length)}`);
        }

        if (to) {
            values.push(to);
            conditions.push(`TIMESTAMP <= $${String(values.length)}`);
        }

        return [values, conditions];
    }
}