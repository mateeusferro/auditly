export interface IServer {

    routes(routes: unknown[]): void;
    listen(): void;
}