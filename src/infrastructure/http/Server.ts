import fastify, { FastifyInstance } from "fastify";
import { IServer } from "./IServer";
import { IRouter } from "../../interfaces/routes/IRouter";

export class Server implements IServer {
    private server: FastifyInstance;
    private port: number;
    private host: string;
    
    constructor(init: { routes: (new () => IRouter)[], port: number, host: string }) {
        this.server = fastify({
            logger: true,
            trustProxy: true
        });

        this.port = init.port;
        this.host = init.host;

        this.routes(init.routes);
        this.errorHandler();
    }

    private errorHandler() {
        this.server.setErrorHandler((error, _request, reply) => {
            reply.status(500).send({ message: error.message });
        });
    }

    public routes(routes: (new () => IRouter)[]) {
        routes.forEach(RouteClass => {
            const router: IRouter = new RouteClass();
            this.server.register((fastify, option, done) => {
                router.routes(fastify, option, done);
            }, 
            { prefix: router.prefix });

        });
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