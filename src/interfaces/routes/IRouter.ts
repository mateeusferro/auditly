import { FastifyInstance, FastifyPluginOptions } from "fastify";

export interface IRouter {
    prefix: string;
    routes(fastify: FastifyInstance, _options: FastifyPluginOptions, _done: (err?: Error) => void): void;
}