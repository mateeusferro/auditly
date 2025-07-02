import { CreateLogDto, CreateLogSchema } from "../../application/dtos/CreateLogDto";
import { FilterQueryDto, FilterQuerySchema } from "../../application/dtos/FilterQueryDto";
import { Pageable, PageableDto, PageableSchemaDto } from "../../application/dtos/PageableDto";
import { CreateLog } from "../../application/use-cases/CreateLog";
import { GetAllPaginatedLogs } from "../../application/use-cases/GetAllPaginatedLogs";
import { GetLogById } from "../../application/use-cases/GetLogById";
import { GetLogsByFilter } from "../../application/use-cases/GetLogsByFilter";
import { GetSummary } from "../../application/use-cases/GetSummary";
import { SearchLogs } from "../../application/use-cases/SearchLogs";
import { Log } from "../../domain/entities/Log";
import { Summary } from "../../domain/entities/Summary";
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

    static async getAll(request: FastifyRequest, reply: FastifyReply): Promise<Pageable<Log>> {
        const queryParams = request.query as PageableDto;
        const parsedQuery = PageableSchemaDto.safeParse(queryParams);

        if(!parsedQuery.success) {
            return reply.status(400).send({ error: parsedQuery.error });
        }

        const result = await new GetAllPaginatedLogs().execute(parsedQuery.data);

        return reply.status(200).send(result);
    }

    static async search(request: FastifyRequest, reply: FastifyReply): Promise<Log[]> {
        const { q } = request.query as { q: string };

        const result = await new SearchLogs().execute(q);

        return reply.status(200).send(result);
    }

    static async summary(_request: FastifyRequest, reply: FastifyReply): Promise<Summary> {
        const result = await new GetSummary().execute();
        
        return reply.status(200).send(result);
    }
}