/* eslint-disable @typescript-eslint/dot-notation */
import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction  } from "fastify";
import { Server } from "../../../src/infrastructure/http/Server";
import { IRouter } from "../../../src/interfaces/routes/IRouter";

class MockRoute implements IRouter {
    public prefix = "/mock";

    routes(
        fastify: FastifyInstance, 
        _options: FastifyPluginOptions, 
        done: HookHandlerDoneFunction
    ) {
        fastify.get("/test", async (_, reply) => {
            reply.status(200).send({ message: "ok" });
        });
        done();
    }
}

describe("Server", () => {
    let serverInstance: Server;

    beforeAll(async () => {
        serverInstance = new Server({
            routes: [MockRoute],
            port: 0,
            host: "127.0.0.1",
        });

        await serverInstance["server"].ready();
    });

    afterAll(async () => {
        await serverInstance["server"].close();
    });

    it("should respond to /ping", async () => {
        const res = await serverInstance["server"].inject({
            method: "GET",
            url: "/ping",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe("pong");
    });

    it("should register custom route", async () => {
        const res = await serverInstance["server"].inject({
            method: "GET",
            url: "/mock/test",
        });

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual({ message: "ok" });
    });

    it("should handle internal errors", async () => {
        class ErrorRoute implements IRouter {
            prefix = "/error";
            routes(
                fastify: FastifyInstance,
                _: FastifyPluginOptions,
                done: HookHandlerDoneFunction
            ) {
                fastify.get("/fail", () => {
                    throw new Error("Something went wrong");
                });
                done();
            }
        }

        const serverWithError = new Server({
            routes: [ErrorRoute],
            port: 0,
            host: "127.0.0.1",
        });

        await serverWithError["server"].ready();
        const res = await serverWithError["server"].inject({
            method: "GET",
            url: "/error/fail",
        });

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body)).toEqual({ message: "Something went wrong" });

        await serverWithError["server"].close();
    });
});
