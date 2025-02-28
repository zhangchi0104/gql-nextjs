import { test, expect, describe, beforeAll } from "vitest";
import { loadTypedefsFromFs } from "./index";
import { writeFileSync, unlinkSync } from "fs";

const SCHEMA_GRAPHQL_CONTENT = `enum AustralianState {
  NSW
  VIC
  QLD
  SA
  WA
  TAS
  NT
}
type Locality {
  # id of the locality
  id: Int!
  # category of the locality, only "Delivery Area"
  category: String!
  # latitude of the locality
  latitude: Float!
  # name of the locality
  location: String!
  # longitude of the locality
  longitude: Float!
  # 4-digit Australian postcode
  postcode: Int!
  # state of the locality
  state: AustralianState!
}

type Localities {
  # list of localities, cannot be null or array of nulls
  localities: [Locality!]!
}
type Query {
  localities: Localities
}
`;
const TEMP_SCHEMA_PATH = "schema.tmp.graphql";
beforeAll(() => {
  writeFileSync(TEMP_SCHEMA_PATH, SCHEMA_GRAPHQL_CONTENT);
  return () => unlinkSync(TEMP_SCHEMA_PATH);
});

describe("loadTypedefsFromFs", () => {
  test("should load typedefs from default location", () => {
    const typedefs = loadTypedefsFromFs();
    expect(typedefs.length).toBeGreaterThan(0);
  });
  test("should load typedefs from non-default location", () => {
    const typedefs = loadTypedefsFromFs(TEMP_SCHEMA_PATH);
    expect(typedefs).toEqual(SCHEMA_GRAPHQL_CONTENT);
  });
  test("should throw an error if the file does not exist", () => {
    expect(() => loadTypedefsFromFs("nonexistent.graphql")).toThrow();
  });
});
