import { CreateLogSchema } from "../../../src/application/dtos/CreateLogDto";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";

describe("CreateLogSchema", () => {
    it("should validate a correct payload", () => {
        const input = {
            actor: "john",
            action: ActionEnum.CREATE_RESOURCE,
            resource: "file",
            metadata: { ip: "127.0.0.1" }
        };

        const result = CreateLogSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it("should fail if action is not in enum", () => {
        const input = {
            actor: "john",
            action: "INVALID",
            resource: "file",
            metadata: {}
        };

        const result = CreateLogSchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain("action");
        }
    });

    it("should fail if actor is missing", () => {
        const input = {
            action: ActionEnum.UPDATE_RESOURCE,
            resource: "file",
            metadata: {}
        };

        const result = CreateLogSchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain("actor");
        }
    });
});
