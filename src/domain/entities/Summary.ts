import { ActionEnum } from "./ActionEnum";
import { DailyLog } from "./DailyLog";

export class Summary {
    public readonly totalLogs: number;
    public readonly mostActiveActor: string;
    public readonly mostCommonAction: ActionEnum;
    public readonly logsPerDay: DailyLog[];

    constructor(fields: {
        totalLogs: number,
        mostActiveActor: string,
        mostCommonAction: ActionEnum,
        logsPerDay: DailyLog[]
    }) {
        const { totalLogs, mostActiveActor, mostCommonAction, logsPerDay } = fields;

        this.totalLogs = totalLogs;
        this.mostActiveActor = mostActiveActor;
        this.mostCommonAction = mostCommonAction;
        this.logsPerDay = logsPerDay;
    }
}