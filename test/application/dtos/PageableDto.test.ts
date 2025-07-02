import { PageableSchemaDto } from "../../../src/application/dtos/PageableDto";

describe("PageableSchemaDto", () => {
    it("should parse page and size strings into numbers", () => {
        const input = { page: "2", size: "50" };
        const result = PageableSchemaDto.safeParse(input);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.page).toBe(2);
            expect(result.data.size).toBe(50);
            expect(typeof result.data.page).toBe("number");
            expect(typeof result.data.size).toBe("number");
        }
    });

    it("should fail if page or size are not strings", () => {
        const input = { page: 3, size: 10 };
        const result = PageableSchemaDto.safeParse(input);
        expect(result.success).toBe(false);
    });

    it("should fail if page or size strings cannot be converted to numbers", () => {
        const input = { page: "abc", size: "def" };
        const result = PageableSchemaDto.safeParse(input);
        expect(result.success).toBe(false);
    });
});
