import { ILogRepository } from "@/domain/repositories/ILogRepository";
import { LogRepository } from "@/infrastructure/repositories/LogRepository";
import { Pageable, PageableDto } from "../dtos/PageableDto";
import { Log } from "@/domain/entities/Log";

export class GetAllPaginatedLogs {
    private _logRepository: ILogRepository;
    
    constructor() {
        this._logRepository = new LogRepository();
    }

    async execute(pageable: PageableDto): Promise<Pageable<Log>> {
        const { page, size } = pageable;
        if (size > 100)
            throw new Error("Size cannot be greater than 100");

        return await this._logRepository.findAll(page, size);
    }
}