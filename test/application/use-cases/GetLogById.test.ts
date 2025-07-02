import { GetLogById } from "../../../src/application/use-cases/GetLogById";
import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";
import { Log } from "../../../src/domain/entities/Log";

jest.mock("../../../src/infrastructure/repositories/LogRepository");

describe("GetLogById", () => {
    it("should return the log with the given ID", async () => {
        const log: Log = {
            id: "log-123",
            actor: "user1",
            action: ActionEnum.CREATE_RESOURCE,
            resource: "doc",
            metadata: { info: "test" },
            timestamp: new Date().toISOString(),
        };

        const mockFindLogById = jest.fn().mockResolvedValue(log);

        (LogRepository as jest.Mock).mockImplementation(() => ({
            findLogById: mockFindLogById,
        }));

        const useCase = new GetLogById();

        const result = await useCase.execute("log-123");

        expect(result).toEqual(log);
        expect(mockFindLogById).toHaveBeenCalledWith("log-123");
        expect(mockFindLogById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if log is not found", async () => {
        const mockFindLogById = jest.fn().mockRejectedValue(new Error("Log not found"));

        (LogRepository as jest.Mock).mockImplementation(() => ({
            findLogById: mockFindLogById,
        }));

        const useCase = new GetLogById();

        await expect(useCase.execute("non-existent-id")).rejects.toThrow("Log not found");
        expect(mockFindLogById).toHaveBeenCalledWith("non-existent-id");
    });
});
