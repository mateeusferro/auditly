import { FilterQuerySchema } from "../../../src/application/dtos/FilterQueryDto";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";

describe("FilterQuerySchema", () => {
    it("should pass with all valid fields", () => {
        const input = {
            actor: "user1",
            action: ActionEnum.CREATE_RESOURCE,
            resource: "document",
            from: "2025-01-01T00:00:00Z",
            to: "2025-12-31T23:59:59Z",
        };
        const result = FilterQuerySchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it("should pass with partial fields (optional)", () => {
        const input = {
            action: ActionEnum.UPDATE_RESOURCE,
        };
        const result = FilterQuerySchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it("should fail if action is invalid enum", () => {
        const input = {
            action: "INVALID_ACTION",
        };
        const result = FilterQuerySchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain("action");
        }
    });

    it("should fail if from or to is not string", () => {
        const input = {
            from: 12345,
            to: false,
        };
        const result = FilterQuerySchema.safeParse(input);
        expect(result.success).toBe(false);
    });
});
