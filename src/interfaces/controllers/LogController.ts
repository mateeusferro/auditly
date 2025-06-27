import { CreateLogDto } from "@/application/dtos/CreateLogDto";
import { CreateLog } from "@/application/use-cases/CreateLog";
import { FastifyReply, FastifyRequest } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LogController {

    static async create(req: FastifyRequest, reply: FastifyReply): Promise<string> {
        const logDto = req.body as CreateLogDto;

        const logCreated = await new CreateLog().execute(logDto);

        return reply.status(201).send({ id: logCreated });
    }
}