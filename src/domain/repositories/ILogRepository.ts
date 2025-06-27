import { Log } from "../entities/Log";

export interface ILogRepository {
    create(log: Log): Promise<string>;
    // For now I won't create the queries, because the focus will be filters
}