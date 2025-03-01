import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createStandaloneServer } from "../src/server.js";
import { ApolloServer } from "@apollo/server";
import { AustralianState } from "@repo/graphql";
import { gql } from "@repo/graphql/__generated__/client";
import { SignJWT } from "jose";
import "dotenv/config";
let server: ApolloServer<any>, url: string;
beforeAll(async () => {
  ({ url, server } = await createStandaloneServer({ port: 0 }));
});
const buildQuery = async ({
  state,
  suburb,
  postcode,
}: {
  state?: AustralianState;
  suburb?: string;
  postcode?: string;
}) => {
  const body = {
    query: `
      query LocalityVerification($state: AustralianState, $suburb: String, $postcode: String) {
        localities(state: $state, suburb: $suburb, postcode: $postcode) {
          state,
          location,
          postcode,
        }
      }`,
    variables: {
      state,
      suburb,
      postcode,
    },
  };
  return body;
};

const makeToken = async () => {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .setIssuer(process.env.AUTH_ISSUER!)
    .setAudience(process.env.AUTH_AUDIENCE!)
    .sign(new TextEncoder().encode(process.env.AUTH_JWT_SECRET!));
  return token;
};

const executeQuery = async (body: any, token?: string) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return {
    data: response.ok ? data.data : data,
    status: response.status,
  };
};

afterAll(async () => {
  await server?.stop();
});

test("Should make successful request to the server", { retry: 3 }, async () => {
  const token = await makeToken();
  const body = await buildQuery({
    state: AustralianState.Nsw,
    suburb: "Sydney",
    postcode: "2000",
  });
  const { data, status } = await executeQuery(body, token);
  expect(status).toBe(200);
  expect(data?.localities.length).toBeGreaterThan(0);
});

test(
  "Should have empty list when query is not valid",
  { retry: 3 },
  async () => {
    const token = await makeToken();
    const body = await buildQuery({
      state: AustralianState.Vic,
      suburb: "Sydney",
      postcode: "3000",
    });
    const { data, status } = await executeQuery(body, token);
    expect(status).toBe(200);
    expect(data?.localities.length).toBe(0);
  },
);

test("should throw if both suburb and postcode are not provided", async () => {
  const token = await makeToken();
  const body = await buildQuery({ state: AustralianState.Vic });
  const { data, status } = await executeQuery(body, token);
  expect(status).toBe(400);
  expect(data.errors).toBeDefined();
});

test("should have unauthorized error when no token is provided", async () => {
  const body = await buildQuery({
    state: AustralianState.Nsw,
    suburb: "Sydney",
    postcode: "2000",
  });
  const { data, status } = await executeQuery(body);
  expect(status).toBe(401);
  expect(data.errors).toBeDefined();
});

test("should have unauthorized error when invalid token is provided", async () => {
  const body = await buildQuery({
    state: AustralianState.Nsw,
    suburb: "Sydney",
    postcode: "2000",
  });
  const { data, status } = await executeQuery(body, "invalid-token");
  expect(status).toBe(401);
  expect(data.errors).toBeDefined();
});
