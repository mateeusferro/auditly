import fastify, { FastifyInstance } from "fastify";
import { envConfig } from "./infrastructure/configuration/env-config";
import { routers } from "./routers";

const server: FastifyInstance = fastify({ logger: true });
const port = envConfig.PORT;
const host = envConfig.HOST;

server.get("/ping", async (_, reply) => {
    return reply.status(200).send("pong");
});

server.listen({ port, host }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log("Server listening at: ", address);
});

routers();