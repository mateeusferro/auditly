import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { LogRepository } from "@/infrastructure/repositories/LogRepository";

export class GetAllPaginatedLogs {
    private _logRepository: ILogRepository;
    
    constructor() {
        this._logRepository = new LogRepository();
    }

    execute(): void {
    }
}