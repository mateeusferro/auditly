import { GetLogsByFilter } from "../../../src/application/use-cases/GetLogsByFilter";
import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";
import { FilterQueryDto } from "../../../src/application/dtos/FilterQueryDto";
import { Log } from "../../../src/domain/entities/Log";

jest.mock("../../../src/infrastructure/repositories/LogRepository");

describe("GetLogsByFilter", () => {
    it("should return filtered logs", async () => {
        const mockLogs: Log[] = [
            {
                id: "log-1",
                actor: "john",
                action: ActionEnum.CREATE_RESOURCE,
                resource: "file",
                metadata: { ip: "127.0.0.1" },
                timestamp: new Date().toISOString(),
            },
        ];

        const mockFindLogsByFilter = jest.fn().mockResolvedValue(mockLogs);

        (LogRepository as jest.Mock).mockImplementation(() => ({
            findLogsByFilter: mockFindLogsByFilter,
        }));

        const useCase = new GetLogsByFilter();

        const dto: FilterQueryDto = {
            actor: "john",
            action: ActionEnum.CREATE_RESOURCE,
            resource: "file",
            from: "2025-01-01T00:00:00Z",
            to: "2025-12-31T23:59:59Z",
        };

        const result = await useCase.execute(dto);

        expect(result).toEqual(mockLogs);
        expect(mockFindLogsByFilter).toHaveBeenCalledTimes(1);
        expect(mockFindLogsByFilter).toHaveBeenCalledWith(
            expect.objectContaining({
                actor: "john",
                action: ActionEnum.CREATE_RESOURCE,
                resource: "file",
                from: "2025-01-01T00:00:00Z",
                to: "2025-12-31T23:59:59Z",
            })
        );
    });
});
