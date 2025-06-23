import fastify, { FastifyInstance } from "fastify";
import { envConfig } from "./infrastructure/configuration/env-config";

const server: FastifyInstance = fastify({ logger: true });
const port = envConfig.PORT;

server.get("/ping", async (_, reply) => {
    return reply.status(200).send("pong");
});

function routers() {
    console.log("Routers will be here");
}

server.listen({ port }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log("Server listening at: ", address);
});

routers();