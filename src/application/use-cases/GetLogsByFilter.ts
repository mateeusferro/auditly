import { Log } from "../../domain/entities/Log";
import { ILogRepository } from "../../domain/repositories/ILogRepository";
import { LogRepository } from "../../infrastructure/repositories/LogRepository";
import { FilterQueryDto } from "../dtos/FilterQueryDto";
import { Filter } from "../../domain/entities/Filter";

export class GetLogsByFilter {
    private _logRepository: ILogRepository;

    constructor() {
        this._logRepository = new LogRepository();
    }

    async execute(filterDto: FilterQueryDto): Promise<Log[]> {
        const { actor, action, resource, from, to } = filterDto;
        const filter = new Filter({
            actor, 
            action, 
            resource, 
            from, 
            to
        });

        return await this._logRepository.findLogsByFilter(filter);
    }
}