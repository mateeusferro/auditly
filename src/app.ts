import { envConfig } from "./infrastructure/configuration/env-config";
import { IServer } from "./infrastructure/http/IServer";
import { Server } from "./infrastructure/http/Server";

const port: number = envConfig.PORT;
const host: string = envConfig.HOST;

const server: IServer = new Server({
    routes: [""],
    port,
    host
});

server.listen();