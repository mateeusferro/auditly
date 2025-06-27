import { ActionEnum } from "./ActionEnum";

export class Log {
    public readonly id?: string;
    public readonly actor: string;
    public readonly action: ActionEnum;
    public readonly resource: string;
    public readonly createTimestamp?: Date;
    public readonly metadata: Record<string, unknown>;

    constructor(fields: { 
        id?: string, 
        actor: string, 
        action: string, 
        resource: string, 
        createTimestamp?: Date, 
        metadata: Record<string, unknown>
    }) {
        const { id, actor, action, resource, createTimestamp, metadata} = fields;
        this.id = id;
        this.actor = actor;
        this.action = action as ActionEnum;
        this.resource = resource;
        this.createTimestamp = createTimestamp;
        this.metadata = metadata;
    }
}