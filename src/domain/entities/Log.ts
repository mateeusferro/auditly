import { ActionEnum } from "./ActionEnum";

export class Log {
    public readonly id?: string;
    public readonly actor: string;
    public readonly action: ActionEnum;
    public readonly resource: string;
    public readonly timestamp?: string;
    public readonly metadata: Record<string, unknown>;

    constructor(fields: { 
        id?: string, 
        actor: string, 
        action: ActionEnum, 
        resource: string, 
        timestamp?: string, 
        metadata: Record<string, unknown>
    }) {
        const { id, actor, action, resource, timestamp, metadata} = fields;
        this.id = id;
        this.actor = actor;
        this.action = action;
        this.resource = resource;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }
}