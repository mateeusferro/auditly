import { Pageable } from "@/application/dtos/PageableDto";
import { Filter } from "../entities/Filter";
import { Log } from "../entities/Log";
import { ActionEnum } from "../entities/ActionEnum";
import { DailyLog } from "../entities/DailyLog";

export interface ILogRepository {
    create(log: Log): Promise<string>;

    findLogsByFilter(filter: Filter): Promise<Log[]>;

    findLogById(id: string): Promise<Log>;

    findAll(page: number, size: number): Promise<Pageable<Log>>;

    search(q: string): Promise<Log[]>;

    total(): Promise<number>;

    mostActiveActor(): Promise<string>;

    mostCommonAction(): Promise<ActionEnum>;

    logsPerDay(): Promise<DailyLog[]>;
}