import { describe, expect, it } from "vitest";
import LocalitiesAPI from "./datasource.js";
import "dotenv/config";
import { AustralianState } from "@repo/graphql";
// since there is no setup or teardown, we can just create a new instance of the datasource
const datasource = new LocalitiesAPI();

describe("LocalitiesAPI", () => {
  it(
    "should not return any localities for post code 3000 in NSW",
    { retry: 3 },
    async () => {
      const localities = await datasource.queryLocalities(
        "3000",
        AustralianState.Nsw,
      );
      expect(localities).toBeDefined();
      expect(localities.length).toBe(0);
    },
  );

  // skipping this test for the following reasons:
  //   1. the API returns a 500 error if the query is empty -> will crash the server
  //      the later tests will also fail during the restart of the server
  //   2. Validation will not be applied to the query as the graphql server will do that,
  //      which will be covered in the e2e tests
  it.skip("should throw [500 internal server error] if query is empty", async () => {
    await expect(
      async () => await datasource.queryLocalities("", AustralianState.Nsw),
    ).rejects.toThrow();
  });

  it(
    "should returns list of localities for post code 3000 and state vic",
    { retry: 3 },
    async () => {
      const localities = await datasource.queryLocalities(
        "3000",
        AustralianState.Vic,
      );
      expect(localities).toBeDefined();

      expect(localities.length).toBeGreaterThan(0);
    },
  );
});
