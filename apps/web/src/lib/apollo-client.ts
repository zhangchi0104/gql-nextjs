"use server";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

import { AustralianState } from "@repo/graphql";
import { localitiesQuery } from "./queries";
import { auth } from "../auth";
export async function createServerSideClient() {
  // since this is a server side function, we can just call auth to get the session
  const session = await auth();
  const link = createHttpLink({
    uri: process.env.APOLLO_SERVER_URL!,
    headers: {
      Authorization: `Bearer ${session?.accessToken ?? ""}`,
    },
  });
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
  return client;
}

interface LocalityVerificationResult {
  status: "ok" | "error";
  message: string;
}

interface ExtraLocalityVerificationOptions {
  client?: ApolloClient<NormalizedCacheObject>;
}

export async function queryLocalities(
  state?: AustralianState,
  suburb?: string,
  postcode?: string,
  options?: ExtraLocalityVerificationOptions,
) {
  const client = options?.client ?? (await createServerSideClient());

  const { data } = await client.query({
    query: localitiesQuery,
    variables: { state, postcode, suburb },
  });
  console.log("data in queryLocalities", data);
  return data.localities;
}

export async function validateLocality(
  state: AustralianState,
  suburb: string,
  postcode: string,
  options?: ExtraLocalityVerificationOptions,
): Promise<LocalityVerificationResult> {
  const localities = await queryLocalities(
    undefined,
    suburb,
    postcode,
    options,
  );
  if (localities.length === 0) {
    return {
      status: "error",
      message: `postcode ${postcode} does not match the suburb ${suburb}`,
    };
  }
  if (localities.some((l) => l.state === state)) {
    return {
      status: "ok",
      message: "the postcode, suburb, and state input are valid",
    };
  }
  return {
    status: "error",
    message: `Suburb ${suburb} does not exist in ${state}`,
  };
}
