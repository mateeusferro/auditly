import { CreateLogDto } from "@/application/dtos/CreateLogDto";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { LogSchema } from "../validators/LogValidate";
import { LogController } from "../controllers/LogController";
import { IRouter } from "@/interfaces/routes/IRouter";
import { FilterQueryDto } from "@/application/dtos/FilterQueryDto";
import { PageableDto } from "@/application/dtos/PageableDto";

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

        fastify.get<{ Querystring: FilterQueryDto }>("/filter",
            (request, reply) =>
                LogController.getByFilters(request, reply)
        );

        fastify.get<{ Querystring: PageableDto }>("",
            (request, reply) =>
                LogController.getAll(request, reply)
        );

        fastify.get<{ Querystring: { q: string } }>("/search",
            (request, reply) =>
                LogController.search(request, reply)
        );

        fastify.get("/summary",
            (request, reply) =>
                LogController.summary(request, reply)
        );

        _done();
    }
}