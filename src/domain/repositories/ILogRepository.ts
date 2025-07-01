import { Filter } from "../entities/Filter";
import { Log } from "../entities/Log";

export interface ILogRepository {
    create(log: Log): Promise<string>;

    findLogsByFilter(filter: Filter): Promise<Log[]>;

    findLogById(id: string): Promise<Log>;

    findAll(): Promise<Log[]>
}