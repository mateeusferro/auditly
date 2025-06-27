import { envConfig } from "./infrastructure/configuration/env-config";
import { IServer } from "./infrastructure/http/IServer";
import { Server } from "./infrastructure/http/Server";
import { LogRoute } from "./interfaces/routes/LogRoute";

const port: number = envConfig.PORT;
const host: string = envConfig.HOST;

const server: IServer = new Server({
    routes: [LogRoute],
    port,
    host
});

server.listen();