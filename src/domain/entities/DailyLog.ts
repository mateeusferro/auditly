export class DailyLog {
    public readonly date: string;
    public readonly count: number;

    constructor(date: string, count: number) {
        this.date = date;
        this.count = count;
    }
}