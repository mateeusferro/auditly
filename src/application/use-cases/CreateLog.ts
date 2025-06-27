import { LogRepository } from "@/infrastructure/repositories/LogRepository";
import { CreateLogDto } from "../dtos/CreateLogDto";
import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { Log } from "@/domain/entities/Log";

export class CreateLog {
    private _logRepository: ILogRepository;

    constructor() {
        this._logRepository = new LogRepository();
    }

    async execute(logDto: CreateLogDto): Promise<string> {
        const { actor, action, resource, metadata } = logDto;
        const log = new Log({
            actor,
            action,
            resource,
            metadata
        });

        return await this._logRepository.create(log);
    }
}