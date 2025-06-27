import { ActionEnum } from "@/domain/entities/ActionEnum";
import { z } from "zod";

export const CreateLogSchema = z.object({
    actor: z.string(),
    action: z.nativeEnum(ActionEnum),
    resource: z.string(),
    metadata: z.record(z.unknown())
});

export type CreateLogDto = z.infer<typeof CreateLogSchema>;