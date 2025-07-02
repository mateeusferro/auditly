import { GetSummary } from "../../../src/application/use-cases/GetSummary";
import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";
import { Summary } from "../../../src/domain/entities/Summary";

jest.mock("../../../src/infrastructure/repositories/LogRepository");

describe("GetSummary", () => {
    it("should return the summary with correct values", async () => {
        const mockTotal = 10;
        const mockActor = "alice";
        const mockAction = ActionEnum.UPDATE_RESOURCE;
        const mockLogsPerDay = [
            { log_date: "2025-07-01", count: 5 },
            { log_date: "2025-07-02", count: 5 },
        ];

        const mockMethods = {
            total: jest.fn().mockResolvedValue(mockTotal),
            mostActiveActor: jest.fn().mockResolvedValue(mockActor),
            mostCommonAction: jest.fn().mockResolvedValue(mockAction),
            logsPerDay: jest.fn().mockResolvedValue(mockLogsPerDay),
        };

        (LogRepository as jest.Mock).mockImplementation(() => mockMethods);

        const useCase = new GetSummary();
        const result = await useCase.execute();

        expect(result).toBeInstanceOf(Summary);
        expect(result.totalLogs).toBe(mockTotal);
        expect(result.mostActiveActor).toBe(mockActor);
        expect(result.mostCommonAction).toBe(mockAction);
        expect(result.logsPerDay).toEqual(mockLogsPerDay);

        expect(mockMethods.total).toHaveBeenCalled();
        expect(mockMethods.mostActiveActor).toHaveBeenCalled();
        expect(mockMethods.mostCommonAction).toHaveBeenCalled();
        expect(mockMethods.logsPerDay).toHaveBeenCalled();
    });
});
