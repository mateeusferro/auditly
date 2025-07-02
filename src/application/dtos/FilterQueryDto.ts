import { ActionEnum } from "../../domain/entities/ActionEnum";
import { z } from "zod";

export const FilterQuerySchema = z.object({
    actor: z.string().optional(),
    action: z.nativeEnum(ActionEnum).optional(),
    resource: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional()
});

export type FilterQueryDto = z.infer<typeof FilterQuerySchema>;