import { buildFilter } from "../../../src/infrastructure/utils/FilterUtil";
import { Filter } from "../../../src/domain/entities/Filter";
import { ActionEnum } from "../../../src/domain/entities/ActionEnum";

describe("buildFilter", () => {

    it("should return empty arrays when fields aren't filled", () => {
        const filter: Filter = new Filter({});
        const [values, conditions] = buildFilter(filter);

        expect(values).toEqual([]);
        expect(conditions).toEqual([]);
    });

    it("should build filter for actor", () => {
        const filter: Filter = new Filter({ actor: "Actor Test" });
        const [values, conditions] = buildFilter(filter);

        expect(values).toEqual(["Actor Test"]);
        expect(conditions).toEqual(["ACTOR = $1"]);
    });
    
    it("should build filter for multiple fields", () => {
        const filter: Filter = new Filter({ 
            actor: "Actor Test",
            action: ActionEnum.CREATE_RESOURCE,
            resource: "Resource Test",
            from: "2025-01-01",
            to: "2025-12-31",
        });
        const [values, conditions] = buildFilter(filter);

        expect(values).toEqual([
            "Actor Test",
            "CREATE_RESOURCE",
            "Resource Test",
            "2025-01-01",
            "2025-12-31"
        ]);
        expect(conditions).toEqual([
            "ACTOR = $1",
            "ACTION = $2",
            "RESOURCE = $3",
            "TIMESTAMP >= $4",
            "TIMESTAMP <= $5"
        ]);
    });
    
    it("should maintain correct index ordering when some filters are missing", () => {
        const filter: Filter = new Filter({
            action: ActionEnum.DELETE_RESOURCE,
            to: "2025-07-01",
        });

        const [values, conditions] = buildFilter(filter);

        expect(values).toEqual([
            "DELETE_RESOURCE", 
            "2025-07-01"
        ]);
        expect(conditions).toEqual([
            "ACTION = $1",
            "TIMESTAMP <= $2",
        ]);
    });
});