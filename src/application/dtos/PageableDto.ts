import { z } from "zod";

export interface Pageable<T> {
    data: T[];
    totalPages: number;
    rows: number;
}

export const PageableSchemaDto = z.object({
    page: z.string()
        .transform(x => Number(x))
        .refine(n => !isNaN(n) && Number.isInteger(n) && n > 0, {
            message: "page must be a positive integer",
        }),
    size: z.string()
        .transform(x => Number(x))
        .refine(n => !isNaN(n) && Number.isInteger(n) && n > 0, {
            message: "size must be a positive integer",
        }),
});

export type PageableDto = z.infer<typeof PageableSchemaDto>;