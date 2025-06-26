import { Logs } from "../entities/Logs";

export interface ILogRepository {
    create(log: Logs): Promise<string>;
    // For now I won't create the queries, because the focus will be filters
}