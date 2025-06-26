import { LogRepository } from "@/infrastructure/repositories/LogRepository";
import { ILogRepository } from "../repositories/ILogRepository";

export class LogService {
    private _logRepository: ILogRepository;

    constructor() {
        this._logRepository = new LogRepository();
    }

    // async createLog(): Promise<string> {
    //     const 
    // }
}