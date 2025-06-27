export const LogSchema = {
    type: "object",
    required: ["actor", "action", "resource", "metadata"],
    properties: {
        actor: {
            type: "string"
        },
        action: {
            type: "string"
        },
        resource: {
            type: "string"
        },
        metadata: {
            type: "object",
            additionalProperties: true
        }
    }
};