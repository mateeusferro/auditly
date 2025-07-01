import { CreateLogDto } from "@/application/dtos/CreateLogDto";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { LogSchema } from "../validators/LogValidate";
import { LogController } from "../controllers/LogController";
import { IRouter } from "@/interfaces/routes/IRouter";
import { FilterQueryDto } from "@/application/dtos/FilterQueryDto";

export class LogRoute implements IRouter {
    public prefix = "/log";

    routes(fastify: FastifyInstance, _options: FastifyPluginOptions, _done: (err?: Error) => void): void {
        fastify.post<{ Body: CreateLogDto }>(
            "",
            {
                schema: {
                    body: LogSchema
                }
            },
            (request, reply) => 
                LogController.create(request, reply)
        );

        fastify.get("/:id", 
            (request, reply) =>
                LogController.getById(request, reply)  
        );

        fastify.get<{ Querystring: FilterQueryDto }>("",
            (request, reply) =>
                LogController.getByFilters(request, reply)
        );

        _done();
    }
}