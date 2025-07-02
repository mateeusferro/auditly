import { LogRepository } from "../../../src/infrastructure/repositories/LogRepository";
import { PgConnection } from "../../../src/infrastructure/database/PgConnection";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";

jest.mock("../../../src/infrastructure/database/PgConnection");

const mockQuery = jest.fn();
(PgConnection as jest.Mock).mockImplementation(() => ({
    pool: { query: mockQuery },
}));

describe("LogRepository", () => {
    let repo: LogRepository;

    beforeEach(() => {
        repo = new LogRepository();
        mockQuery.mockReset();
    });

    it("should create a log and return ID", async () => {
        const fakeId = "1234";
        mockQuery.mockResolvedValueOnce({ rows: [{ id: fakeId }] });

        const id = await repo.create({
            action: ActionEnum.CREATE_RESOURCE,
            actor: "user1",
            metadata: { info: "test" },
            resource: "document",
        });

        expect(id).toBe(fakeId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should return a log by ID", async () => {
        const log = {
            id: "log1",
            action: ActionEnum.CREATE_RESOURCE,
            actor: "user1",
            metadata: { info: "test" },
            resource: "doc",
            timestamp: new Date().toISOString(),
        };
        mockQuery.mockResolvedValueOnce({ rows: [log] });

        const result = await repo.findLogById("log1");

        expect(result).toEqual(log);
        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ["log1"]);
    });

    it("should throw if log not found", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        await expect(repo.findLogById("404")).rejects.toThrow("Log not found for the id: 404");
    });

    it("should return most active actor", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ actor: "john", frequency: 10 }] });

        const result = await repo.mostActiveActor();

        expect(result).toBe("john");
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should return most common action", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ action: ActionEnum.UPDATE_RESOURCE, frequency: 15 }] });

        const result = await repo.mostCommonAction();

        expect(result).toBe(ActionEnum.UPDATE_RESOURCE);
    });
});