import { Filter } from "../../domain/entities/Filter";

export function buildFilter(filter: Filter): [unknown[], string[]] {
    const { actor, action, resource, from, to } = filter;
    const values: unknown[] = [];
    const conditions: string[] = [];

    if (actor) {
        values.push(actor);
        conditions.push(`ACTOR = $${String(values.length)}`);
    }

    if (action) {
        values.push(action);
        conditions.push(`ACTION = $${String(values.length)}`);
    }

    if (resource) {
        values.push(resource);
        conditions.push(`RESOURCE = $${String(values.length)}`);
    }

    if (from) {
        values.push(from);
        conditions.push(`TIMESTAMP >= $${String(values.length)}`);
    }

    if (to) {
        values.push(to);
        conditions.push(`TIMESTAMP <= $${String(values.length)}`);
    }

    return [values, conditions];
}