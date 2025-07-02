import { CreateLog } from "../../../src/application/use-cases/CreateLog";
import { CreateLogDto } from "../../../src/application/dtos/CreateLogDto";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";
import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";
import { Log } from "../../../src/domain/entities/Log";

jest.mock("../../../src/infrastructure/repositories/LogRepository");

describe("CreateLog", () => {
    it("should create a log and return its ID", async () => {
        const mockCreate = jest.fn().mockResolvedValue("log-123");

        (LogRepository as jest.Mock).mockImplementation(() => ({
            create: mockCreate,
        }));

        const useCase = new CreateLog();
        const dto: CreateLogDto = {
            actor: "user1",
            action: ActionEnum.CREATE_RESOURCE,
            resource: "doc1",
            metadata: { ip: "127.0.0.1" },
        };

        const result = await useCase.execute(dto);

        expect(result).toBe("log-123");
        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(mockCreate).toHaveBeenCalledWith(expect.any(Log));
    });
});
