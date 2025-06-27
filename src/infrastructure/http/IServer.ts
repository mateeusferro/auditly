import { IRouter } from "@/interfaces/routes/IRouter";

export interface IServer {

    routes(routes: (new () => IRouter)[]): void;
    listen(): void;
}