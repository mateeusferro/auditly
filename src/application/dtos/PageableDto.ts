import { z } from "zod";

export interface Pageable<T> {
    data: T[];
    totalPages: number;
    rows: number;
}

export const PageableSchemaDto = z.object({
    page: z.string().transform(x => Number(x)),
    size: z.string().transform(x => Number(x)),
});

export type PageableDto = z.infer<typeof PageableSchemaDto>;