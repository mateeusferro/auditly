/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LogController } from "../../../src/interfaces/controllers/LogController";
import { CreateLog } from "../../../src/application/use-cases/CreateLog";
import { GetLogById } from "../../../src/application/use-cases/GetLogById";
import { GetLogsByFilter } from "../../../src/application/use-cases/GetLogsByFilter";
import { GetAllPaginatedLogs } from "../../../src/application/use-cases/GetAllPaginatedLogs";
import { SearchLogs } from "../../../src/application/use-cases/SearchLogs";
import { GetSummary } from "../../../src/application/use-cases/GetSummary";
import { FastifyReply, FastifyRequest } from "fastify";

jest.mock("../../../src/application/use-cases/CreateLog");
jest.mock("../../../src/application/use-cases/GetLogById");
jest.mock("../../../src/application/use-cases/GetLogsByFilter");
jest.mock("../../../src/application/use-cases/GetAllPaginatedLogs");
jest.mock("../../../src/application/use-cases/SearchLogs");
jest.mock("../../../src/application/use-cases/GetSummary");

function mockReply() {
    const send = jest.fn().mockReturnThis();
    const status = jest.fn().mockReturnValue({ send });
    return { status, send };
}

describe("LogController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("returns 201 and id on success", async () => {
            const req = { body: { actor: "user", action: "CREATE_RESOURCE", resource: "file", metadata: {} } };
            const reply = mockReply();

            (CreateLog as jest.Mock).mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue("log-id-1"),
            }));

            await LogController.create(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(201);
            expect(reply.status().send).toHaveBeenCalledWith({ id: "log-id-1" });
        });

        it("returns 400 on invalid body", async () => {
            const req = { body: { actor: 123 } };
            const reply = mockReply();

            await LogController.create(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.status().send).toHaveBeenCalledWith(expect.objectContaining({ error: expect.anything() }));
        });
    });

    describe("getById", () => {
        it("returns 200 and log", async () => {
            const req = { params: { id: "log-123" } };
            const reply = mockReply();

            (GetLogById as jest.Mock).mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue({ id: "log-123" }),
            }));

            await LogController.getById(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.status().send).toHaveBeenCalledWith({ id: "log-123" });
        });
    });

    describe("getByFilters", () => {
        it("returns 200 and filtered logs", async () => {
            const req = { query: { actor: "user" } };
            const reply = mockReply();

            (GetLogsByFilter as jest.Mock).mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue([{ id: "log1" }]),
            }));

            await LogController.getByFilters(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.status().send).toHaveBeenCalledWith([{ id: "log1" }]);
        });

        it("returns 400 on invalid filter", async () => {
            const req = { query: { actor: 123 } };
            const reply = mockReply();

            await LogController.getByFilters(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.status().send).toHaveBeenCalledWith(expect.objectContaining({ error: expect.anything() }));
        });
    });

    describe("getAll", () => {
        it("returns 200 and paginated logs", async () => {
            const req = { query: { page: "1", size: "10" } };
            const reply = mockReply();

            (GetAllPaginatedLogs as jest.Mock).mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue({ data: [], rows: 0, totalPages: 0 }),
            }));

            await LogController.getAll(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(200);
        });

        it("returns 400 on invalid pagination params", async () => {
            const req = { query: { page: "abc", size: "def" } };
            const reply = mockReply();

            await LogController.getAll(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(400);
        });
    });

    describe("search", () => {
        it("returns 200 and search results", async () => {
            const req = { query: { q: "test" } };
            const reply = mockReply();

            (SearchLogs as jest.Mock).mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue([{ id: "log1" }]),
            }));

            await LogController.search(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.status().send).toHaveBeenCalledWith([{ id: "log1" }]);
        });
    });

    describe("summary", () => {
        it("returns 200 and summary", async () => {
            const req = {};
            const reply = mockReply();

            (GetSummary as jest.Mock).mockImplementation(() => ({
                execute: jest.fn().mockResolvedValue({ totalLogs: 10 }),
            }));

            await LogController.summary(req as FastifyRequest, reply as unknown as FastifyReply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.status().send).toHaveBeenCalledWith({ totalLogs: 10 });
        });
    });
});