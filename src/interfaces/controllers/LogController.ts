import { CreateLogDto, CreateLogSchema } from "@/application/dtos/CreateLogDto";
import { FilterQueryDto, FilterQuerySchema } from "@/application/dtos/FilterQueryDto";
import { CreateLog } from "@/application/use-cases/CreateLog";
import { GetLogById } from "@/application/use-cases/GetLogById";
import { GetLogsByFilter } from "@/application/use-cases/GetLogsByFilter";
import { Log } from "@/domain/entities/Log";
import { FastifyReply, FastifyRequest } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LogController {

    static async create(request: FastifyRequest, reply: FastifyReply): Promise<string> {
        const logDto = request.body as CreateLogDto;
        const parsedBody = CreateLogSchema.safeParse(logDto);

        if (!parsedBody.success) {
            return reply.status(400).send({ error: parsedBody.error });
        }

        const logCreated = await new CreateLog().execute(parsedBody.data);

        return reply.status(201).send({ id: logCreated });
    }

    static async getById(request: FastifyRequest, reply: FastifyReply): Promise<Log> {
        const params = request.params as { id: string };

        const log = await new GetLogById().execute(params.id);

        return reply.status(200).send(log);
    }

    static async getByFilters(request: FastifyRequest, reply: FastifyReply): Promise<string> {
        const queryParams = request.query as FilterQueryDto;
        const parsedQuery = FilterQuerySchema.safeParse(queryParams);


        if(!parsedQuery.success) {
            return reply.status(400).send({ error: parsedQuery.error });
        }

        const result = await new GetLogsByFilter().execute(parsedQuery.data);

        return reply.status(200).send(result);
    }
}