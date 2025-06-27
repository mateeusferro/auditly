import { ActionEnum } from "@/domain/entities/ActionEnum";
import { z } from "zod";

const actionEnum = Object.values(ActionEnum) as [string, ...string[]];

export const CreateLogSchema = z.object({
    actor: z.string(),
    action: z.enum(actionEnum),
    resource: z.string(),
    metadata: z.record(z.unknown())
});

export type CreateLogDto = z.infer<typeof CreateLogSchema>;