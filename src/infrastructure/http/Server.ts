import fastify, { FastifyInstance } from "fastify";
import { IServer } from "./IServer";

export class Server implements IServer {
    private server: FastifyInstance;
    private port: number;
    private host: string;
    
    constructor(init: { routes: unknown[], port: number, host: string }) {
        this.server = fastify({
            logger: true,
            trustProxy: true
        });

        this.port = init.port;
        this.host = init.host;

        console.log(init);
        // this.routes(init.routes);
        this.routes();
    }

    public routes() {
        this.server.get("/ping", async (_, reply) => {
            reply.status(200).send("pong");
        });
    }

    public listen() {
        this.server.listen({ port: this.port, host: this.host }, (err, address) => {
            if (err) {
                this.server.log.error(err);
                process.exit(1);
            }
            console.log("Server listening at: ", address);
        });
    }
}