import { Log } from "../../domain/entities/Log";
import { ILogRepository } from "../../domain/repositories/ILogRepository";
import { PgConnection } from "../database/PgConnection";
import { Pool, QueryResult } from "pg";
import { Filter } from "../../domain/entities/Filter";
import { buildFilter } from "../utils/FilterUtil";
import { Pageable } from "../../application/dtos/PageableDto";
import { ActionEnum } from "../../domain/entities/ActionEnum";
import { DailyLog } from "../../domain/entities/DailyLog";

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
        const [values, conditions] = buildFilter(filter);
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

    async findAll(page: number, size: number): Promise<Pageable<Log>> {
        const offset = (page - 1) * size;
        const queryFindAll = `
            SELECT
                ID,
                ACTION,
                ACTOR,
                METADATA,
                RESOURCE,
                TIMESTAMP
            FROM AUDIT_LOGS
            ORDER BY TIMESTAMP
            LIMIT $1
            OFFSET $2;
        `;

        const queryCountRow = `
            SELECT
                COUNT(ID) as ROWS
            FROM AUDIT_LOGS;
        `;
        
        const queryFindAllResult: QueryResult<Log> = await this._db
            .query<Log>(queryFindAll, [size, offset])
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while retrieving log with pagination");
            });
        
        const queryCountRowResult: QueryResult<{ rows: number }> = await this._db
            .query<{ rows: number }>(queryCountRow)
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while retrieving the quantity of rows in log");
            });
        const totalRows = Number(queryCountRowResult.rows[0].rows);
        const totalPages = Math.ceil(totalRows / size);
        
        return {
            data: queryFindAllResult.rows,
            rows: totalRows,
            totalPages: totalPages
        };
    }

    async search(q: string): Promise<Log[]> {
        const input = `%${q}%`;
        const query = `
            SELECT
                ID,
                ACTION,
                ACTOR,
                METADATA,
                RESOURCE,
                TIMESTAMP
            FROM AUDIT_LOGS
            WHERE EXISTS (
                SELECT 1
                FROM JSONB_EACH_TEXT(METADATA) as KEY_VALUE
                WHERE KEY_VALUE.VALUE LIKE $1
            );
        `;

        const queryResult: QueryResult<Log> = await this._db
            .query<Log>(query, [input])
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while retrieving searched log");
            });
        
        return queryResult.rows;
    }

    async total(): Promise<number> {
        const query = `
            SELECT
                COUNT(ID) as ROWS
            FROM AUDIT_LOGS;
        `;

        const queryResult: QueryResult<{ rows: number }> = await this._db
            .query<{ rows: number }>(query)
            .catch((err: unknown) => {
                console.error(err);
                throw new Error("Error while retrieving the quantity of rows in log");
            });

        return Number(queryResult.rows[0].rows);
    }

    async mostActiveActor(): Promise<string> {
        const query = `
            SELECT 
                ACTOR,
                COUNT(ID) as FREQUENCY
            FROM AUDIT_LOGS
            GROUP BY ACTOR
            ORDER BY FREQUENCY DESC
            LIMIT 1;
        `;

        const queryResult: QueryResult<{ actor: string, frequency: number }> = await this._db
            .query<{ actor: string, frequency: number }>(query)
            .catch((err: unknown) => {
                console.log(err);
                throw new Error("Error while retrieving most active actor");
            });
        
        const actor = queryResult.rows[0].actor;

        return actor;
    }
    
    async mostCommonAction(): Promise<ActionEnum> {
        const query = `
            SELECT 
                ACTION,
                COUNT(ID) as FREQUENCY
            FROM AUDIT_LOGS
            GROUP BY ACTION
            ORDER BY FREQUENCY DESC
            LIMIT 1;
        `;

        const queryResult: QueryResult<{ action: ActionEnum, frequency: number }> = await this._db
            .query<{ action: ActionEnum, frequency: number }>(query)
            .catch((err: unknown) => {
                console.log(err);
                throw new Error("Error while retrieving most common action");
            });
        
        const action = queryResult.rows[0].action;

        return action;
    }
    
    async logsPerDay(): Promise<DailyLog[]> {
        const query = `
            SELECT
                DATE(TIMESTAMP) as LOG_DATE, COUNT(ID)
            FROM AUDIT_LOGS
            GROUP BY LOG_DATE
            ORDER BY LOG_DATE;
        `;

        const queryResult: QueryResult<DailyLog> = await this._db
            .query<DailyLog>(query)
            .catch((err: unknown) => {
                console.log(err);
                throw new Error("Error while retrieving quantity of logs per day");
            });

        return queryResult.rows;
    }
}