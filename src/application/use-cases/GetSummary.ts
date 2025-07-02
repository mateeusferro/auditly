import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { LogRepository } from "@/infrastructure/repositories/LogRepository";
import { Summary } from "@/domain/entities/Summary";

export class GetSummary {
    private _logRepository: ILogRepository;

    constructor() {
        this._logRepository = new LogRepository();
    }

    async execute(): Promise<Summary> {
        const totalLogs = await this._logRepository.total();
        const mostActiveActor = await this._logRepository.mostActiveActor();
        const mostCommonAction = await this._logRepository.mostCommonAction();
        const logsPerDay = await this._logRepository.logsPerDay();

        return new Summary({
            totalLogs,
            mostActiveActor,
            mostCommonAction,
            logsPerDay
        });
    }
}