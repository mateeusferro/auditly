import Fastify, { FastifyInstance } from "fastify";
import { LogRoute } from "../../../src/interfaces/routes/LogRoute";
import { LogController } from "../../../src/interfaces/controllers/LogController";

jest.mock("../../../src/interfaces/controllers/LogController", () => ({
    LogController: {
        create: jest.fn().mockResolvedValue(undefined),
        getById: jest.fn().mockResolvedValue(undefined),
        getByFilters: jest.fn().mockResolvedValue(undefined),
        getAll: jest.fn().mockResolvedValue(undefined),
        search: jest.fn().mockResolvedValue(undefined),
        summary: jest.fn().mockResolvedValue(undefined),
    }
}));

describe("LogRoute", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = Fastify();
        const logRoute = new LogRoute();
        fastify.register((instance, opts, done) => {
            logRoute.routes(instance, opts, done);
        }, { prefix: logRoute.prefix });
        await fastify.ready();
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should call LogController.create on POST /log", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/log",
            payload: {
                actor: "test",
                action: "CREATE",
                resource: "file",
                metadata: { foo: "bar" }
            }
        });

        expect(LogController.create).toHaveBeenCalled();
        expect(response.statusCode).toBe(200); // ou 201, dependendo do seu controller
    });

    it("should call LogController.getById on GET /log/:id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/log/123"
        });

        expect(LogController.getById).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
    });

    it("should call LogController.getByFilters on GET /log/filter", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/log/filter?actor=test"
        });

        expect(LogController.getByFilters).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
    });

    it("should call LogController.getAll on GET /log", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/log?page=1&size=10"
        });

        expect(LogController.getAll).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
    });

    it("should call LogController.search on GET /log/search?q=value", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/log/search?q=some"
        });

        expect(LogController.search).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
    });

    it("should call LogController.summary on GET /log/summary", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/log/summary"
        });

        expect(LogController.summary).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
    });
});
