import { GetAllPaginatedLogs } from "../../../src/application/use-cases/GetAllPaginatedLogs";
import { PageableDto } from "../../../src/application/dtos/PageableDto";
import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";

jest.mock("../../../src/infrastructure/repositories/LogRepository");

describe("GetAllPaginatedLogs", () => {
    it("should return paginated logs", async () => {
        const mockFindAll = jest.fn().mockResolvedValue({
            data: [{ id: "1", actor: "a", action: "b", resource: "c", metadata: {}, timestamp: new Date().toISOString() }],
            rows: 1,
            totalPages: 1,
        });

        (LogRepository as jest.Mock).mockImplementation(() => ({
            findAll: mockFindAll,
        }));

        const useCase = new GetAllPaginatedLogs();

        const pageable: PageableDto = { page: 1, size: 10 };
        const result = await useCase.execute(pageable);

        expect(result.data.length).toBe(1);
        expect(mockFindAll).toHaveBeenCalledWith(1, 10);
    });

    it("should throw if size is greater than 100", async () => {
        const useCase = new GetAllPaginatedLogs();

        const pageable: PageableDto = { page: 1, size: 101 };

        await expect(useCase.execute(pageable)).rejects.toThrow("Size cannot be greater than 100");
    });
});
