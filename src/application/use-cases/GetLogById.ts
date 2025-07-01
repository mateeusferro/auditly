import { LogRepository } from "@/infrastructure/repositories/LogRepository";
import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { Log } from "@/domain/entities/Log";

export class GetLogById {
    private _logRepository: ILogRepository;

    constructor() {
        this._logRepository = new LogRepository();
    }

    async execute(id: string): Promise<Log> {
        return await this._logRepository.findLogById(id);
    }
}