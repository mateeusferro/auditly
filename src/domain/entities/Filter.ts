import { ActionEnum } from "./ActionEnum";

export class Filter {
    public readonly actor?: string;
    public readonly action?: ActionEnum;
    public readonly resource?: string;
    public readonly from?: string;
    public readonly to?: string;

    constructor(fields: {
        actor?: string,
        action?: ActionEnum,
        resource?: string,
        from?: string,
        to?: string
    }) {
        const { actor, action, resource, from, to } = fields;
        this.actor = actor;
        this.action = action;
        this.resource = resource;
        this.from = from;
        this.to = to;
    }
}