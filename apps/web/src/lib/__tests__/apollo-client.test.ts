import { it, expect, describe } from "vitest";
import { validateLocality } from "../apollo-client";
import { AustralianState, Locality } from "@repo/graphql";
import { MockLink, MockedResponse } from "@apollo/client/testing";
import { InMemoryCache } from "@apollo/client/cache";
import { ApolloClient } from "@apollo/client";
import { localitiesQuery } from "../queries";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();

const createMockPair = (
  postCode: number,
  state: AustralianState,
  location: string,
) => [
  {
    request: {
      query: localitiesQuery,
      variables: {
        postcode: postCode.toString(),
        suburb: location,
        state,
      },
    },
    result: {
      data: {
        localities: [{ location, postcode: postCode, state }],
      },
    },
  },
  {
    request: {
      query: localitiesQuery,
      variables: {
        postcode: postCode.toString(),
        suburb: location,
        state: undefined,
      },
    },
    result: {
      data: {
        localities: [{ location, postcode: postCode, state }],
      },
    },
  },
];

const MOCKS: MockedResponse<{
  localities: Pick<Locality, "location" | "postcode" | "state">[];
}>[] = [
  ...createMockPair(3000, AustralianState.Vic, "MELBOURNE"),
  ...createMockPair(3156, AustralianState.Vic, "FERNTREE GULLY"),
  ...createMockPair(4000, AustralianState.Qld, "BRISBANE"),
  ...createMockPair(4566, AustralianState.Qld, "NOOSA HEADS"),
  ...createMockPair(2010, AustralianState.Nsw, "SURRY HILLS"),
  ...createMockPair(2007, AustralianState.Nsw, "BROADWAY"),
  ...createMockPair(6000, AustralianState.Wa, "PERTH"),
  ...createMockPair(6163, AustralianState.Wa, "FREMANTLE"),
  ...createMockPair(5000, AustralianState.Sa, "ADELAIDE"),
  ...createMockPair(5251, AustralianState.Sa, "MOUNT BARKER"),
  ...createMockPair(7000, AustralianState.Tas, "HOBART"),
  ...createMockPair(2000, AustralianState.Nsw, "SYDNEY"),
  ...createMockPair(7250, AustralianState.Tas, "LAUNCESTON"),
  ...createMockPair(2153, AustralianState.Nsw, "BAULKHAM HILLS"),
  {
    request: {
      query: localitiesQuery,
      variables: {
        postcode: "2000",
        suburb: "BROADWAY",
      },
    },
    result: {
      data: {
        localities: [],
      },
    },
  },
];

const mockLink = new MockLink(MOCKS);
const client = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
});

const validateLocalityWithMockClient = (
  state: AustralianState,
  suburb: string,
  postcode: string,
) => validateLocality(state, suburb, postcode, { client });
describe("postcode, suburb and state verification", () => {
  it("should verify the postcode, suburb and state", async () => {
    const assertOk = async (
      state: AustralianState,
      suburb: string,
      postcode: string,
    ) => {
      const result = await validateLocalityWithMockClient(
        state,
        suburb.toUpperCase(),
        postcode,
      );
      expect(result.status).toBe("ok");
    };

    await assertOk(AustralianState.Vic, "Melbourne", "3000");
    await assertOk(AustralianState.Vic, "Ferntree Gully", "3156");
    await assertOk(AustralianState.Qld, "Brisbane", "4000");
    await assertOk(AustralianState.Qld, "Noosa Heads", "4566");
    await assertOk(AustralianState.Nsw, "Surry Hills", "2010");
    await assertOk(AustralianState.Nsw, "Broadway", "2007");
    await assertOk(AustralianState.Wa, "Perth", "6000");
    await assertOk(AustralianState.Wa, "Fremantle", "6163");
    await assertOk(AustralianState.Sa, "Adelaide", "5000");
    await assertOk(AustralianState.Sa, "Mount Barker", "5251");
    await assertOk(AustralianState.Tas, "Hobart", "7000");
    await assertOk(AustralianState.Tas, "Launceston", "7250");
  });

  it("should fail if there is a mismatch between postcode and suburb", async () => {
    const result = await validateLocalityWithMockClient(
      AustralianState.Nsw,
      "Broadway".toUpperCase(),
      "2000",
    );
    expect(result.status).toBe("error");
    expect(result.message).toBe(
      "postcode 2000 does not match the suburb BROADWAY",
    );
  });
  it("should fail if there is a mismatch between state and suburb", async () => {
    const result = await validateLocalityWithMockClient(
      AustralianState.Vic,
      "Baulkham Hills".toUpperCase(),
      "2153",
    );
    expect(result.status).toBe("error");
    expect(result.message).toBe("Suburb BAULKHAM HILLS does not exist in VIC");
  });
});
