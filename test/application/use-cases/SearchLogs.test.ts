import { SearchLogs } from "../../../src/application/use-cases/SearchLogs";
import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";
import { Log } from "../../../src/domain/entities/Log";

jest.mock("../../../src/infrastructure/repositories/LogRepository");

describe("SearchLogs", () => {
    it("should return logs matching the search query", async () => {
        const mockLogs: Log[] = [
            {
                id: "log-1",
                actor: "alice",
                action: ActionEnum.CREATE_RESOURCE,
                resource: "file",
                metadata: { details: "created file" },
                timestamp: new Date().toISOString(),
            },
        ];

        const mockSearch = jest.fn().mockResolvedValue(mockLogs);
        (LogRepository as jest.Mock).mockImplementation(() => ({
            search: mockSearch,
        }));

        const useCase = new SearchLogs();
        const result = await useCase.execute("file");

        expect(result).toEqual(mockLogs);
        expect(mockSearch).toHaveBeenCalledTimes(1);
        expect(mockSearch).toHaveBeenCalledWith("file");
    });
});
